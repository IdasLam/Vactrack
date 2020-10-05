import React, { FunctionComponent, useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import { useHistory } from 'react-router-dom'
import * as fetch from '../../services/family/family'
import * as user from '../../services/user/user'
import { Person } from '../../models/family'

const EditPerson: FunctionComponent = () => {
    const [nameSearch, setNameSearch] = useState<string>('')
    const history = useHistory()
    const [uid, setUid] = useState<string>()
    const [personData, setPersonData] = useState<Person>()

    useEffect(() => {
        setUid(user.getUid())
    }, [setUid])

    useEffect(() => {
        const name = new URLSearchParams(history.location.search).get('name')

        if (name) {
            setNameSearch(name)
        }
    }, [nameSearch])

    useEffect(() => {
        if (nameSearch && uid) {
            // setPersonData(fetch.getPersonData(uid, nameSearch))
            // skriv i separate funktion
            fetch.getPersonData(uid, nameSearch)
        }
    }, [nameSearch, uid])

    console.log(nameSearch)

    return (
        <Layout>
            <section className="main-section-container">
                <h1>Edit person</h1>
            </section>
        </Layout>
    )
}

export default EditPerson
