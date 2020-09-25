import React, { FunctionComponent } from 'react'
import MHeader from '../m-header/m-header'
import './layout.scss'
import MiddeButton from '../button/button'

const Layout: FunctionComponent = (props) => {
    const path = window.location.pathname

    return (
        <div>
            <MHeader />
            <main>{props.children}</main>
            <MiddeButton />
            {/* footer? */}
        </div>
    )
}

export default Layout
