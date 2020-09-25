import React, { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'

const Person: FunctionComponent = (props) => {
    // let { id } = useParams();

    const { id } = useParams()

    return (
        <div>
            <h1>ello dis person</h1>
        </div>
    )
}

export default Person
