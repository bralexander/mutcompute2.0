import React, { useEffect } from 'react'
import {withRouter} from 'react-router'
import { useHistory } from 'react-router-dom'
import { login } from '../auth'
// import { login } from 'auth'
const EmailConf = (props) => {
    const history = useHistory()

    const token = props.match.params.token
    useEffect(() => {
        confirmHandler()
    }, [])

    
    const confirmHandler = () => {
        fetch(`/api/email_confirmation/${token}`)
        .then(r => r.json())
        .then(token => {
        if (token.access_token){
          login(token)
          console.log(token)  
          history.push('/')        
        }
        else {
          alert("Incorrect/Expired token. Please register again.")
          history.push('/register')
        }
        // .then(async res => {
        //     console.log('got a response', res)
        //     const result = await res.json()
        //      login(token)
        //     console.log({result, token})
        //     // alert(result.data)
        //     history.push('/')
        //     // handle the 200 case
        //       // save token in localstorage
        //     // handle the 400 case
        })
        }

    return (
    <div>
    </div>
    )

}

export default withRouter(EmailConf)