// import Axios, { AxiosResponse } from 'axios'
// import { url } from '../api/api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'
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
 * @returns 200
 */
export const create = async (uid: string, name: string, email: string) => {
    const docRef = firestore.collection('family').doc(uid)

    await docRef.set({
        [name]: {
            status: 'user',
            vaccines: [],
            activeVaccines: [],
            email: email,
        },
    })

    return 200
}

/**
 * If the user exsist return true else will create new user in database
 * @param user
 * @returns boolean
 */
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

type FilteredActiveVaccines = {
    [key: string]: ActiveVaccine[]
}

/**
 * Get revaccinations 3 months ahead, whole family
 * @param family
 * @returns FilteredActiveVaccines
 */
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

/**
 * Get data for specific person in family
 * @param uid
 * @param name
 * @returns Person | undefined
 */
export const getPersonData = async (uid: string, name: string) => {
    const family = await firestore.collection('family').doc(uid).get()
    const data = family.data()

    if (data !== undefined) {
        return data[name] as Person
    }
}

/**
 * If any active vaccines for the whole family or person
 * @param vaccinations
 * @returns boolean
 */
export const anyActiveVaccines = (vaccinations: Vaccinations) => {
    const vaccines = Object.entries(vaccinations).map((row) => {
        const data = row[1]

        return data.length > 0
    })

    return vaccines.includes(true)
}

/**
 * Get data for specific person
 * @param value
 * @param firstname
 * @returns user data, [string, Person] | undefined
 */
export const getDataForUser = (value: Family, firstname: string | null) => {
    return Object.entries(value).find((row) => {
        const fullname = row[0].toLowerCase()

        return (
            firstname !== null && (fullname === firstname.toLowerCase() || fullname.includes(firstname.toLowerCase()))
        )
    })
}

/**
 * Get what category the vaccination comes from
 *
 * @param family
 * @param id
 * @param nameSearch
 * @returns "activeVaccines" | "vaccines" | undefined
 */
export const vaccineFrom = (family: Family, id: string, nameSearch: string) => {
    const { activeVaccines, vaccines } = family[nameSearch]

    const vaccineData = activeVaccines.find((vaccine) => {
        return vaccine.id === id
    })

    if (vaccineData === undefined) {
        const regularVaccine = vaccines.find((vaccine) => {
            return vaccine.id === id
        })

        return regularVaccine ? 'vaccines' : undefined
    }

    return 'activeVaccines'
}

/**
 * Get vaccine data
 * @param family
 * @param vaccineCategory
 * @param id
 * @param nameSearch
 * @returns Vaccine | undefined
 */
export const getDataForVaccine = (
    family: Family,
    vaccineCategory: 'activeVaccines' | 'vaccines',
    id: string,
    nameSearch: string,
) => {
    const { activeVaccines, vaccines } = family[nameSearch]

    if (vaccineCategory === 'activeVaccines') {
        return activeVaccines.find((vaccine) => {
            return vaccine.id === id
        })
    } else if (vaccineCategory === 'vaccines') {
        return vaccines.find((vaccine) => {
            return vaccine.id === id
        })
    }

    return undefined
}

/**
 * Get upcoming vaccinations for person
 * @param family
 * @param name
 * @returns object
 */
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

/**
 * Get past vaccinations for user
 * @param family
 * @param name
 * @returns array
 */
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

/**
 * Get the status of user
 * @param data
 * @returns string
 */
export const getUserStatus: UserStatus = (data) => {
    const userData = data[1]

    return userData.status
}

type GetNames = (data: Family, lowercased?: boolean) => Name[]

/**
 * Get all family members names
 * @param data
 * @param lowercased
 * @returns array
 */
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

/**
 * Add new person to the family
 * @param uid
 * @param status
 * @param name
 * @param date
 * @returns void
 */
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

/**
 * Add a new vaccine for specific user
 * @param family
 * @param data
 * @param uid
 * @returns void
 */
