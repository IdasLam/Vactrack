import React, { FunctionComponent } from 'react'
import { CircularProgress } from '@material-ui/core'
import './loading.scss'

const Loader: FunctionComponent = () => {
    return (
        <div className="loader">
            <CircularProgress />
        </div>
    )
}

export default Loader
