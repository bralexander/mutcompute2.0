import React, {useEffect} from 'react';
import * as NGL from 'ngl'


// need to install react-document-meta in npm and import to update meta tags

const Viewer = () => {
useEffect (() => {
    NGL.DatasourceRegistry.add("data", new NGL.StaticDatasource("/data/"))

    var stage = new NGL.Stage("viewport");
    stage.loadFile("rcsb://1crn", {defaultRepresentation: true});
    
    
    window.addEventListener( "resize", function( event ){
        stage.handleResize();
    }, false );
    
});

    return (
        <div id="viewport" style={{width:"100%", height:"100vh"}}>
           
        </div>
    )
}

export default Viewer