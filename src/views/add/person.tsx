import React, { FunctionComponent, useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import firebase from 'firebase/app'
import * as user from '../../services/user/user'
import * as family from '../../services/family/family'
import { Family, Name } from '../../models/family'
import * as fetch from '../../services/family/family'
import Loader from '../../components/loading/loading'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import * as validation from '../../services/validation/person'
import { FormControl, TextField, MenuItem } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import dayjs from 'dayjs'
import dayjsUtils from '@date-io/dayjs'
import { useHistory } from 'react-router-dom'
import MiddleButtonSubmit from '../../components/button/sumbit'
import './form.scss'
import Message from 'antd/lib/message'
import 'antd/dist/antd.css'

const firestore = firebase.firestore()
// con history

const AddPerson: FunctionComponent = () => {
    const history = useHistory()

    const [errorName, setErrorName] = useState(false)
    const [status, setStatus] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [date, setDate] = useState<any>(dayjs().format('YYYY-MM-DD'))
    const [valid, setValid] = useState<boolean>(false)

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

    useEffect(() => {
        if (name && !errorName && date && status) {
            setValid(true)
        } else {
            setValid(false)
        }
    }, [name, date, errorName, status])

    if (loading) {
        return <Loader />
    }

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (valid && uid && value) {
            const dateformat = date ? firebase.firestore.Timestamp.fromDate(new Date(date)) : ''
            family
                .addPerson(uid, status, name, dateformat)
                .then(() => {
                    Message.success(`${name} has been added to the Family!`)
                    history.push('/home')
                })
                .catch((error) => {
                    Message.error('Unknown error has occured')
                    console.log(error)
                })

            history.push('/home')
        }
    }

    return (
        <Layout>
            <section className="main-section-container person">
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
                                value={date}
                                onChange={(inputDate) => setDate(inputDate?.format('YYYY-MM-DD'))}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </FormControl>
                    <MiddleButtonSubmit valid={valid} />
                </form>
            </section>
        </Layout>
    )
}

export default AddPerson
