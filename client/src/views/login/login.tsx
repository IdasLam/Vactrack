import React, { FunctionComponent } from 'react'
import Logo from '../../components/logo/logo'
import './login.scss'

const Login: FunctionComponent = () => {
    return (
        <div className="login-container">
            <Logo />
            <div className="image-wrapper">
                <img className="login-container__img" src="login.png" alt="" />
            </div>
            <div className="login-container_google-login">
                <div>
                    <h1>Login</h1>
                    <a href="#">login link</a>
                </div>
            </div>
        </div>
    )
}

export default Login
