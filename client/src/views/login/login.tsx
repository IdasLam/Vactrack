import React, { FunctionComponent, useEffect, useState } from 'react'
import SloganLogo from '../../components/logo/sloganlogo'
import './login.scss'
import { Button, CircularProgress } from '@material-ui/core'
import * as user from '../../services/user/user'
import * as fetch from '../../services/family/family'
import { createUser } from '../../services/user/create'
import { useHistory } from 'react-router-dom'

const auth = async (history: any, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
        setLoading(true)
        const result = await user.Oauth()

        if (result.credential) {
            const user = result.user

            if (user !== null) {
                setLoading(false)
                const response = await fetch.login(user.uid)

                if (response.status === 200) {
                    return history.replace('/home')
                }
            }
        }
        setLoading(false)
    } catch (error) {
        setLoading(false)
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
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loggedIn = user.isLoggedIn()

        console.log(loggedIn)

        if (!loggedIn) {
            auth(history, setLoading)
        }

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

    if (loading) {
        return (
            <div className="loader">
                <CircularProgress />
            </div>
        )
    }

    return (
        <div className="login-container">
            <SloganLogo />
            <div className="image-wrapper">
                <img className="login-container__img" src="login.png" alt="" />
            </div>
            <div className="login-container_register_login">
                <div>
                    <h1>Login</h1>
                    <Button
                        onClick={() => {
                            user.signIn()
                        }}
                    >
                        <img src="btn_google_signin_light_normal_web.png" alt="" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Login
