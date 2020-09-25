import React, { FunctionComponent, useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import * as user from '../../services/user/user'
import * as fetch from '../../services/family/family'
import firebase from 'firebase/app'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { Family, Vaccinations } from '../../models/family'
import Upcoming from '../../components/vaccine/upcoming'
import People from '../../components/people/people'
import Loader from '../../components/loading/loading'

const firestore = firebase.firestore()

const Home: FunctionComponent = () => {
    const [anyActiveVaccines, setAnyActiveVaccines] = useState<boolean>(false)
    const [upcomingVaccinations, setUpcomingVaccionations] = useState<Vaccinations>({})
    const [uid, setUid] = useState<string>()

    const doc = firestore.doc(`family/${uid}`)
    const [value, loading] = useDocumentData<Family>(doc)

    useEffect(() => {
        setUid(user.getUid())
    }, [setUid])

    useEffect(() => {
        if (value) {
            setUpcomingVaccionations(fetch.filterActiveVaccines(value))
        }
    }, [value])

    useEffect(() => {
        if (upcomingVaccinations) {
            setAnyActiveVaccines(fetch.anyActiveVaccines(upcomingVaccinations))
        }
    }, [upcomingVaccinations])

    if (loading) {
        return <Loader />
    }

    return (
        <Layout>
            <People family={value} />
            <section className="main-section-container">
                <p>Featuring</p>
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

export default Home
