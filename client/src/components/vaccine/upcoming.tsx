import React, { FunctionComponent } from 'react'
import dayjs from 'dayjs'
import { Vaccinations } from '../../models/family'
import './upcoming.scss'

type Vaccine = {
    vaccines: Vaccinations
}

const Upcoming: FunctionComponent<Vaccine> = (props) => {
    const { vaccines } = props

    console.log(vaccines)

    const convertDate = (date: firebase.firestore.Timestamp) => {
        return dayjs(date.toDate()).format('YYYY/MM/DD')
    }

    const cards = () => {
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

    return <div>{cards()}</div>
}

export default Upcoming
