import React, { FunctionComponent, useEffect } from 'react'
import * as firebase from 'firebase/app'
import Layout from '../../components/layout/layout'
import { useHistory } from 'react-router-dom'
import * as user from '../../services/user/user'

const Home: FunctionComponent = () => {
    const history = useHistory()

    useEffect(() => {
        const isLoggedIn = user.isLoggedIn()
        console.log('mounting')

        if (!isLoggedIn) {
            history.replace('/')
        }
    }, [])

    return (
        <Layout>
            <h1></h1>
        </Layout>
    )
}

export default Home
