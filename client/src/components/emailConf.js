import React from 'react'
import {withRouter} from 'react-router'

const EmailConf = (props) => {
    const token = this.props.match.token

    const confirmHandler = () => {
        fetch(`api/email_confirmation/${token}`)
        .then(res => {console.log(res.json())})

    return (
    <div>
        <button type="submit" onClick={confirmHandler}>Confirm email</button>
    </div>
    )
}
}

export default withRouter(EmailConf)