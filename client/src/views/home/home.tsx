import React, { FunctionComponent, useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import { useHistory } from 'react-router-dom'
import * as user from '../../services/user/user'
import * as fetch from '../../services/family/family'
import People from '../../components/people/people'
import firebase from 'firebase/app'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { Family } from '../../models/family'
import { CircularProgress } from '@material-ui/core'

const firestore = firebase.firestore()

const Home: FunctionComponent = () => {
    const history = useHistory()
    const [uid, setUid] = useState<string>()
    const doc = firestore.doc(`family/${uid}`)
    const [value, loading] = useDocumentData<Family>(doc)

    console.log(loading)

    useEffect(() => {
        const isLoggedIn = user.isLoggedIn()

        if (!isLoggedIn) {
            history.replace('/')
        } else {
            setUid(user.getUid())
        }
    }, [])

    if (loading) {
        return (
            <div className="loader">
                <CircularProgress />
            </div>
        )
    }
    if (value) {
        console.log(value)
    }

    return (
        <Layout>
            <People people={value} />
            <section className="main-section-container">
                <p>Featuring</p>
                <p>Upcoming vaccinations</p>
            </section>
        </Layout>
    )
}

export default Home
