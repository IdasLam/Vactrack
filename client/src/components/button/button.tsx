import React, { FunctionComponent } from 'react'
import { Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import './button.scss'
import AddIcon from '@material-ui/icons/Add'

const MiddeButton: FunctionComponent = () => {
    const path = window.location.pathname
    const addVaccine = ['/home', '/person']
    const history = useHistory()

    if (addVaccine.includes(path)) {
        return (
            <div className="add_new">
                <Button
                    variant="contained"
                    onClick={() => {
                        history.push('/add/vaccine')
                    }}
                >
                    <AddIcon fontSize="large" />
                </Button>
            </div>
        )
    }

    return null
}

export default MiddeButton
