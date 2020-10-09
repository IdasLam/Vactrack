import * as firebase from 'firebase/app'
import 'firebase/auth'

const provider = new firebase.auth.GoogleAuthProvider()

/**
 * Sign in with firebase auth
 */
export const signIn = () => {
    firebase.auth().signInWithRedirect(provider)
}

/**
 * Sign out with firebase auth
 * @returns void
 */
export const signOut = () => {
    return firebase.auth().signOut()
}

/**
 * Get the user info from logged in user
 * @returns firebase.User | null
 */
export const getCurrentUser = () => {
    return firebase.auth().currentUser
}

/**
 * Get user id from logged in user
 * @returns string
 */
export const getUid = () => {
    const user = getCurrentUser()

    return user?.uid ?? ''
}
