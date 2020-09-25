// import Axios, { AxiosResponse } from 'axios'
// import { url } from '../api/api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import dayjs from 'dayjs'
import { Family, Vaccinations } from '../../models/family'

// const auth = firebase.auth()
const firestore = firebase.firestore()

// type Fetch = (uid: string, name?: string) => Promise<AxiosResponse<any>>

/**
 * Create user in database
 * @param uid
 * @param name
 */
export const create = async (uid: string, name: string) => {
    // const response = await Axios.post(url + '/api/account/create', { uid, name })
    // return response

    const docRef = firestore.collection('family').doc(uid)

    await docRef.set({
        [name]: {
            status: 'user',
            vaccines: [],
            activeVaccines: [],
        },
    })

    return 200
}

/**
 * Login user, if user dont already exist create one
 * @param uid
 */
export const login = async (uid: string, name: string) => {
    // const response = await Axios.post(url + '/api/account', { uid })

    // console.log(response)
    // return response
    const res = await firestore.collection('family').doc(uid).get()

    if (res.exists) {
        return 200
    }

    create(uid, name)
}

export const filterActiveVaccines = (family: Family) => {
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

        return firstname !== null && fullname.includes(firstname)
    })
}
