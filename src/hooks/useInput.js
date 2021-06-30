import { useState } from 'react'

  // const passwordValidator = (value) => {
    //     //need to set state here, so I know which error it is
    //     let validLength  = value.trim().length >= 8
    //     let hasNumber =  /\d/.test(value)
    //     let upperCase =  value.toLowerCase() !== value
    //     let lowerCase =  value.toUpperCase() !== value
    //     let specialChar =  /[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(value)
    //     if (validLength && hasNumber && upperCase && lowerCase && specialChar) {
    //         return true
    //     } else { 
    //         return false
    //     }
    // }

//restore this and make a new one for passwords
const useInput = (passwordValidator) => {
    const [inputValue, setInputValue] = useState('')
    const [touched, setTouched] = useState(false)
  
    //might want to set state here
    const validValue = passwordValidator(inputValue)
    //has error needs to be a function
    const hasError = !validValue && touched 

    //need another function that checks for errors, and returns when it finds one

    const valueChangeHandler = (event) => {
        setInputValue(event.target.value)
    }

    const inputBlurHandler = (event) => {
        console.log('blur')
        setTouched(true)
    }

    return {
        value: inputValue,
        valid: validValue,
        hasError,
        valueChangeHandler,
        inputBlurHandler
        //return states?
    }
}
export default useInput