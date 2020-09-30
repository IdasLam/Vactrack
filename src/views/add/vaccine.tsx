import React, { FunctionComponent, useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import firebase from 'firebase/app'
import * as user from '../../services/user/user'
import * as family from '../../services/family/family'
import { InputVaccineData, Family, Name } from '../../models/family'
import * as fetch from '../../services/family/family'
import Loader from '../../components/loading/loading'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { FormControl, TextField, FormControlLabel, Switch, MenuItem, FormGroup } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import dayjs, { OpUnitType } from 'dayjs'
import dayjsUtils from '@date-io/dayjs'
import { useHistory } from 'react-router-dom'
import MiddleButtonSubmit from '../../components/button/sumbit'
import './form.scss'
import Message from 'antd/lib/message'
import 'antd/dist/antd.css'

const firestore = firebase.firestore()

const AddVaccine: FunctionComponent = () => {
    const history = useHistory()

    const [valid, setValid] = useState<boolean>(false)

    const [inputVaccineName, setInputVaccineName] = useState<string>('')
    const [inputName, setInputName] = useState<string>('')
    const [date, setDate] = useState<any>(dayjs().format('YYYY-MM-DD'))
    const [revaccinate, setRevaccinate] = useState<boolean>(false)
    const [remindNumber, setRemindNumber] = useState<string>('1')
    const [remindTime, setRemindTime] = useState<OpUnitType>('year')

    const [remindError, setRemindError] = useState<boolean>(false)

    const [nameList, setNameList] = useState<Name[]>()

    const [uid, setUid] = useState<string>()

    useEffect(() => {
        setUid(user.getUid())
    }, [setUid])

    const doc = firestore.doc(`family/${uid}`)
    const [value, loading] = useDocumentData<Family>(doc)

    useEffect(() => {
        const firstFormIsFilled = inputVaccineName && inputName && date
        const secondFormIsFilled = revaccinate && !remindError && remindTime

        if (firstFormIsFilled && !revaccinate) {
            setValid(true)
        } else if (firstFormIsFilled && secondFormIsFilled) {
            setValid(true)
        } else {
            setValid(false)
        }
    }, [inputVaccineName, inputName, date, revaccinate, remindError, remindTime])

    useEffect(() => {
        if (value) {
            setNameList(fetch.getAllNames(value, false))
        }
    }, [value])

    if (loading) {
        return <Loader />
    }

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (valid && value && uid) {
            const dateformat = firebase.firestore.Timestamp.fromDate(new Date(date))
            const formData: InputVaccineData = {
                name: inputName,
                vaccineName: inputVaccineName,
                date: dateformat,
                revaccination: undefined,
            }

            if (revaccinate) {
                const revaccinateDate = dayjs(date).add(parseInt(remindNumber), remindTime).toDate()
                formData.revaccination = firebase.firestore.Timestamp.fromDate(new Date(revaccinateDate))
            }

            family
                .addVaccine(value, formData, uid)
                .then(() => {
                    Message.success(`A new vaccine has been added to ${inputName}`)
                    history.push('/home')
                })
                .catch((error) => {
                    Message.error('Unknown error has occured')
                    console.log(error)
                })
        }
    }

    const addOptions = () => {
        return nameList?.map((name) => {
            return (
                <MenuItem value={name} key={name}>
                    {name}
                </MenuItem>
            )
        })
    }

    return (
        <Layout>
            <section className="main-section-container person">
                <h1>Add a new vaccination</h1>
                <form onSubmit={submit}>
                    <FormControl>
                        <TextField
                            value={inputVaccineName}
                            onChange={(event) => {
                                // check if already in list
                                setInputVaccineName(event.target.value)
                            }}
                            label="Vaccine name"
                            required
                        />
                        <TextField
                            label="Person name"
                            value={inputName}
                            select
                            onChange={(event) => {
                                setInputName(event.target.value)
                            }}
                            required
                        >
                            {addOptions()}
                        </TextField>
                        <MuiPickersUtilsProvider utils={dayjsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="YYYY-MM-DD"
                                margin="normal"
                                label="Vaccination date"
                                value={date}
                                onChange={(inputDate) => setDate(inputDate?.format('YYYY-MM-DD'))}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        <FormGroup aria-label="position" row>
                            <FormControlLabel
                                label="Revaccination"
                                labelPlacement="start"
                                control={
                                    <Switch
                                        checked={revaccinate}
                                        onChange={() => {
                                            setRevaccinate(!revaccinate)
                                        }}
                                    />
                                }
                            />
                        </FormGroup>
                        {revaccinate ? (
                            <React.Fragment>
                                <TextField
                                    label="Remind in"
                                    type="number"
                                    value={remindNumber}
                                    onChange={(event) => {
                                        setRemindNumber(event.target.value)
                                        setRemindError(parseInt(event.target.value) <= 0)
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={remindError}
                                    helperText={remindError ? 'Must be 1 or more' : ''}
                                    required
                                />
                                <TextField
                                    label="Week, Month or Year"
                                    value={remindTime}
                                    select
                                    onChange={(event) => {
                                        setRemindTime(event.target.value as OpUnitType)
                                    }}
                                    required
                                >
                                    <MenuItem value="week">week(s)</MenuItem>
                                    <MenuItem value="month">month(s)</MenuItem>
                                    <MenuItem value="year">year(s)</MenuItem>
                                </TextField>
                            </React.Fragment>
                        ) : null}
                    </FormControl>
                    <MiddleButtonSubmit valid={valid} />
                </form>
            </section>
        </Layout>
    )
}

export default AddVaccine
