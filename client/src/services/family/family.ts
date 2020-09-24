import Axios, { AxiosResponse } from 'axios'
import { url } from '../api/api'
import firebase from 'firebase/app'
import 'firebase/firestore'

const auth = firebase.auth()
const firestore = firebase.firestore()

type Fetch = (uid: string, name?: string) => Promise<AxiosResponse<any>>

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
