import React, { FunctionComponent } from 'react'
import SloganLogo from '../../components/logo/sloganlogo'
import './login.scss'
import { Button } from '@material-ui/core'
import * as user from '../../services/user/user'

const Login: FunctionComponent = () => {
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
