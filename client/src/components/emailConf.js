import React from 'react'
import {withRouter} from 'react-router'

const EmailConf = (props) => {
    const token = props.match.params.token

    const confirmHandler = () => {
        fetch(`/email_confirmation/${token}`)
        .then(res => {console.log(res.json())})
    }

    return (
        <div>
            <button type="submit" onClick={confirmHandler}>Confirm email</button>
        </div>
    )
}

export default withRouter(EmailConf)