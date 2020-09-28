import React, { FunctionComponent, useEffect, useState } from 'react'
import { FormControl, TextField } from '@material-ui/core'
import Layout from '../../components/layout/layout'
import firebase from 'firebase/app'
import * as user from '../../services/user/user'
import { Family, Name } from '../../models/family'
import * as fetch from '../../services/family/family'
import Loader from '../../components/loading/loading'

import { useDocumentData } from 'react-firebase-hooks/firestore'

import * as validation from '../../services/validation/person'

const firestore = firebase.firestore()

const AddPerson: FunctionComponent = () => {
    const [errorName, setErrorName] = useState(false)

    const [nameList, setNameList] = useState<Name[]>()

    const [uid, setUid] = useState<string>()

    useEffect(() => {
        setUid(user.getUid())
    }, [setUid])

    const doc = firestore.doc(`family/${uid}`)
    const [value, loading] = useDocumentData<Family>(doc)

    useEffect(() => {
        if (value) {
            setNameList(fetch.getAllNames(value))
        }
    }, [value])

    if (loading) {
        return <Loader />
    }

    console.log(errorName)

    return (
        <Layout>
            <section className="main-section-container">
                <h1>hello</h1>
                <FormControl>
                    <TextField
                        onChange={(event) => {
                            if (nameList) {
                                setErrorName(validation.nameValidation(event.target.value.toLowerCase(), nameList))
                            } else {
                                console.error('something went wrong')
                            }
                        }}
                        label="Name"
                        error={errorName}
                    />
                </FormControl>
            </section>
        </Layout>
    )
}

export default AddPerson
