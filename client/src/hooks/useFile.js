import Compvis3 from "../components/compvis3";
//import React, { useParams } from "react"
import React, { useState, useCallback } from "react";
//import { withRouter } from "react-router";

const useFile = (fileHandler) => {
    const [loadedFile, setFile] = useState(null)
    const [loading, setLoading] = useState(true)
    
    //console.log('File', uFile)
    // useEffect(() => {
       const fetchFile = useCallback(async (fileName, fileHandler) => { 
        setLoading(true)
        const uFile = fileName.toUpperCase()
        const response = await fetch('/api/nn', {
        method: 'post',
        url:'/nn',
        body: JSON.stringify(uFile),
        headers: {
            'content-type': 'application/json'
        }
        })
        const data = await response.json()
        const csvData = Object.values(data)
        fileHandler(csvData)
        //console.log('D', csvData)
        setFile(csvData)
        setLoading(false)
    },[]);    

    return {
        loading,
        loadedFile,
        fetchFile
    }
}

export default useFile;


// useEffect(() => {
    //     fetchFile()
    // }, [])

    // .then(res => res.json())
    // .then(
    //     data => {
    //         csvFile.push(Object.values(data))
    //         // console.log('csvFile', Object.values(data))
    //         // setFile(Object.values(data))
    //         // setloading(false)
    //         //csvFile.push(Object.values(data))
    //     }
    // );
    
    // setFile(csvFile[1])
    // console.log('Hook File', file)
    // setloading('loading')
// }, [fileName])

//     <div>
    //         <Compvis3 data={loadedFile} loading={loading}></Compvis3>
    //     </div>
    //     )
    // //(!loading && {loadedFile, loading})