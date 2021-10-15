import { useState, useCallback } from "react";
import {authFetch} from '../auth'

const useFile = (fileHandler) => {
    const [loading, setLoading] = useState(true)
    
       const fetchFile = useCallback(async (fileName, fileHandler) => { 
        setLoading(true)
        const uFile = fileName.toUpperCase()
        const response = await authFetch('/api/fetch_predictions', {
        method: 'post',
        url:'/fetch_predictions',
        body: JSON.stringify(uFile),
        headers: {
            'content-type': 'application/json'
        }
        })
        const data = await response.json()
        fileHandler(data)
        setLoading(false)
    },[]);    

    return {
        loading,
        fetchFile
    }
}

export default useFile;
