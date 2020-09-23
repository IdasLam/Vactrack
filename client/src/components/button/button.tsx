import React, { FunctionComponent } from 'react'
import { Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import './button.scss'

const MiddeButton: FunctionComponent = () => {
    const path = window.location.pathname
    const addVaccine = ['/home', '/profile']
    const history = useHistory()
    // const addPerson = ['/home', '/profile']

    if (addVaccine.includes(path)) {
        return (
            <Button
                variant="contained"
                onClick={() => {
                    history.replace('/add/vaccine')
                }}
                className="add_new"
            >
                <p>X</p>
            </Button>
        )
    }

    return null
}

export default MiddeButton
