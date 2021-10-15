import React from 'react'
import {withRouter} from 'react-router'

const EmailConf = (props) => {
    const token = props.match.params.token

    const confirmHandler = () => {
        fetch(`/api/email_confirmation/${token}`)
        .then(res => {console.log(res.json())})
    }
    return (
    <div>
        <button className="w-20 btn btn-lg btn-primary"  type="submit" onClick={confirmHandler}>Confirm email</button>
    </div>
    )

}

export default withRouter(EmailConf)