export const addVaccine = async (family: Family, data: InputVaccineData, uid: string) => {
    const { name, vaccineName, date, revaccination } = data
    const userDataArray = getDataForUser(family, name)

    const vaccineData: VaccineData = {
        name: vaccineName,
        date: date,
        revaccination,
        reminded: false,
        id: uuid(),
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

        await firestore.collection('family').doc(uid).set(family)
    }
}

/**
 * Edit person
 * @param uid
 * @param name
 * @param status
 * @param birthday
 * @param newName
 * @returns void
 */
export const editPerson = async (uid: string, name: string, status: string, birthday: any, newName: string) => {
    const docRef = firestore.collection('family').doc(uid)

    await docRef.update({
        [`${name}.status`]: status,
    })

    if (birthday) {
        await docRef.update({
            [`${name}.birthday`]: birthday,
        })
    }

    if (newName.toLowerCase() !== name.toLowerCase()) {
        const family = (await docRef.get()).data()

        if (family) {
            const person = family[name]

            delete family[name]

            const newFamily = {
                ...family,
                [newName]: person,
            }

            await docRef.set(newFamily)
        }
    }
}

/**
 * Remove person from the database
 * @param uid
 * @param name
 * @returns void
 */
export const deletePerson = async (uid: string, name: string) => {
    const docRef = firestore.collection('family').doc(uid)
    const family = (await docRef.get()).data()

    if (family) {
        delete family[name]
        await docRef.set(family)
    }
}

/**
 * Edit vaccine in the database
 * @param uid
 * @param personName
 * @param vaccineName
 * @param vaccineDate
 * @param unsetRevaccination
 * @param vaccineCategory
 * @param vaccineId
 * @returns void
 */
export const editVaccine = async (
    uid: string,
    personName: string,
    vaccineName: string,
    vaccineDate: string,
    unsetRevaccination: boolean,
    vaccineCategory: 'activeVaccines' | 'vaccines',
    vaccineId: string,
) => {
    const docRef = firestore.collection('family').doc(uid)
    const family = (await docRef.get()).data() as Family

    if (family) {
        const person = family[personName]
        const vaccines = person[vaccineCategory]
        let vaccineIndex

        const vaccine = vaccines.find((vaccineData, index) => {
            if (vaccineData.id === vaccineId) {
                vaccineIndex = index
                return vaccineData
            }
        }) as AllTypesOfVaccines

        if (vaccine) {
            vaccine.name = vaccineName
            vaccine.date = firebase.firestore.Timestamp.fromDate(new Date(vaccineDate))

            if (!unsetRevaccination) {
                await docRef.update({
                    [`${personName}.${vaccineCategory}`]: vaccines,
                })
            } else if (unsetRevaccination && vaccineIndex !== undefined) {
                vaccines.splice(vaccineIndex, 1)
                delete vaccine.revaccination

                vaccine.reminded = false

                const takenVaccineList = person.vaccines

                const newVaccineList = [...takenVaccineList, vaccine]

                await docRef.update({
                    [`${personName}.vaccines`]: newVaccineList,
                    [`${personName}.activeVaccines`]: vaccines,
                })
            }
        }
    }
}

/**
 * Remove vaccine from specific user
 * @param uid
 * @param vaccineId
 * @param vaccineCategory
 * @param personName
 * @returns void
 */
export const deleteVaccine = async (
    uid: string,
    vaccineId: string,
    vaccineCategory: 'activeVaccines' | 'vaccines',
    personName: string,
) => {
    const docRef = firestore.collection('family').doc(uid)
    const family = (await docRef.get()).data() as Family

    if (family) {
        const person = family[personName]
        const vaccines = person[vaccineCategory]
        let vaccineIndex

        const vaccine = vaccines.find((vaccineData, index) => {
            if (vaccineData.id === vaccineId) {
                vaccineIndex = index
                return vaccineData
            }
        }) as AllTypesOfVaccines

        if (vaccine && vaccineIndex !== undefined) {
            vaccines.splice(vaccineIndex, 1)

            await docRef.update({
                [`${personName}.${vaccineCategory}`]: vaccines,
            })
        }
    }
}
