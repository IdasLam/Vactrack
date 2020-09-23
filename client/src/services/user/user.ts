import * as firebase from 'firebase/app'
import 'firebase/auth'
import { stringify } from 'querystring'
import * as fetch from '../family/family'
import { createUser } from './create'

const provider = new firebase.auth.GoogleAuthProvider()

export const signIn = () => {
    firebase.auth().signInWithRedirect(provider)
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
