import React, { FunctionComponent } from 'react'
// import dayjs from 'dayjs'
import { ActiveVaccinations } from '../../models/family'
import './cards.scss'
import { convertDate } from '../../helpers/helpers'
import { Link } from 'react-router-dom'

type UpcomingVaccinations = ActiveVaccinations & {
    displayName?: boolean
}

const Upcoming: FunctionComponent<UpcomingVaccinations> = (props) => {
    const { vaccines, displayName = true } = props

    const cards = () => {
        if (!vaccines) {
            return null
        }

        return Object.entries(vaccines).map((person) => {
            const [name, upcomingVaccinations] = person
            const upcomingCards = upcomingVaccinations.map((vaccine) => {
                return (
                    <Link
                        to={'/edit/vaccine?id=' + vaccine.id + '&name=' + name}
                        key={name + vaccine.name + convertDate(vaccine.revaccination)}
                    >
                        <div className="vaccine-card">
                            <p className="vaccine-name">{vaccine.name}</p>
                            <span>Due {convertDate(vaccine.revaccination)}</span>
                            {displayName ? <p className="person-name">{name}</p> : null}
                            <p>Most recent vaccination: {convertDate(vaccine.date)}</p>
                        </div>
                    </Link>
                )
            })

            return upcomingCards
        })
    }

    return <div className="upcoming-vaccine-cards-container">{cards()}</div>
}

export default Upcoming
