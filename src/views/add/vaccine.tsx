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
import { FormControl, TextField, Button, MenuItem, InputLabel } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import dayjs from 'dayjs'
import dayjsUtils from '@date-io/dayjs'
import { useHistory } from 'react-router-dom'
import MiddleButtonSubmit from '../../components/button/sumbit'
import './person.scss'
import { useQuery } from '../../services/hooks/hooks'

const firestore = firebase.firestore()
// con history

const AddVaccine: FunctionComponent = () => {
    const history = useHistory()
    const query = useQuery()

    const [errorName, setErrorName] = useState(false)
    // const [status, setStatus] = useState<string>('')
    const [inputName, setInputName] = useState<string>('')
    const [date, setDate] = useState<any>(dayjs().format('YYYY-MM-DD'))
    // const [valid, setValid] = useState<boolean>(false)

    const [nameList, setNameList] = useState<Name[]>()

    const [uid, setUid] = useState<string>()

    useEffect(() => {
        setUid(user.getUid())
    }, [setUid])

    // useEffect(() => {
    //     setInputName(query.get('person') ?? '')
    // }, [setInputName])

    const doc = firestore.doc(`family/${uid}`)
    const [value, loading] = useDocumentData<Family>(doc)

    useEffect(() => {
        if (value) {
            setNameList(fetch.getAllNames(value, false))
        }
    }, [value])

    // useEffect(() => {
    //     if (name && !errorName && date && status) {
    //         setValid(true)
    //     } else {
    //         setValid(false)
    //     }
    // }, [name, date, errorName, status])

    if (loading) {
        return <Loader />
    }

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        // if (valid && uid && value) {
        //     const dateformat = date ? firebase.firestore.Timestamp.fromDate(new Date(date)) : ''
        //     family.addPerson(uid, status, name, dateformat)
        //     history.push('/home')
        // }
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

    console.log(nameList)

    return (
        <Layout>
            <section className="main-section-container person">
                <h1>Add a new vaccine</h1>
                <form onSubmit={submit}>
                    <FormControl>
                        <TextField
                            label="Name"
                            value={inputName}
                            select
                            onChange={(event) => {
                                setInputName(event.target.value)
                            }}
                            required
                        >
                            {addOptions()}
                        </TextField>
                        {/* <TextField
                            label="Status"
                            value={'snopp'}
                            select
                            onChange={(event) => {
                                console.log(event.target.value)
                                // setStatus(event.target.value)
                            }}
                            required
                        >
                            <MenuItem value="Custodian/Parent">Custodian/Parent</MenuItem>
                            <MenuItem value="Child">Child</MenuItem>
                            <MenuItem value="Pet">Pet</MenuItem>
                        </TextField> */}
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
                    <MiddleButtonSubmit valid={true} />
                </form>
            </section>
        </Layout>
    )
}

export default AddVaccine
