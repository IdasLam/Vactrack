import React, { FunctionComponent, useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import firebase from 'firebase/app'
import * as user from '../../services/user/user'
import { Family, Name } from '../../models/family'
import * as fetch from '../../services/family/family'
import Loader from '../../components/loading/loading'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import * as validation from '../../services/validation/person'
import { FormControl, TextField, Button, MenuItem, InputLabel } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import dayjs from 'dayjs'
import dayjsUtils from '@date-io/dayjs'

const firestore = firebase.firestore()

const AddPerson: FunctionComponent = () => {
    const [errorName, setErrorName] = useState(false)
    const [status, setStatus] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [date, setDate] = useState<any>()

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

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        console.log(event.target)
    }

    return (
        <Layout>
            <section className="main-section-container">
                <h1>Add a new person</h1>
                <form onSubmit={submit}>
                    <FormControl>
                        <TextField
                            onChange={(event) => {
                                if (nameList) {
                                    setErrorName(validation.nameValidation(event.target.value.toLowerCase(), nameList))
                                    setName(event.target.value.toLowerCase())
                                } else {
                                    console.error('something went wrong')
                                }
                            }}
                            id="name"
                            label="Name"
                            error={errorName}
                            helperText={errorName ? 'Person already exsists.' : ''}
                            required
                        />
                        <TextField
                            label="Status"
                            value={status}
                            select
                            onChange={(event) => {
                                setStatus(event.target.value)
                            }}
                            required
                        >
                            <MenuItem value="Custodian/Parent">Custodian/Parent</MenuItem>
                            <MenuItem value="Child">Child</MenuItem>
                            <MenuItem value="Pet">Pet</MenuItem>
                        </TextField>
                        <MuiPickersUtilsProvider utils={dayjsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="YYYY-MM-DD"
                                margin="normal"
                                label="Birthday"
                                value={dayjs().format('YYYY-MM-DD')}
                                onChange={(date) => setDate(date)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </FormControl>
                    <Button type="submit">YAS</Button>
                </form>
            </section>
        </Layout>
    )
}

export default AddPerson
