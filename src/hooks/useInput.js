import { useState } from 'react'



const useInput = (validateValue) => {
    const [inputValue, setInputValue] = useState('')
    const [touched, setTouched] = useState(false)

    const validValue = validateValue(inputValue)
    const hasError = !validValue && touched

    const valueChangeHandler = (event) => {
        setInputValue(event.target.value)
    }

    const inputBlurHandler = (event) => {
        setTouched(true)
    }

    return {
        value: inputValue,
        valid: validValue,
        hasError,
        valueChangeHandler,
        inputBlurHandler
    }
}
export default useInput