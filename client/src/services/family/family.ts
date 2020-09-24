// import Axios, { AxiosResponse } from 'axios'
// import { url } from '../api/api'
import firebase from 'firebase/app'
import 'firebase/firestore'
import dayjs from 'dayjs'
import { Family, Person } from '../../models/family'

const auth = firebase.auth()
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
            activeVaccines: firebase.firestore.FieldValue.serverTimestamp(),
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

        const upcomingVaccines = activeVaccines.filter((vaccine) => {
            const date = dayjs(vaccine.date.toDate())
            const diff = date.diff(dayjs(), 'month')

            return diff <= vaccinationNotificationRange && diff >= 0
        })

        return {
            ...acc,
            [name]: upcomingVaccines,
        }
    }, {})
}

// const ppl = {
//     'alle balle': {
//         age: 10,
//         money: 4,
//     },
//     knullfitta: {
//         age: 12,
//         money: 5,
//     },
//     boll: {
//         age: 2,
//         money: 6,
//     },
// }

// Object.entries(ppl).reduce((acc, curr) => {
//     const [name, data] = curr
//     const { money, age } = data

//     if (age < 10) {
//         return acc
//     }

//     return {
//         ...acc,
//         [name]: money
//     }

// }, {})
