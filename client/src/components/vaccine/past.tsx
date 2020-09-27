import React, { FunctionComponent } from 'react'
import { AllTypesOfVaccines } from '../../models/family'
import dayjs from 'dayjs'
import { convertDate } from '../../helpers/helpers'

type Cards = {
    vaccines: AllTypesOfVaccines[]
}

const PastCards: FunctionComponent<Cards> = (props) => {
    const { vaccines } = props

    const generateCards = () => {
        const cards = vaccines.map((vaccine) => {
            const { name, revaccination, date } = vaccine

            return (
                // key={name + vaccine.name + convertDate(vaccine.revaccination)
                <div className="vaccine-card" key={name + convertDate(date)}>
                    <p className="vaccine-name">{name}</p>
                    {revaccination ? <span>{convertDate(revaccination)}</span> : null}
                    <p>Most recent vaccination: {convertDate(date)}</p>
                </div>
            )
        })

        return cards
    }

    return <div>{generateCards()}</div>
}

export default PastCards