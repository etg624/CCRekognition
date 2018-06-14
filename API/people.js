//######
//###### Sun Dec 31 14:12:19 PDT 2017  New module for people API
//###### Wed Jan 3 09:56:35 PST 2018 Added new route for outside callers using JSON web tokens
//###### Fri Jan 5 11:05:02 PST 2018  THIS CONTROLLER 
var mysql = require('mysql');
var path = require( 'path' );
var db = require('../models/db');
var jwt = require('jsonwebtoken');



////////////////////////////////////////////////////////////////////////////
//  API to access People data for PRIVATE (sweep/app) callers
//////////////////////////////////////////////////////////////////////////////
exports.getPeople = function(req, res) {
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


      var _sqlQ = "SELECT * FROM people";
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
exports.getPeopleCount = function(req, res) {
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