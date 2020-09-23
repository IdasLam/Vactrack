import 'normalize.css'
import React from 'react'
// import logo from './logo.svg'
// import './App.css'
import Login from './views/login/login'
import Home from './views/home/home'

import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import indigo from '@material-ui/core/colors/indigo'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import * as firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/database'

const firebaseConfig = {
    apiKey: 'AIzaSyBOuPwXoezhpGhnHBFyl9AouCzODbzMWQA',
    authDomain: 'vactrack-87132.firebaseapp.com',
    databaseURL: 'https://vactrack-87132.firebaseio.com',
    projectId: 'vactrack-87132',
    storageBucket: 'vactrack-87132.appspot.com',
    messagingSenderId: '91574914055',
    appId: '1:91574914055:web:ff382a849dce483795eea2',
    measurementId: 'G-RVBYD3F8WN',
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()

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
    // om loggad in kan inte komma in i / vice versa
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Switch>
                    <Route path="/home">
                        <Home />
                    </Route>
                    <Route path="/">
                        <Login />
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    )
}

export default App
