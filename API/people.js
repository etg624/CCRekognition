//###### Sun Dec 31 14:12:19 PDT 2017  New module for people API
//###### Wed Jan 3 09:56:35 PST 2018 Added new route for outside callers using JSON web tokens
//###### Fri Jan 5 11:05:02 PST 2018  THIS CONTROLLER 
//###### Sun Jul 1 21:32:09 PDT 2018 Support for high volume processing (retrieval in chunks)
var mysql = require('mysql');
var path = require( 'path' );
var db = require('../models/db');
var jwt = require('jsonwebtoken');


/**
================================================================================================
                                     Objective of this module
                                     
                API to access People table data for PRIVATE (sweep/app) callers
================================================================================================ 
*/
exports.getPeople = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  
  //Make sure the api call has a valid password
  console.log ("People API:  Has been called with... "+JSON.stringify(req.body))
  var pass = req.body.pass

  // Chunk count won't be part of the call for older versions of the app
  var retrievalChunkCount = 0
  if (typeof req.body.ChunkCount == 'undefined'){
    console.log ("People API : ChunkCount is undefined, assuming 0")
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
  //Check whether requestis authorized
  if (pass != "agpbrtdk") {
    res.status (400) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 400 returned from server
    res.send ('Unauthorised request') // When called from the App, this goes into tData and urlResponse
    // or res.status(400).json({error: 'message'})
    
  }else{

    db.createConnection(function(err,reslt){  
      if (err) {
        console.log('People API: Error while performing common connect query: ' + err);
        //callback(err, null);
      }else{
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;

        var beginRecord = getRetrievalStartRecord(retrievalChunkCount)

        console.log("People API: Record to start retrieval: "+beginRecord)

        var _sqlQ = "SELECT * FROM people LIMIT "+beginRecord+","+maxNumberOfRecordsToRetrieve;


        connection.query(_sqlQ, function(err, results) {
          //connection.release();
          if(err) { console.log('People API: Internal API error:  '+err); res.json(results); connection.end(); return; }
        
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


//###### Sat Mar 04 13:18:34 EST 2018 Get rowcount for App check sum
////////////////////////////////////////////////////////////////////////////
//  API to access People COUNT for PRIVATE (sweep/app) callers
//////////////////////////////////////////////////////////////////////////////
exports.getPeopleCount = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  

  //Make sure the api call has a valid password
  console.log ("Called the get people COUNT API with... "+JSON.stringify(req.body))
  var pass = req.body.pass


  //Check whether requestis authorized
  if (pass != "agpbrtdk") {
    res.status (400) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 400 returned from server
    res.send ('Unauthorised request') // When called from the App, this goes into tData and urlResponse
    // or res.status(400).json({error: 'message'})
    
  }else{
    //Use the common routine in models to get the rowcount
    db.getTableRowCount('People', function(err,rslt9){
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

///////////////////////////////////////////////////////////////////////////
//  API to access People data from PUBLIC (published API) callers
//////////////////////////////////////////////////////////////////////////////
exports.apiGetPeople = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  

//Make sure the api call has a valid password
console.log ("here is the body POST API "+JSON.stringify(req.body))
var bodyStr = JSON.stringify(req.body)

var body = JSON.parse(bodyStr)
console.log ("here is the body "+body[0])
var token = req.body.token;
var lastName = req.body.lastName
var badgeNumber = req.body.badgeNumber
var empID = req.body.empID

//var arg = body[2]
console.log("here is the arg "+lastName)

if (lastName != ""){
  var _sqlQ = "SELECT * FROM people WHERE LastName = '"+lastName+"'";
}else if (badgeNumber != ""){
  var _sqlQ = "SELECT * FROM people WHERE iClassNumber = "+badgeNumber;
}else if (empID != ""){
  var _sqlQ = "SELECT * FROM people WHERE EmpID = '"+empID+"'";
}else{
  var _sqlQ = "SELECT * FROM people";

}
  



//decode the token to check it is valid
try {
  var decoded = jwt.verify(token, "boris")
  console.log("Token from request "+token)
  
  //The token is valid and so ertireve the people data and return it to the erequester
  db.createConnection(function(err,reslt){  
    if (err) {
      console.log('Error while performing common connect query: ' + err);
      //callback(err, null);
    }else{
      //process the i/o after successful connect.  Connection object returned in callback
      var connection = reslt;

      //var _sqlQ = "SELECT * FROM people";
      console.log('The SQL : ' + _sqlQ);
      
      connection.query(_sqlQ, function(err, results) {
        //connection.release();
        if(err) { console.log('Internal API error:  '+err); res.json(results); connection.end(); return; }
      
        connection.end();
        
        //Return results in JSON format 
        res.json (results);
        
      });
    } 
  });

  } catch (err) {
    console.log('CCERROR, request unsuccessful:  '+err)
    res.status (401) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 400 returned from server
    res.send ('Unauthorised request') // When called from the App, this goes into tData and urlResponse
  }
 
}