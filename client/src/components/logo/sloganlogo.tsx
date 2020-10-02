import React, { FunctionComponent } from 'react'
import './logo.scss'

const SloganLogo: FunctionComponent = () => {
    return (
        <div className="logo-container-slogan">
            <img className="logo-container__img" src="/vactrack.svg" alt="" />
            <p className="logo-container__slogan">Keeps track of you vaccinations</p>
        </div>
    )
}

export default SloganLogo
