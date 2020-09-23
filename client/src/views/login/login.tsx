import React, { FunctionComponent, useEffect, useState } from 'react'
import Logo from '../../components/logo/logo'
import './login.scss'
import { TextField, Button } from '@material-ui/core'
import * as user from '../../services/user'

// type Credentials = {
//     email: string | null
//     password: string | null
// }

// type ValidatedCredentials = {
//     email: string
//     password: string
// }

const Login: FunctionComponent = () => {
    // const client_id = '8369cae8-b48f-4086-ae04-a728930b4a05'
    // const emailInput = "login-email"
    // const passwordInput = "login-password"

    // const [validEmail, setValidEmail] = useState(true)
    // const [validPassword, setValidPassword] = useState(true)
    // const [credentials, setCredentials] = useState<Credentials>({email: null, password: null})

    // const handeInput = (id: string) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    //     const input = event.target.value

    //     switch (id) {
    //         case emailInput:
    //             setValidEmail(validate.email(input))
    //             setCredentials({...credentials, email: emailInput})
    //             break;

    //         case passwordInput:
    //             setValidPassword(validate.password(input))
    //             setCredentials({...credentials, password: passwordInput})
    //         break;
    //     }
    // }

    // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault()
    //     console.log("hello");

    //     if (credentials.email === null || credentials.password === null) {
    //         return
    //     }

    //     user.login(credentials as ValidatedCredentials)
    // }

    useEffect(() => {
        user.Oauth()
    }, [])

    return (
        <div className="login-container">
            <Logo />
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
