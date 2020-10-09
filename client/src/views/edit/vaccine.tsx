import React, { FunctionComponent, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import Layout from '../../components/layout/layout'
import { useHistory } from 'react-router-dom'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import * as fetch from '../../services/family/family'
import * as user from '../../services/user/user'
import { AllTypesOfVaccines, Family } from '../../models/family'
import { FormControl, TextField, Button, FormGroup, FormControlLabel, Switch } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import dayjsUtils from '@date-io/dayjs'
import MiddleButtonSubmit from '../../components/button/sumbit'
import Loader from '../../components/loading/loading'
import dayjs from 'dayjs'
import './../add/form.scss'
import './edit-form.scss'
import DeleteIcon from '@material-ui/icons/Delete'
import Message from 'antd/lib/message'

const firestore = firebase.firestore()

/**
 * View for edit a vaccine.
 */
const EditVaccine: FunctionComponent = () => {
    const [nameSearch, setNameSearch] = useState<string>('')
    const [vaccineIDSearch, setVaccineIDSearch] = useState<string>('')

    const history = useHistory()

    const [uid, setUid] = useState<string>()

    const [vaccineData, setVaccineData] = useState<AllTypesOfVaccines>()
    const [vaccineNotFound, setVaccineNotFound] = useState<boolean>(false)
    const [vaccineFrom, setVaccineFrom] = useState<'activeVaccines' | 'vaccines' | undefined>()

    const [vaccineName, setVaccineName] = useState<string>()
    const [vaccineDate, setVaccineDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
    const [revaccinateDate, setRevaccinateDate] = useState<string>()
    const [unsetRevaccinate, setUnsetRevaccinate] = useState<boolean>(false)

    const [errorName, setErrorName] = useState(false)

    // Get user id
    useEffect(() => {
        setUid(user.getUid())
    }, [setUid])

    const doc = firestore.doc(`family/${uid}`)
    const [value, loading] = useDocumentData<Family>(doc)

    // Form validation for vaccine name
    useEffect(() => {
        if (vaccineName?.length === 0 || vaccineName === ' ') {
            setErrorName(true)
        }
    }, [vaccineName])

    // Get information from url query
    useEffect(() => {
        const name = new URLSearchParams(history.location.search).get('name')
        const vaccineID = new URLSearchParams(history.location.search).get('id')

        if (name && vaccineID) {
            setNameSearch(name)
            setVaccineIDSearch(vaccineID)
        }
    }, [nameSearch, history.location.search])

    // Set data from the form
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

    // Set form according to data fetched
    useEffect(() => {
        if (value) {
            const from = fetch.vaccineFrom(value, vaccineIDSearch, nameSearch)

            if (from) {
                const data = fetch.getDataForVaccine(value, from, vaccineIDSearch, nameSearch)

                setVaccineData(data)
                setVaccineFrom(from)
            } else if (from === undefined) {
                setVaccineNotFound(true)
            }
        }
    }, [value, nameSearch, vaccineIDSearch])

    /**
     * Submit will save the edited vaccine and if successfull redirect and push a message, else push error message.
     * @param event
     * @returns void
     */
    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (uid && vaccineName && vaccineFrom) {
            if (vaccineFrom !== undefined) {
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

    /**
     * Delete will remove vaccine from database, on success will redirect and push message, else push an error message.
     */
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

    // If the vaccine was not found in database
    if (vaccineNotFound) {
        return (
            <Layout>
                <section className="main-section-container">
                    <h1>Vaccination was not found.</h1>
                </section>
            </Layout>
        )
    }

    // If the vaccine was found display a form
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
                                inputProps={{ maxLength: 20 }}
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
