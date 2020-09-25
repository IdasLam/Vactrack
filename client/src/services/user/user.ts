import * as firebase from 'firebase/app'
import 'firebase/auth'

const provider = new firebase.auth.GoogleAuthProvider()

export const signIn = () => {
    firebase.auth().signInWithRedirect(provider)
    // console.log('loged')
}

export const signOut = () => {
    firebase
        .auth()
        .signOut()
        .then(function () {
            // Sign-out successful.
        })
        .catch(function (error) {
            // An error happened.
        })
}

export const Oauth = () => {
    return firebase.auth().getRedirectResult()
}

export const isLoggedIn = () => {
    // console.log(firebase.auth().currentUser)

    return firebase.auth().currentUser !== null
}

export const getCurrentUser = () => {
    return firebase.auth().currentUser
}

export const getUid = () => {
    const user = getCurrentUser()

    return user?.uid ?? ''
}
