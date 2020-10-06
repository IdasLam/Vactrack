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
import { Vaccine } from '../../models/family'

const firestore = firebase.firestore()

const EditVaccine: FunctionComponent = () => {
    const [nameSearch, setNameSearch] = useState<string>('')
    const [vaccineIDSearch, setVaccineIDSearch] = useState<string>('')

    const history = useHistory()

    const [uid, setUid] = useState<string>()
    const [personData, setPersonData] = useState<Person>()
    const [personNotFound, setPersonNotFound] = useState<boolean>(false)
    const [vaccineData, setVaccineData] = useState<Vaccine>()
    const [vaccineNotFound, setVaccineNotFound] = useState<boolean>(false)
    const [vaccineFrom, setVaccineFrom] = useState<string>()

    const [vaccineName, setVaccineName] = useState<string>()
    const [vaccinationDate, setVaccinationDate] = useState<string>(dayjs().format('YYYY-MM-DD'))

    const [errorName, setErrorName] = useState(false)
    const [nameList, setNameList] = useState<Name[]>()

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
            } else {
                setPersonNotFound(true)
            }
        }
    }

    useEffect(() => {
        const name = new URLSearchParams(history.location.search).get('name')
        const vaccineID = new URLSearchParams(history.location.search).get('id')

        if (name && vaccineID) {
            setNameSearch(name)
            setVaccineIDSearch(vaccineID)
        }
    }, [nameSearch])

    useEffect(() => {
        if (nameSearch && uid) {
            getPersonData()
        }
    }, [nameSearch, uid])

    useEffect(() => {
        if (vaccineData) {
        }
    }, [vaccineData])

    useEffect(() => {
        if (value) {
            const data = fetch.getDataForVaccine(value, vaccineIDSearch, nameSearch)
            const from = fetch.vaccineFrom(value, vaccineIDSearch, nameSearch)
            console.log(from)

            if (data === undefined) {
                setVaccineNotFound(true)
            } else {
                setVaccineData(data)
                setVaccineFrom(from)
            }
        }
    }, [value])

    console.log(personData)

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // const birthdayTime = birthday ? firebase.firestore.Timestamp.fromDate(new Date(birthday)) : null

        if (uid) {
            // fetch
            //     .editPerson(uid, nameSearch, status, birthdayTime, personName)
            //     .then(() => {
            //         Message.success(`${personName} has edited!`)
            //         history.push(`/person?name=${personName}`)
            //     })
            //     .catch((error) => {
            //         Message.error('Unknown error has occured')
            //         console.log(error)
            //     })
        }
    }

    const deletePerson = () => {
        // if (uid && nameSearch) {
        //     fetch
        //         .deletePerson(uid, nameSearch)
        //         .then(() => {
        //             Message.success(`${personName} has been deleted!`)
        //             history.push(`/home`)
        //         })
        //         .catch((error) => {
        //             Message.error('Unknown error has occured')
        //             console.log(error)
        //         })
        // }
    }

    if (vaccineNotFound) {
        return (
            <Layout>
                <section className="main-section-container">
                    <h1>Vaccination was not found.</h1>
                </section>
            </Layout>
        )
    }

    if (personData) {
        return (
            <Layout>
                <section className="main-section-container person">
                    <h1>Edit vaccination</h1>
                    <form className="edit-form" onSubmit={submit}>
                        <FormControl>
                            {/* <TextField
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
                            /> */}
                            {/* <TextField
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
                            </TextField> */}
                            <MuiPickersUtilsProvider utils={dayjsUtils}>
                                {/* <KeyboardDatePicker
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
                                /> */}
                            </MuiPickersUtilsProvider>
                        </FormControl>
                        <Button
                            variant="contained"
                            disabled={personData.status === 'user'}
                            onClick={() => deletePerson()}
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

export default EditVaccine