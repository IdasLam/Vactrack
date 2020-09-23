import React, { FunctionComponent, useEffect, useState } from 'react'
import SloganLogo from '../../components/logo/logo'
import './login.scss'
import { Button } from '@material-ui/core'
import * as user from '../../services/user/user'
import * as fetch from '../../services/family/family'
import { createUser } from '../../services/user/create'
import { useHistory } from 'react-router-dom'

const auth = async (history: any) => {
    try {
        const result = await user.Oauth()
        if (result.credential) {
            const user = result.user

            if (user !== null) {
                const response = await fetch.login(user.uid)

                if (response.status === 200) {
                    history.replace('/home')
                }
            }
        }
    } catch (error) {
        const errorMessage = error.message

        if (errorMessage === 'Request failed with status code 404') {
            console.log('not in databse')
            const success = await createUser()

            if (success) {
                return history.replace('/home')
            }

            console.log('error unable to create user')
        }
    }
}

const Login: FunctionComponent = () => {
    const history = useHistory()

    useEffect(() => {
        auth(history)

        // firebase.auth().onAuthStateChanged(async (user) => {
        //     if (user) {
        //         console.log('logedin', user.uid)
        //     } else {
        //         // User not logged in or has just logged out.
        //         // redirect to login

        //         console.log('not')
        //     }
        // })
    }, [])

    return (
        <div className="login-container">
            <SloganLogo />
            <div className="image-wrapper">
                <img className="login-container__img" src="login.png" alt="" />
            </div>
            <div className="login-container_register_login">
                <div>
                    <h1>Login</h1>
                    <Button onClick={user.signIn}>
                        <img src="btn_google_signin_light_normal_web.png" alt="" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Login
