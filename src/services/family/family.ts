// import Axios, { AxiosResponse } from 'axios'
// import { url } from '../api/api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import dayjs from 'dayjs'
import {
    Name,
    Person,
    ActiveVaccine,
    AllTypesOfVaccines,
    Family,
    PastVaccinations,
    Vaccinations,
    VaccineData,
    InputVaccineData,
} from '../../models/family'

// const auth = firebase.auth()
const firestore = firebase.firestore()

// type Fetch = (uid: string, name?: string) => Promise<AxiosResponse<any>>
/**
 * Create user in database
 * @param uid
 * @param name
 */
export const create = async (uid: string, name: string, email: string) => {
    const docRef = firestore.collection('family').doc(uid)

    await docRef.set({
        [name]: {
            status: 'user',
            vaccines: [],
            activeVaccines: [],
            email: [email],
        },
    })

    return 200
}

export const userExsists = async (user: firebase.User) => {
    const uid = user.uid
    const name = user.displayName
    const email = user.email

    const docRef = await firestore.collection('family').doc(uid).get()
    const exsists = docRef.exists

    if (!exsists && name && email) {
        const res = await create(uid, name, email)

        return res === 200
    }

    return true
}

/**
 * Login user, if user dont already exist create one
 * @param uid
 */
// export const login = async (uid: string, name: string) => {
//     // const response = await Axios.post(url + '/api/account', { uid })

//     // console.log(response)
//     // return response
//     const res = await firestore.collection('family').doc(uid).get()

//     if (res.exists) {
//         return 200
//     }

//     create(uid, name)
// }

// export const allFamily = async (uid: string) => {
//     const res = await firestore.collection('family').doc(uid).get()
//     return res.data
// }

type FilteredActiveVaccines = {
    [key: string]: ActiveVaccine[]
}

// Get revaccinations 3 months ahead, whole family
export const filterActiveVaccines = (family: Family): FilteredActiveVaccines => {
    return Object.entries(family).reduce((acc, curr) => {
        const vaccinationNotificationRange = 3
        const [name, data] = curr
        const { activeVaccines } = data

        if (activeVaccines !== undefined) {
            const upcomingVaccines = activeVaccines.filter((vaccine) => {
                const date = dayjs(vaccine.date.toDate())
                const diff = date.diff(dayjs(), 'month')

                return diff <= vaccinationNotificationRange && diff >= 0
            })

            return {
                ...acc,
                [name]: upcomingVaccines,
            }
        }

        return {
            ...acc,
        }
    }, {})
}

// for every person in document
export const anyActiveVaccines = (vaccinations: Vaccinations) => {
    const vaccines = Object.entries(vaccinations).map((row) => {
        const data = row[1]

        return data.length > 0
    })

    return vaccines.includes(true)
}

export const getDataForUser = (value: Family, firstname: string | null) => {
    return Object.entries(value).find((row) => {
        const fullname = row[0].toLowerCase()

        return (
            firstname !== null && (fullname === firstname.toLowerCase() || fullname.includes(firstname.toLowerCase()))
        )
    })
}

export const filterActiveVaccinesByPerson = (family: Family, name: string) => {
    const familyActiveVaccines = filterActiveVaccines(family)

    const res = Object.entries(familyActiveVaccines).find((row) => {
        return row[0] === name
    })

    if (!res) {
        return {}
    }

    const [clientName, data] = res

    return { [clientName]: data }
}

// export const pastVaccinatons = (allVaccines:AllTypesOfVaccines[]) => {
//     allVaccines.forEach(vaccine => {
//         console.log(vaccine);

//     })
// }

export const pastVaccinatons: PastVaccinations = (family, name) => {
    const person = Object.entries(family).find((row) => {
        return row[0] === name
    })

    if (!person) {
        return []
    }

    const [, data] = person
    // const missingVaccines = data.activeVaccines.filter((activeVaccine) => {
    //     return data.vaccines.some((vaccine) => {
    //         return activeVaccine.name === vaccine.name
    //     })
    // })

    const allVaccinations: AllTypesOfVaccines[] = [...data.activeVaccines, ...data.vaccines]

    return allVaccinations
}

type UserStatus = (data: [string, Person]) => string

export const getUserStatus: UserStatus = (data) => {
    const userData = data[1]

    return userData.status
}

type GetNames = (data: Family, lowercased?: boolean) => Name[]

export const getAllNames: GetNames = (data, lowercased = true) => {
    const names = Object.entries(data).map((row) => {
        const [name] = row

        if (lowercased) {
            return name.toLowerCase()
        }
        return name
    })

    if (names) {
        return names
    }

    return []
}

export const addPerson = async (
    uid: string,
    status: string,
    name: string,
    date: firebase.firestore.Timestamp | string,
) => {
    const data = {
        [name]: {
            activeVaccines: [],
            birthday: date,
            status: status,
            vaccines: [],
        },
    }

    await firestore.collection('family').doc(uid).set(data, { merge: true })
}

export const addVaccine = async (family: Family, data: InputVaccineData, uid: string) => {
    const { name, vaccineName, date, revaccination } = data
    const userDataArray = getDataForUser(family, name)

    const vaccineData: VaccineData = {
        name: vaccineName,
        date: date,
        revaccination,
    }

    if (userDataArray) {
        const userData = userDataArray[1]

        if (vaccineData.revaccination !== undefined) {
            userData.activeVaccines.push(vaccineData as ActiveVaccine)
        } else {
            const { revaccination, ...vaccine } = vaccineData
            userData.vaccines.push(vaccine)
        }

        family[name] = userData

        console.log(family)

        await firestore.collection('family').doc(uid).set(family)
    }
}
