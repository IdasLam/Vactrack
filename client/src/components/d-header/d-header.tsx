import React, { FunctionComponent } from 'react'
import './header.scss'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'
import Logo from '../logo/logo'

const DHeader: FunctionComponent = () => {
    const history = useHistory()
    return (
        <header>
            <div className="desktop-menu-header">
                <Button onClick={() => history.push('/home')}>
                    <Logo />
                </Button>
            </div>
        </header>
    )
}

export default DHeader
