import React, { FunctionComponent, useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import * as user from '../../services/user/user'
import * as fetch from '../../services/family/family'
import firebase from 'firebase/app'
import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore'
import { Family, Vaccinations } from '../../models/family'
import Upcoming from '../../components/vaccine/upcoming'
import People from '../../components/people/people'
import Loader from '../../components/loading/loading'
import { getTwoArticles } from '../../services/article/article'
import * as articleTypes from '../../models/article'
import Article from '../../components/article/article'

const firestore = firebase.firestore()

/**
 * View for homepage.
 */
const Home: FunctionComponent = () => {
    const [anyActiveVaccines, setAnyActiveVaccines] = useState<boolean>(false)
    const [upcomingVaccinations, setUpcomingVaccionations] = useState<Vaccinations>({})
    const [uid, setUid] = useState<string>()
    const [twoArticles, setTwoArticle] = useState<articleTypes.Article[]>()

    const doc = firestore.doc(`family/${uid}`)
    const [value, loading] = useDocumentData<Family>(doc)
    const colArticle = firestore.collection(`articles`)
    const [articles, loadingArticles] = useCollectionData<articleTypes.Article>(colArticle)

    // Get user id
    useEffect(() => {
        setUid(user.getUid())
    }, [setUid])

    // Fetch 2 articles to display
    useEffect(() => {
        if (articles) {
            setTwoArticle(getTwoArticles(articles))
        }
    }, [articles])

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

    if (loading || loadingArticles) {
        return <Loader />
    }

    return (
        <Layout>
            <People family={value} />
            <section className="main-section-container">
                <div>
                    <p>Featuring</p>
                    <Article articles={twoArticles} />
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

export default Home
