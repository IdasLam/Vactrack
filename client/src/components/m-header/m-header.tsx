import React, { FunctionComponent, useState } from 'react'
import Logo from '../logo/logo'
import Menu from './menu'
// import { MenuIcon } from '@material-ui/icons'
import MenuIcon from '@material-ui/icons/Menu'
import Button from '@material-ui/core/Button'
import './header.scss'

const MHeader: FunctionComponent = () => {
    const [menu, setMenu] = useState(false)

    return (
        <header>
            <div className="menu-header">
                <Button
                    onClick={() => {
                        setMenu(true)
                    }}
                >
                    <MenuIcon color="primary" fontSize="large" />
                </Button>
                <Logo />
            </div>
            <div>{menu ? <Menu onClose={() => setMenu(false)} /> : null}</div>
        </header>
    )
}

export default MHeader
