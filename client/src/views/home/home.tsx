import React, { FunctionComponent, useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import { useHistory } from 'react-router-dom'
import * as user from '../../services/user/user'
import * as fetch from '../../services/family/family'

import firebase from 'firebase/app'
import { useDocumentData } from 'react-firebase-hooks/firestore'

const firestore = firebase.firestore()

const Home: FunctionComponent = () => {
    const history = useHistory()
    const [uid, setUid] = useState<string>()
    const doc = firestore.doc(`family/${uid}`)
    const [value] = useDocumentData(doc)

    useEffect(() => {
        const isLoggedIn = user.isLoggedIn()

        if (!isLoggedIn) {
            history.replace('/')
        } else {
            setUid(user.getUid())
        }
    }, [])

    if (value) {
        console.log(value)
    }

    return (
        <Layout>
            <h1>ello</h1>
        </Layout>
    )
}

export default Home
