import React, { FunctionComponent, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import * as user from '../../services/user/user'
import * as fetch from '../../services/family/family'
import { useHistory } from 'react-router-dom'
import { useQuery } from '../../services/hooks/hooks'
import Layout from '../../components/layout/layout'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { Family } from '../../models/family'
import Loader from '../../components/loading/loading'
import * as family from '../../models/family'
import EditIcon from '@material-ui/icons/Edit'
import './person.scss'
import Upcoming from '../../components/vaccine/upcoming'

const firestore = firebase.firestore()

const Person: FunctionComponent = (props) => {
    const history = useHistory()
    const query = useQuery()

    const [firstname, setFirstname] = useState<string | null>(null)
    const [uid, setUid] = useState<string>()
    const [data, setData] = useState<[string, family.Person] | undefined>()
    const [upcomingVaccinations, setUpcomingVaccionations] = useState<family.Vaccinations>()
    const [anyActiveVaccines, setAnyActiveVaccines] = useState<boolean>(false)

    const doc = firestore.doc(`family/${uid}`)
    const [value, loading] = useDocumentData<Family>(doc)

    useEffect(() => {
        setUid(user.getUid())
    }, [history, setUid])

    useEffect(() => {
        setFirstname(query.get('name') ?? null)
    }, [setFirstname])

    useEffect(() => {
        console.log(value)

        if (value) {
            setData(fetch.getDataForUser(value, firstname))
        }
    }, [value])

    useEffect(() => {
        if (data && value) {
            setUpcomingVaccionations(fetch.filterActiveVaccinesByPerson(value, data[0]))
        }
    }, [data])

    useEffect(() => {
        if (upcomingVaccinations) {
            setAnyActiveVaccines(fetch.anyActiveVaccines(upcomingVaccinations))
        }
    }, [upcomingVaccinations])

    if (loading) {
        return <Loader />
    }

    console.log(value)

    if (data) {
        return (
            <Layout>
                <section className="main-section-container">
                    <div className="person-name">
                        <h1 className="person-name">{data[0]}</h1>
                        <EditIcon color="primary" />
                    </div>
                    <div
                        className="upcoming-vaccinations"
                        style={!anyActiveVaccines ? { display: 'none' } : { display: 'block' }}
                    >
                        <p>Upcoming vaccinations</p>
                        <Upcoming vaccines={upcomingVaccinations} />
                    </div>
                </section>
            </Layout>
        )
    }

    return null
}

export default Person
