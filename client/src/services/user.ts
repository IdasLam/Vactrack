import * as firebase from 'firebase/app'
import 'firebase/auth'
import { stringify } from 'querystring'
import * as fetch from '../models/family/family'

type SignIn = () => void
type SignOut = () => void
type OAuth = () => void

const provider = new firebase.auth.GoogleAuthProvider()

export const signIn: SignIn = () => {
    firebase.auth().signInWithRedirect(provider)
}

export const signOut: SignOut = () => {
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

export const Oauth: OAuth = () => {
    firebase
        .auth()
        .getRedirectResult()
        .then(async function (result) {
            // console.log(result)
            // if (result.credential) {
            //     // This gives you a Google Access Token. You can use it to access the Google API.
            //     const token = result.credential.accessToken
            //     // ...
            // }
            // // The signed-in user info.
            const user = result.user

            if (user !== null) {
                console.log(user.uid)

                const status = await fetch.login(user.uid)

                console.log(status.status)
            }

            // firebase.auth().onAuthStateChanged((user) => {
            //     if (user) {
            //         // User logged in already or has just logged in.
            //         console.log(user.uid)
            //     } else {
            //         // User not logged in or has just logged out.
            //     }
            // })
        })
        .catch(function (error) {
            console.log(error)

            // Handle Errors here.
            const errorCode = error.code
            const errorMessage = error.message
            // The email of the user's account used.
            // const email = error.email
            // The firebase.auth.AuthCredential type that was used.
            // const credential = error.credential
            // ...

            console.log(errorMessage)
        })
}
