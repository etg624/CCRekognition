
var mysql = require('mysql');
var path = require( 'path' );
var db = require('../models/db');
var jwt = require('jsonwebtoken');
var fs = require('fs')

/**
================================================================================================
                                     Objective of this module
                                     
        API to access  COUNT of the image zip files for PRIVATE (sweep/app) callers
================================================================================================ 
*/

/**
================================================================================================
                                        Functions
================================================================================================ 
*/

function createLogEntry ( param ) {  
    fs.open('./public/reports/api.log', 'a', 666, function( e, id ) {
    fs.appendFileSync(id, param + "\r\n", null, 'utf8')
    fs.close(id, function(){});
    return
});
};

/**
================================================================================================ 
*/ 


/**
================================================================================================
                                        Function Execution
================================================================================================ 
*/

exports.getZipFileCount = function(req, res) {

    //Make sure the api call has a valid password
    console.log ("Called the getZipFileCount API with... "+JSON.stringify(req.body))
    //
    var pass = req.body.pass
    const zipFileDir = './public'
    var numberOfZipFilesCounter = 0
    const zipFileName = 'photosForDownload'
    const logFileEntryPrefix = 'Zip File Count: '

    //

    //Check whether request is authorized
    if (pass != "agpbrtdk") {
        res.status (400) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 400 returned from server
        res.send ('Unauthorised request') // When called from the App, this goes into tData and urlResponse
        // or res.status(400).json({error: 'message'})

    }else{

        fs.readdir( zipFileDir, function( err, arrayOfFileNames ) {

            if( err ) {
                console.log(err)
                createLogEntry(logFileEntryPrefix+err)
            }else{ 

                var numberOfFilesInArray = arrayOfFileNames.length

                for (var i = 0 ; i < numberOfFilesInArray; i++) {
                    
                    if (arrayOfFileNames[i].includes(zipFileName)){ numberOfZipFilesCounter++}
                
                }

                res.status(200);
                //Can't send an integer with res.send so converting to a string
                //could do res.json but dont want to have to unpack JSON in the App for 
                //such a simple response
                res.send (''+numberOfZipFilesCounter);

            }
        })
    }

}

/**
================================================================================================ 
*/ 
