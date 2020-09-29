import * as firebase from 'firebase/app'
import './firebase'
import 'normalize.css'
import React, { useEffect } from 'react'
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
    const [user, loading] = useAuthState(firebase.auth())
    const history = useHistory()
    const location = useLocation()

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

    if (loading) {
        return <Loader />
    }

    // om loggad in kan inte komma in i / vice versa
    return (
        <ThemeProvider theme={theme}>
            <Switch>
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
