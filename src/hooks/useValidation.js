import { useState, useEffect } from "react";

export const useValidation = ({ password1 = "", password2 = "", email1 = "", email2 = ""}) => {
const [validLength, setValidLength] = useState(null);
const [hasNumber, setHasNumber] = useState(null);
const [upperCase, setUpperCase] = useState(null);
const [lowerCase, setLowerCase] = useState(null);
const [specialChar, setSpecialChar] = useState(null);
const [pmatch, setPMatch] = useState(null);
const [ematch, setEMatch] = useState(null);

  useEffect(() => {
    console.log('UE called')
    setValidLength(password1.length >= 8 ? true : false);
    setUpperCase(password1.toLowerCase() !== password1);
    setLowerCase(password1.toUpperCase() !== password1);
    setHasNumber(/\d/.test(password1));
    setSpecialChar(/[ `!@#$%^&*()_+\-=\]{};':"\\|,.<>?~]/.test(password1));
    setPMatch(password1 && password1 === password2 ? true : false);
    setEMatch(email1 && email1 === email2);


    }, [password1, password2, email1, email2]);



return [validLength, hasNumber, upperCase, lowerCase, ematch, pmatch, specialChar]

}
