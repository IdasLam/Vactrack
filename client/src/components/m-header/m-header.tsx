import React, { FunctionComponent, useState } from 'react'
import Logo from '../logo/logo'
// import { MenuIcon } from '@material-ui/icons'
import MenuIcon from '@material-ui/icons/Menu'
import Button from '@material-ui/core/Button'
import './header.scss'
import { CSSTransition } from 'react-transition-group'
import './menu.scss'
import { useHistory } from 'react-router-dom'

const MHeader: FunctionComponent = () => {
    const [menu, setMenu] = useState(false)
    const history = useHistory()

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
                <Button onClick={() => history.push('/home')}>
                    <Logo />
                </Button>
            </div>
            <div>
                {/* {menu ?  : null} */}
                <CSSTransition in={menu} timeout={300} classNames="menu-transition">
                    <div className="menu-container">
                        <h1>menu</h1>
                    </div>
                </CSSTransition>
                <CSSTransition in={menu} timeout={300} classNames="bg-show">
                    <div onClick={() => setMenu(false)} className="bg" />
                </CSSTransition>
            </div>
        </header>
    )
}

export default MHeader
