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
    // .then(async function (result) {
    //     // console.log(result)
    //     // if (result.credential) {
    //     //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     //     const token = result.credential.accessToken
    //     //     // ...
    //     // }
    //     // // The signed-in user info.
    //     const user = result.user

    //     if (user !== null) {
    //         // console.log(user.uid)
    //         const response = await fetch.login(user.uid)

    //         if (response.status === 200) {
    //             window.location.assign(window.location.origin + '/home')
    //         }
    //     }

    //     // firebase.auth().onAuthStateChanged((user) => {
    //     //     if (user) {
    //     //         // User logged in already or has just logged in.
    //     //         console.log(user.uid)
    //     //     } else {
    //     //         // User not logged in or has just logged out.
    //     //     }
    //     // })
    // })
    // .catch(function (error) {
    //     // console.log(error)

    //     // Handle Errors here.
    //     // const errorCode = error.code
    //     const errorMessage = error.message
    //     // The email of the user's account used.
    //     // const email = error.email
    //     // The firebase.auth.AuthCredential type that was used.
    //     // const credential = error.credential
    //     // ...

    //     // console.log(errorMessage)

    //     if (errorMessage === 'Request failed with status code 404') {
    //         console.log('not in databse')
    //         createUser()
    //     }
    // })
}
