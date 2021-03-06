import React, { FunctionComponent } from 'react'
import MHeader from '../m-header/m-header'
import DHeader from '../d-header/d-header'
import './layout.scss'
import MiddeButton from '../button/button'
import { useWindowSize } from '../../services/hooks/hooks'

/**
 * Component for layout template for logged in required views
 * @param props
 */
const Layout: FunctionComponent = (props) => {
    const size = useWindowSize()

    if (size) {
        return (
            <React.Fragment>
                <div className="wrapper-container">
                    {size < 950 ? <MHeader /> : null}
                    <DHeader />
                    <main>{props.children}</main>
                    {/* footer? */}
                </div>
                <MiddeButton />
            </React.Fragment>
        )
    }

    return null
}

export default Layout
