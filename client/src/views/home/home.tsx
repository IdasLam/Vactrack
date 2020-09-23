import React, { FunctionComponent, useEffect } from 'react'
import * as firebase from 'firebase/app'
import Layout from '../../components/layout/layout'

const Home: FunctionComponent = () => {
    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                console.log('logedin', user.uid)
            } else {
                // User not logged in or has just logged out.
                // redirect to login

                console.log('not')
            }
        })
    }, [])
    return (
        <Layout>
            <h1></h1>
        </Layout>
    )
}

export default Home
