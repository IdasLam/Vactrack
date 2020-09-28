import React, { FunctionComponent, useEffect, useState } from 'react'
import { FormControl, TextField } from '@material-ui/core'
import Layout from '../../components/layout/layout'
import firebase from 'firebase/app'
import * as user from '../../services/user/user'
import { Family } from '../../models/family'
import Loader from '../../components/loading/loading'

import { useDocumentData } from 'react-firebase-hooks/firestore'

import * as validation from '../../services/validation/person'

const firestore = firebase.firestore()

const AddVaccine: FunctionComponent = () => {
    const [errorName, setErrorName] = useState(false)
    const [uid, setUid] = useState<string>()

    useEffect(() => {
        setUid(user.getUid())
    }, [setUid])

    const doc = firestore.doc(`family/${uid}`)
    const [value, loading] = useDocumentData<Family>(doc)

    useEffect(() => {
        if (value) {
            console.log(value)
        }
    }, [value])
    // const submit = (event) => {

    // }

    if (loading) {
        return <Loader />
    }

    return (
        <Layout>
            <section className="main-section-container">
                <h1>hello</h1>
                <FormControl>
                    <TextField
                        onChange={(event) => {
                            console.log(event.target.value)
                        }}
                        label="text"
                        error={errorName}
                    />
                </FormControl>
            </section>
        </Layout>
    )
}

export default AddVaccine
