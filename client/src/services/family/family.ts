import Axios, { AxiosResponse } from 'axios'
import { url } from '../api/api'

// type Credantials2 = {
//     email: string
//     password: string
// }

// type Credentials = (uid: string) => boolean

// export const login = async (credantials: Credantials2) => {
//     const response = await Axios.post('/api/login', credantials)

//     console.log(response)
// }

type Fetch = (uid: string, name?: string) => Promise<AxiosResponse>

/**
 * Login user, response depening on new user or not
 * @param uid
 */
export const login: Fetch = async (uid) => {
    const response = await Axios.post(url + '/api/account', { uid })

    console.log(response)
    return response
}

/**
 * Create user in database
 * @param uid
 * @param name
 */
export const create: Fetch = async (uid, name) => {
    const response = await Axios.post(url + '/api/account/create', { uid, name })

    return response
}
