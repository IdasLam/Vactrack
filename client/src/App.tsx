import * as firebase from 'firebase/app'
import './firebase'
import 'normalize.css'
import React, { useEffect, useState } from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import indigo from '@material-ui/core/colors/indigo'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom'
import Login from './views/login/login'
import Home from './views/home/home'
import Person from './views/person/person'
import { useAuthState } from 'react-firebase-hooks/auth'
import Loader from './components/loading/loading'
import AddPerson from './views/add/person'
import AddVaccine from './views/add/vaccine'
import { userExsists } from './services/family/family'
import EditPerson from './views/edit/person'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: indigo[900],
        },
        secondary: {
            main: indigo[700],
        },
    },
})

function App() {
    const [exsist, setExsists] = useState<boolean>(false)
    const [user, loading] = useAuthState(firebase.auth())
    const history = useHistory()
    const location = useLocation()

    const getExists = async () => {
        if (user) {
            setExsists(await userExsists(user))
        }
    }

    useEffect(() => {
        if (user) {
            getExists()
        }
    }, [user])

    useEffect(() => {
        const isOnLoginPage = location.pathname === '/'
        const hasLoadedButNotSignedIn = user === null && !loading
        const hasLoadedAndSignedIn = user !== null && isOnLoginPage

        if (hasLoadedButNotSignedIn) {
            return history.replace('/')
        }

        if (hasLoadedAndSignedIn) {
            return history.replace('/home')
        }
    }, [user, loading, history, location.pathname])

    if (loading && !exsist) {
        return <Loader />
    }

    return (
        <ThemeProvider theme={theme}>
            <Switch>
                <Route path="/edit/person">
                    <EditPerson />
                </Route>
                <Route path="/add/person">
                    <AddPerson />
                </Route>
                <Route path="/add/vaccine">
                    <AddVaccine />
                </Route>
                <Route path="/person">
                    <Person />
                </Route>
                <Route path="/home">
                    <Home />
                </Route>
                <Route path="/">
                    <Login />
                </Route>
            </Switch>
        </ThemeProvider>
    )
}

export default App
