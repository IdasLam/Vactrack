import React, { FunctionComponent, useEffect, useState } from 'react'
import Layout from '../../components/layout/layout'
import { useHistory } from 'react-router-dom'
import * as fetch from '../../services/family/family'
import * as user from '../../services/user/user'
import { Person } from '../../models/family'
import { FormControl, TextField, MenuItem } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import dayjsUtils from '@date-io/dayjs'
import MiddleButtonSubmit from '../../components/button/sumbit'
import Loader from '../../components/loading/loading'
import * as validation from '../../services/validation/person'
import dayjs from 'dayjs'

const EditPerson: FunctionComponent = () => {
    const [nameSearch, setNameSearch] = useState<string>('')
    const history = useHistory()
    const [uid, setUid] = useState<string>()
    const [personData, setPersonData] = useState<Person>()

    const [personName, setPersonName] = useState<string>()
    const [status, setStatus] = useState<string>()
    const [date, setDate] = useState<any>(dayjs().format('YYYY-MM-DD'))

    useEffect(() => {
        setUid(user.getUid())
    }, [setUid])

    const getPersonData = async () => {
        if (nameSearch && uid) {
            const data = await fetch.getPersonData(uid, nameSearch)

            if (data) {
                setPersonData(data)
            }
        }
    }

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
        }
    }, [personData])

    console.log(personData)
    console.log(personData?.status === 'user')

    if (personData) {
        return (
            <Layout>
                <section className="main-section-container">
                    <h1>Edit person</h1>
                    <form>
                        <FormControl>
                            <TextField
                                onChange={(event) => {
                                    console.log(event)
                                }}
                                id="name"
                                label="Name"
                                // error={errorName}
                                // helperText={errorName ? 'Person already exsists.' : ''}
                                required
                                disabled={personData.status === 'user'}
                            />
                            <TextField
                                label="Status"
                                value={'asd'}
                                select
                                onChange={(event) => {
                                    console.log(event)
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
                                    value={1}
                                    onChange={(inputDate) => console.log(inputDate)}
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

    return <Loader />
}

export default EditPerson
