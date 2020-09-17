import 'normalize.css'
import React from 'react'
// import logo from './logo.svg'
// import './App.css'
import Login from './views/login/login'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <Login />
                </Route>
            </Switch>
        </Router>
    )
}

export default App
