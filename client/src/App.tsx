import 'normalize.css'
import React from 'react'
// import logo from './logo.svg'
// import './App.css'
import Login from './views/login/login'
import {createMuiTheme, ThemeProvider} from "@material-ui/core"
import indigo from '@material-ui/core/colors/indigo'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const theme = createMuiTheme({
    palette: {
      primary: {
        main: indigo[900],
      },
      secondary: {
        main: indigo[700],
      },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Switch>
                    <Route path="/">
                        <Login />
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    )
}

export default App
