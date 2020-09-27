import React, { FunctionComponent } from 'react'
// import dayjs from 'dayjs'
import { ActiveVaccinations } from '../../models/family'
import './cards.scss'
import { convertDate } from '../../helpers/helpers'

const Upcoming: FunctionComponent<ActiveVaccinations> = (props) => {
    const { vaccines } = props

    const cards = () => {
        if (!vaccines) {
            return null
        }

        return Object.entries(vaccines).map((person) => {
            const [name, upcomingVaccinations] = person
            const upcomingCards = upcomingVaccinations.map((vaccine) => {
                return (
                    <div className="vaccine-card" key={name + vaccine.name + convertDate(vaccine.revaccination)}>
                        <p className="vaccine-name">{vaccine.name}</p>
                        <span>Due {convertDate(vaccine.revaccination)}</span>
                        <p>{name}</p>
                        <p>Most recent vaccination: {convertDate(vaccine.date)}</p>
                    </div>
                )
            })

            return upcomingCards
        })
    }

    return <div className="upcoming-vaccine-cards-container">{cards()}</div>
}

export default Upcoming
