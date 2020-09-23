import Axios from 'axios'

// type Credantials2 = {
//     email: string
//     password: string
// }

// type Credentials = (uid: string) => boolean

// export const login = async (credantials: Credantials2) => {
//     const response = await Axios.post('/api/login', credantials)

//     console.log(response)
// }

export const login = async (uid: string) => {
    const response = await Axios.post('/api/account', uid)

    // console.log(response)
    return response
}
