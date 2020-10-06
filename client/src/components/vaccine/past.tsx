import React, { FunctionComponent } from 'react'
import { AllTypesOfVaccines } from '../../models/family'
import { convertDate } from '../../helpers/helpers'
import { Link } from 'react-router-dom'

type Cards = {
    vaccines: AllTypesOfVaccines[]
}

const PastCards: FunctionComponent<Cards> = (props) => {
    const { vaccines } = props

    const generateCards = () => {
        const cards = vaccines.map((vaccine) => {
            const { name, revaccination, date, id } = vaccine

            return (
                // key={name + vaccine.name + convertDate(vaccine.revaccination)
                <Link to={'/edit/vaccine?id=' + id + '&name=' + name} key={name + id}>
                    <div className="vaccine-card">
                        <p className="vaccine-name">{name}</p>
                        {revaccination ? <span>Due {convertDate(revaccination)}</span> : null}
                        <p>Vaccinated: {convertDate(date)}</p>
                    </div>
                </Link>
            )
        })

        return cards
    }

    return <div className="past-vaccinations-container">{generateCards()}</div>
}

export default PastCards
