import * as firebase from 'firebase/app'
import './firebase'
import 'normalize.css'
import React, { useEffect, useState } from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import indigo from '@material-ui/core/colors/indigo'
import { BrowserRouter as Router, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import Login from './views/login/login'
import Home from './views/home/home'
import Person from './views/person/person'

// firebase.firestore()

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
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const history = useHistory()

    useEffect(() => {
        firebase.auth().onAuthStateChanged((result) => {
            const shouldBeLoggedIn = result !== null
            setIsLoggedIn(shouldBeLoggedIn)

            if (shouldBeLoggedIn) {
                history.replace('/home')
            }
        })
    }, [history, setIsLoggedIn])

    // om loggad in kan inte komma in i / vice versa
    return (
        <ThemeProvider theme={theme}>
            <Switch>
                <Route path="/person?name=:id">
                    <Person />
                </Route>
                <Route path="/home">
                    <Home />
                </Route>
                <Route path="/">
                    <Login />
                </Route>
                {!isLoggedIn && window.location.pathname !== '/' ? <Redirect to="/" /> : null}
            </Switch>
        </ThemeProvider>
    )
}

export default App
