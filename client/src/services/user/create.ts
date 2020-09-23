import * as firebase from 'firebase/app'
import 'firebase/auth'
import * as fetch from '../family/family'
import { useHistory } from 'react-router-dom'

/**
 * Create new user in databse
 */
export const createUser = async () => {
    const user = firebase.auth().currentUser

    if (user) {
        // User logged in already or has just logged in.

        const name = user.displayName

        if (name) {
            const response = await fetch.create(user.uid, name)
            console.log(response)
            return response.status === 200
        }
    }

    return false
}
