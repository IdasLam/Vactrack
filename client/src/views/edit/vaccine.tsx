import React, { FunctionComponent, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import Layout from '../../components/layout/layout'
import { useHistory } from 'react-router-dom'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import * as fetch from '../../services/family/family'
import * as user from '../../services/user/user'
import { AllTypesOfVaccines, Family, Name, Person } from '../../models/family'
import { FormControl, TextField, MenuItem, Button, FormGroup, FormControlLabel, Switch } from '@material-ui/core'
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
    // const [personData, setPersonData] = useState<Person>()
    // const [personNotFound, setPersonNotFound] = useState<boolean>(false)
    const [vaccineData, setVaccineData] = useState<AllTypesOfVaccines>()
    const [vaccineNotFound, setVaccineNotFound] = useState<boolean>(false)
    const [vaccineFrom, setVaccineFrom] = useState<'activeVaccines' | 'vaccines' | undefined>()

    const [vaccineName, setVaccineName] = useState<string>()
    const [vaccineDate, setVaccineDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
    const [revaccinateDate, setRevaccinateDate] = useState<string>()
    const [unsetRevaccinate, setUnsetRevaccinate] = useState<boolean>(false)

    const [errorName, setErrorName] = useState(false)

    useEffect(() => {
        setUid(user.getUid())
    }, [setUid])

    const doc = firestore.doc(`family/${uid}`)
    const [value, loading] = useDocumentData<Family>(doc)

    const getVaccineData = async () => {
        if (value) {
            setVaccineData(fetch.getDataForVaccine(value, vaccineIDSearch, nameSearch))
        }
    }

    useEffect(() => {
        if (vaccineName?.length === 0 || vaccineName === ' ') {
            setErrorName(true)
        }
    }, [vaccineName])

    useEffect(() => {
        const name = new URLSearchParams(history.location.search).get('name')
        const vaccineID = new URLSearchParams(history.location.search).get('id')

        if (name && vaccineID) {
            setNameSearch(name)
            setVaccineIDSearch(vaccineID)
        }
    }, [nameSearch])

    useEffect(() => {
        if (nameSearch && uid && value) {
            // getPersonData()
            getVaccineData()
        }
    }, [nameSearch, uid, value])

    useEffect(() => {
        if (vaccineData) {
            setVaccineName(vaccineData.name)
            setVaccineDate(dayjs(vaccineData.date.toDate()).format('YYYY-MM-DD'))

            if (vaccineData.revaccination) {
                console.log('revacc')

                setRevaccinateDate(dayjs(vaccineData.revaccination.toDate()).format('YYYY-MM-DD'))
                setUnsetRevaccinate(false)
            }
        }
    }, [vaccineData])

    useEffect(() => {
        if (value) {
            const data = fetch.getDataForVaccine(value, vaccineIDSearch, nameSearch)
            const from = fetch.vaccineFrom(value, vaccineIDSearch, nameSearch)

            if (data === undefined) {
                setVaccineNotFound(true)
            } else {
                setVaccineData(data)
                setVaccineFrom(from)
            }
        }
    }, [vaccineData])

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (uid && vaccineName && vaccineFrom) {
            if (vaccineFrom != undefined) {
                fetch
                    .editVaccine(
                        uid,
                        nameSearch,
                        vaccineName,
                        vaccineDate,
                        unsetRevaccinate,
                        vaccineFrom,
                        vaccineIDSearch,
                    )
                    .then(() => {
                        Message.success(`${vaccineName} has edited!`)
                        history.push(`/person?name=${nameSearch}`)
                    })
                    .catch((error) => {
                        Message.error('Unknown error has occured')
                        console.log(error)
                    })
            } else {
                Message.error('Vaccine does not exsist')
            }
        }
    }

    const deletePerson = () => {
        if (uid && vaccineName && vaccineFrom) {
            fetch
                .deleteVaccine(uid, vaccineIDSearch, vaccineFrom, nameSearch)
                .then(() => {
                    Message.success(`${vaccineName} has been deleted!`)
                    history.push(`/person?name=${nameSearch}`)
                })
                .catch((error) => {
                    Message.error('Unknown error has occured')
                    console.log(error)
                })
        }
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

    if (vaccineData) {
        return (
            <Layout>
                <section className="main-section-container person">
                    <h1>Edit vaccination</h1>
                    <p>Vaccination for {nameSearch}</p>
                    <form className="edit-form" onSubmit={submit}>
                        <FormControl>
                            <TextField
                                onChange={(event) => {
                                    setVaccineName(event.target.value)
                                }}
                                id="name"
                                label="Vaccine name"
                                value={vaccineName}
                                required
                            />
                            <MuiPickersUtilsProvider utils={dayjsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="YYYY-MM-DD"
                                    margin="normal"
                                    label="Vaccination date"
                                    value={vaccineDate}
                                    onChange={(inputDate) =>
                                        inputDate && setVaccineDate(inputDate.format('YYYY-MM-DD'))
                                    }
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                            {revaccinateDate ? (
                                <React.Fragment>
                                    <FormGroup aria-label="position" row>
                                        <FormControlLabel
                                            label="Remove revaccination date"
                                            labelPlacement="start"
                                            control={
                                                <Switch
                                                    checked={unsetRevaccinate}
                                                    onChange={() => {
                                                        setUnsetRevaccinate(!unsetRevaccinate)
                                                    }}
                                                />
                                            }
                                        />
                                    </FormGroup>
                                    <TextField
                                        disabled={true}
                                        id="name"
                                        label="Revaccinate date"
                                        value={revaccinateDate}
                                    />
                                </React.Fragment>
                            ) : null}
                        </FormControl>
                        <Button
                            variant="contained"
                            // disabled={personData.status === 'user'}
                            onClick={() => deletePerson()}
                            className="delete-button"
                            startIcon={<DeleteIcon />}
                            color="primary"
                        >
                            Delete vaccine
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
