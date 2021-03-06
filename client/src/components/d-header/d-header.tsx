import React, { FunctionComponent } from 'react'
import './header.scss'
import Button from '@material-ui/core/Button'
import { useHistory, Link } from 'react-router-dom'
import Logo from '../logo/logo'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import * as user from '../../services/user/user'

/**
 * Component for desktop header and navbar
 */
const DHeader: FunctionComponent = () => {
    const history = useHistory()

    const signOut = () => {
        user.signOut()
            .then(() => {
                history.push('/')
            })
            .catch(console.error)
    }

    return (
        <header>
            <div className="desktop-menu-header">
                <Button onClick={() => history.push('/home')}>
                    <Logo />
                </Button>
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
        </header>
    )
}

export default DHeader
