import React, { FunctionComponent, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import Layout from '../../components/layout/layout'
import { useHistory } from 'react-router-dom'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import * as fetch from '../../services/family/family'
import * as user from '../../services/user/user'
import { Family, Name, Person } from '../../models/family'
import { FormControl, TextField, MenuItem, Button } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import dayjsUtils from '@date-io/dayjs'
import MiddleButtonSubmit from '../../components/button/sumbit'
import Loader from '../../components/loading/loading'
import * as validation from '../../services/validation/person'
import dayjs from 'dayjs'
import './../add/form.scss'
import './edit-form.scss'
import DeleteIcon from '@material-ui/icons/Delete'
import Message from 'antd/lib/message'
import { stat } from 'fs'
import { Console } from 'console'

const firestore = firebase.firestore()

const EditPerson: FunctionComponent = () => {
    const [nameSearch, setNameSearch] = useState<string>('')
    const history = useHistory()
    const [uid, setUid] = useState<string>()
    const [personData, setPersonData] = useState<Person>()

    const [personName, setPersonName] = useState<string>()
    const [status, setStatus] = useState<string>()
    const [birthday, setBirthday] = useState<string>(dayjs().format('YYYY-MM-DD'))

    const [errorName, setErrorName] = useState(false)
    const [nameList, setNameList] = useState<Name[]>()
    // const [valid, setValid] = useState<boolean>(false)

    useEffect(() => {
        setUid(user.getUid())
    }, [setUid])

    const doc = firestore.doc(`family/${uid}`)
    const [value, loading] = useDocumentData<Family>(doc)

    const getPersonData = async () => {
        if (nameSearch && uid) {
            const data = await fetch.getPersonData(uid, nameSearch)

            if (data) {
                setPersonData(data)
                // om inget g;r error handler
            }
        }
    }

    useEffect(() => {
        if (value) {
            setNameList(fetch.getAllNames(value))
        }
    }, [value])

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
            getPersonData()
        }
    }, [nameSearch, uid])

    useEffect(() => {
        if (personData) {
            setPersonName(nameSearch)
            setStatus(personData.status)

            if (personData.birthday) {
                setBirthday(dayjs(personData.birthday.toDate()).format('YYYY-MM-DD'))
            }
        }
    }, [personData])

    useEffect(() => {
        if (personName === '') {
            setErrorName(true)
        }
    }, [personName])

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const birthdayTime = birthday ? firebase.firestore.Timestamp.fromDate(new Date(birthday)) : null

        if (uid && status && personName) {
            fetch
                .editPerson(uid, nameSearch, status, birthdayTime, personName)
                .then(() => {
                    Message.success(`${personName} has edited!`)
                    history.push(`/person?name=${personName}`)
                })
                .catch((error) => {
                    Message.error('Unknown error has occured')
                    console.log(error)
                })
        }
    }

    if (personData) {
        return (
            <Layout>
                <section className="main-section-container person">
                    <h1>Edit person</h1>
                    <form className="edit-form" onSubmit={submit}>
                        <FormControl>
                            <TextField
                                onChange={(event) => {
                                    if (nameList) {
                                        if (event.target.value.toLowerCase() !== nameSearch.toLowerCase()) {
                                            setErrorName(
                                                validation.nameValidation(event.target.value.toLowerCase(), nameList),
                                            )
                                        }
                                        setPersonName(event.target.value)
                                    } else {
                                        console.error('something went wrong')
                                    }
                                }}
                                id="name"
                                label="Name"
                                value={personName}
                                error={errorName}
                                helperText={errorName ? 'Person already exsists or invalid name' : ''}
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
                                disabled={personData.status === 'user'}
                            >
                                <MenuItem value="user" disabled={true}>
                                    user
                                </MenuItem>
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
                                    value={birthday}
                                    onChange={(inputDate) => inputDate && setBirthday(inputDate.format('YYYY-MM-DD'))}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </FormControl>
                        <Button
                            variant="contained"
                            disabled={personData.status === 'user'}
                            onClick={() => console.log('delete')}
                            className="delete-button"
                            startIcon={<DeleteIcon />}
                            color="primary"
                        >
                            Delete person
                        </Button>
                        <MiddleButtonSubmit valid={!errorName} />
                    </form>
                </section>
            </Layout>
        )
    }

    return <Loader />
}

export default EditPerson
