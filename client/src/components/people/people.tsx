import React, { FunctionComponent } from 'react'
import { FamilyProps } from '../../models/family'
import './people.scss'
import AddIcon from '@material-ui/icons/Add'
import { Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

const People: FunctionComponent<FamilyProps> = (props) => {
    const { family } = props
    const history = useHistory()

    if (!family) {
        return (
            <div className="people-container">
                <div className="person-container new-person">
                    <AddIcon fontSize="large" />
                </div>
            </div>
        )
    }

    const click = (name?: string) => {
        if (name) {
            history.replace(`/person?name=${name.toLowerCase()}`)
        } else {
            history.replace(`/add/person`)
        }
    }

    const addPerson = () => {
        if (!family) return

        const elements = Object.keys(family)
            .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
            .map((person) => {
                const firstname = person.split(' ')[0]

                return (
                    <Button className="person-container" key={firstname} onClick={() => click(firstname)}>
                        <span className="person-name">{firstname}</span>
                    </Button>
                )
            })

        return elements
    }

    return (
        <div className="scroll-container">
            <div className="people-container">{addPerson()}</div>
            <div className="people-container">
                <Button className="person-container new-person" onClick={() => click()}>
                    <AddIcon fontSize="large" />
                </Button>
            </div>
        </div>
    )
}

export default People
