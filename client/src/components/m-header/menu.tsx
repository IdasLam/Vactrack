import React, { FunctionComponent } from 'react'
import './menu.scss'

type MenuProps = {
    onClose?: () => void
}

const Menu: FunctionComponent<MenuProps> = (props) => {
    return (
        <div className="menu-outside-container" onClick={props.onClose}>
            <div className="menu-container">
                <h1>hello</h1>
            </div>
        </div>
    )
}

export default Menu
