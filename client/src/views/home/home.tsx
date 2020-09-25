import React, { FunctionComponent, useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import { useHistory } from 'react-router-dom'
import * as user from '../../services/user/user'
import * as fetch from '../../services/family/family'
import firebase from 'firebase/app'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { Family, Vaccinations } from '../../models/family'
import { CircularProgress } from '@material-ui/core'
import Upcoming from '../../components/vaccine/upcoming'
import People from '../../components/people/people'

const firestore = firebase.firestore()

const Home: FunctionComponent = () => {
    const history = useHistory()
    const [anyActiveVaccines, setAnyActiveVaccines] = useState<boolean>(false)
    const [uid, setUid] = useState<string>()
    const [upcomingVaccinations, setUpcomingVaccionations] = useState<Vaccinations>({})
    const doc = firestore.doc(`family/${uid}`)
    const [value, loading] = useDocumentData<Family>(doc)

    useEffect(() => {
        const isLoggedIn = user.isLoggedIn()

        if (!isLoggedIn) {
            history.replace('/')
        } else {
            setUid(user.getUid())
        }
    }, [history, setUid])

    useEffect(() => {
        if (value) {
            setUpcomingVaccionations(fetch.filterActiveVaccines(value))
            // fetch.anyActiveVaccines(upcomingVaccinations)
        }
    }, [value])

    useEffect(() => {
        if (upcomingVaccinations) {
            setAnyActiveVaccines(fetch.anyActiveVaccines(upcomingVaccinations))
        }
    }, [upcomingVaccinations])

    if (loading) {
        return (
            <div className="loader">
                <CircularProgress />
            </div>
        )
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
