//###### Sun Dec 31 14:12:19 PDT 2017  New module for people API
//###### Sun Jul 1 21:26:51 PDT 2018 Support for high volume processing (retrieval in chunks)

var mysql = require('mysql');
var path = require( 'path' );
var db = require('../models/db');

/**
================================================================================================
                                     Objective of this module
                                     
                API to access Accesslevels data for PRIVATE (sweep/app) callers
================================================================================================ 
*/
exports.getAccessLevels = function(req, res) {
  
  console.log ("Access Levels API : Has been called with... "+JSON.stringify(req.body))

  var pass = req.body.pass

  // Chunk count won't be part of the call for older versions of the app
  var retrievalChunkCount = 0
  if (typeof req.body.ChunkCount == 'undefined'){
    console.log ("AccessLevels API : ChunkCount is undefined, assuming 0")
  }else{
    retrievalChunkCount= req.body.ChunkCount
  }
  //
  const maxNumberOfRecordsToRetrieve = 25000

	/**
  ================================================================================================
                                          Common functions
  ================================================================================================ 
  */
  function getRetrievalStartRecord ( retrievalChunkCount ) {  

    var recordToStartRetrieval = 0
    var retrievalChunkCountInteger = parseInt(retrievalChunkCount, 10);

    if (retrievalChunkCountInteger !=0){
      recordToStartRetrieval = (retrievalChunkCountInteger-1)*maxNumberOfRecordsToRetrieve
    }else{
      recordToStartRetrieval = 0 // This will be the case with older versions of the app
    }
    return recordToStartRetrieval
	};
 
  /**
  ================================================================================================ 
  */ 
  
  /**
  ================================================================================================
                                          Execution
  ================================================================================================ 
  */
  //Check whether request is authorized
  if (pass != "agpbrtdk") {
    res.status (400) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 400 returned from server
    res.send ('Unauthorised request') // When called from the App, this goes into tData and urlResponse
    // or res.status(400).json({error: 'message'})
    
  }else{

    db.createConnection(function(err,reslt){  
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        //callback(err, null);
      }else{

        var connection = reslt;

        var beginRecord = getRetrievalStartRecord(retrievalChunkCount)

        console.log("Access Levels API: Record to start retrieval: "+beginRecord)

        var _sqlQ = "SELECT * FROM accesslevels LIMIT "+beginRecord+","+maxNumberOfRecordsToRetrieve;


        connection.query(_sqlQ, function(err, results) {
          //connection.release();
          if(err) { console.log('Internal API error:  '+err); res.json(results); connection.end(); return; }
        
          connection.end();

          res.json (results);
          
        });
      } 
    });
  }

/**
================================================================================================ 
*/ 

}


////////////////////////////////////////////////////////////////////////////
//  API to access accesslevels data
//////////////////////////////////////////////////////////////////////////////
exports.getAccessLevels_OLD = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  

//Make sure the api call has a valid password
console.log ("here is the body POST API "+JSON.stringify(req.body))
var pass = req.body.pass
console.log("the password sent is "+pass)

//Check whether requestis authorized
if (pass != "agpbrtdk") {
  res.status (400) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 400 returned from server
  res.send ('Unauthorised request') // When called from the App, this goes into tData and urlResponse
  // or res.status(400).json({error: 'message'})
  
}else{

  db.createConnection(function(err,reslt){  
    if (err) {
      console.log('Error while performing common connect query: ' + err);
      //callback(err, null);
    }else{
      //process the i/o after successful connect.  Connection object returned in callback
      var connection = reslt;
      console.log('here is the connnection '+reslt.threadId);


      var _sqlQ = "SELECT * FROM AccessLevels";
      connection.query(_sqlQ, function(err, results) {
        //connection.release();
        if(err) { console.log('Internal API error:  '+err); res.json(results); connection.end(); return; }
      
        connection.end();

        //TypeError: First argument must be a string or Buffer
        //res.end (results);

        //Returns a JSON file (was able to open up in notepad after brower asked what i wanteed to do with it)
        //res.send (results);
        
        //Returns a JSON file (was able to open up in notepad after brower asked what i wanteed to do with it)
        res.json (results);
        
      });
    } 
  });
}

}

//###### Sat Mar 04 13:18:34 EST 2018 Get rowcount for App check sum
////////////////////////////////////////////////////////////////////////////
//  API to access People COUNT for PRIVATE (sweep/app) callers
//////////////////////////////////////////////////////////////////////////////
exports.getAccLvlCount = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  

  //Make sure the api call has a valid password
  console.log ("here is the body POST API "+JSON.stringify(req.body))
  var pass = req.body.pass
  console.log("the password sent is "+pass)

  //Check whether requestis authorized
  if (pass != "agpbrtdk") {
    res.status (400) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 400 returned from server
    res.send ('Unauthorised request') // When called from the App, this goes into tData and urlResponse
    // or res.status(400).json({error: 'message'})
    
  }else{
    //Use the common routine in models to get the rowcount
    db.getTableRowCount('AccessLevels', function(err,rslt9){
      if (err) {
        console.log('Error while performing row count query: ' + err);
      }else{
        var totalRecords = rslt9[0].rowCount;
        res.status(200);
        //Can't send an integer with res.send so converting to a string
        //could do res.json but dont want to have to unpack JSON in the App for 
        //such a simple response
        res.send (''+totalRecords);
      }
    })

  }

}


