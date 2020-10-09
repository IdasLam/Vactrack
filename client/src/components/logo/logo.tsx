import React, { FunctionComponent } from 'react'
import './logo.scss'

/**
 * Component for logo
 */
const SloganLogo: FunctionComponent = () => {
    return (
        <div className="logo-container">
            <img className="logo-container__img" src="/vactrack.svg" alt="" />
        </div>
    )
}

export default SloganLogo
