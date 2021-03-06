import React, { FunctionComponent } from 'react'
import { Button } from '@material-ui/core'
import './button.scss'
import CheckIcon from '@material-ui/icons/Check'

type MiddleButtonExtention = {
    valid: boolean
}

/**
 * Component for sumbiting in form
 * @param props
 */
const MiddeButtonSubmit: FunctionComponent<MiddleButtonExtention> = (props) => {
    const { valid } = props
    const path = window.location.pathname
    const add = ['/add/person', '/add/vaccine', '/edit/person', '/edit/vaccine']

    if (add.includes(path)) {
        return (
            <div className="add-new-form">
                <Button type="submit" className={valid ? 'valid' : 'invalid'} disabled={!valid}>
                    <CheckIcon />
                </Button>
            </div>
        )
    }
    // else if (edit.includes(path)) {
    //     return (
    //         <div className="edit-form">
    //             <Button type="submit" className={valid ? 'valid' : 'invalid'} disabled={!valid}>
    //                 <CheckIcon />
    //             </Button>
    //         </div>
    //     )
    // }

    return null
}

export default MiddeButtonSubmit
