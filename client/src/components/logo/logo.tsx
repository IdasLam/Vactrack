import React, { FunctionComponent } from 'react'
import './logo.scss'

const Logo: FunctionComponent = () => {
    return (
        <div className="logo-container">
            <img className="logo-container__img" src="vactrack.svg" alt="" />
            <p className="logo-container__slogan">Keeps track of you vaccinations</p>
        </div>
    )
}

export default Logo
