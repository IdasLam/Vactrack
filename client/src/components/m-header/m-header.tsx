import React, { FunctionComponent, useEffect, useState } from 'react'
import Logo from '../logo/logo'
import MenuIcon from '@material-ui/icons/Menu'
import Button from '@material-ui/core/Button'
import './header.scss'
import { CSSTransition } from 'react-transition-group'
import './menu.scss'
import { Link, useHistory } from 'react-router-dom'
import * as user from '../../services/user/user'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

/**
 * Component for mobile header and navbar
 */
const MHeader: FunctionComponent = () => {
    const [menu, setMenu] = useState(false)
    const history = useHistory()

    const signOut = () => {
        user.signOut()
            .then(() => {
                history.push('/')
            })
            .catch(console.error)
    }

    useEffect(() => {
        document.body.style.overflow = menu ? 'hidden' : ''
    }, [menu])

    return (
        <header>
            <div className="mobile-menu-header">
                <div>
                    <Button
                        onClick={() => {
                            setMenu(true)
                        }}
                        className="burgermenu"
                    >
                        <MenuIcon color="primary" fontSize="large" />
                    </Button>
                    <Button onClick={() => history.push('/home')}>
                        <Logo />
                    </Button>
                </div>
            </div>
            <div>
                {/* {menu ?  : null} */}
                <CSSTransition in={menu} timeout={300} classNames="menu-transition">
                    <div className="menu-container">
                        <h1>menu</h1>
                        <div className="menu-links">
                            <p>
                                <Link to="/add/person">Add Person</Link>
                            </p>
                            <p>
                                <Link to="/add/vaccine">Add Vaccination</Link>
                            </p>
                            <div className="logout">
                                <Button onClick={signOut}>
                                    <ExitToAppIcon fontSize="large" color="primary" />
                                </Button>
                            </div>
                        </div>
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
