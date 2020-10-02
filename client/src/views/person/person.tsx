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
import PastCards from '../../components/vaccine/past'
import { Button } from '@material-ui/core'

const firestore = firebase.firestore()

const Person: FunctionComponent = () => {
    const history = useHistory()
    const query = useQuery()

    const [firstname, setFirstname] = useState<string | null>(null)
    const [uid, setUid] = useState<string>()
    const [status, setStatus] = useState<string>()
    const [data, setData] = useState<[string, family.Person] | undefined>()
    const [upcomingVaccinations, setUpcomingVaccionations] = useState<family.Vaccinations>()
    const [anyActiveVaccines, setAnyActiveVaccines] = useState<boolean>(false)
    const [allVaccinations, setAllVaccintaions] = useState<family.AllTypesOfVaccines[]>([])

    const doc = firestore.doc(`family/${uid}`)
    const [value, loading] = useDocumentData<Family>(doc)

    useEffect(() => {
        setUid(user.getUid())
    }, [history, setUid])

    useEffect(() => {
        setFirstname(query.get('name') ?? null)
    }, [setFirstname, query])

    useEffect(() => {
        if (value) {
            setData(fetch.getDataForUser(value, firstname))
        }
    }, [value, firstname])

    useEffect(() => {
        if (data && value) {
            setStatus(fetch.getUserStatus(data))
            setUpcomingVaccionations(fetch.filterActiveVaccinesByPerson(value, data[0]))
            setAllVaccintaions(fetch.pastVaccinatons(value, data[0]))
        }
    }, [data, value])

    useEffect(() => {
        if (upcomingVaccinations) {
            setAnyActiveVaccines(fetch.anyActiveVaccines(upcomingVaccinations))
        }
    }, [upcomingVaccinations])

    if (loading) {
        return <Loader />
    }

    if (data === undefined) {
        return (
            <Layout>
                <section className="main-section-container">
                    <h1>User {firstname} not found</h1>
                </section>
            </Layout>
        )
    }

    if (data) {
        return (
            <Layout>
                <section className="main-section-container">
                    <div className="person-name">
                        <h1 className="person-name">{data[0]}</h1>
                        <Button
                            className="edit-person"
                            onClick={() => {
                                history.push(`/edit/person?name=${data[0]}`)
                            }}
                        >
                            <EditIcon color="primary" />
                        </Button>
                    </div>
                    <div className="status">
                        <p>Status: {status}</p>
                    </div>
                    <div
                        className="upcoming-vaccinations"
                        style={!anyActiveVaccines ? { display: 'none' } : { display: 'block' }}
                    >
                        <p>Upcoming vaccinations</p>
                        <Upcoming vaccines={upcomingVaccinations} displayName={false} />
                    </div>
                    <div
                        className="past-vaccinations"
                        style={allVaccinations.length > 0 ? { display: 'block' } : { display: 'none' }}
                    >
                        <p>Past vaccinations</p>
                        <PastCards vaccines={allVaccinations} />
                    </div>
                </section>
            </Layout>
        )
    }

    return null
}

export default Person
