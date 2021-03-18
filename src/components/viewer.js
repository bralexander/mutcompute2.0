import React, {useEffect} from 'react';
import { Stage } from 'ngl';


// need to install react-document-meta in npm and import to update meta tags

const Viewer = () => {
useEffect (() => {
    var stage = new Stage("viewport");
    stage.loadFile("rcsb://1crn", {defaultRepresentation: true});
    
});

    return (
        <div id="viewport" style={{width:"100%", height:"100vh"}}>
        </div>
    )
}

export default Viewer