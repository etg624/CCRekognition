//######
//###### Sun Dec 31 14:12:19 PDT 2017  New module for people API
//###### Wed Jan 3 09:56:35 PST 2018 Added new route for outside callers using JSON web tokens

var mysql = require('mysql');
var path = require( 'path' );
var db = require('../models/db');
var inviteLists = require('../models/inviteList');
var invitees = require('../models/invitees');

var jwt = require('jsonwebtoken');



////////////////////////////////////////////////////////////////////////////
//  API to access InviteLists data from PRIVATE callers 
//////////////////////////////////////////////////////////////////////////////
exports.getInviteLists = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  

//Make sure the api call has a valid password
console.log ("here is the body POST API "+JSON.stringify(req.body))
var pass = req.body.pass

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


      var _sqlQ = "SELECT * FROM InviteList order by InvitationListID ASC";
      connection.query(_sqlQ, function(err, results) {
        //connection.release();
        if(err) { console.log('Internal API error:  '+err); res.json(results); connection.end(); return; }
      
        connection.end();

        //TypeError: First argument must be a string or Buffer
        //res.end (results);

        //Returns a JSON file (was able to open up in notepad after browser asked what i wanteed to do with it)
        //res.send (results);
        
        //Returns a JSON file (was able to open up in notepad after browser asked what i wanteed to do with it)
        res.json (results);
        
      });
    } 
  });
}

}

////////////////////////////////////////////////////////////////////////////
//  API to access Invitees data from PRIVATE callers 
//////////////////////////////////////////////////////////////////////////////
exports.getInvitees = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  

//Make sure the api call has a valid password
console.log ("here is the body POST API "+JSON.stringify(req.body))
var pass = req.body.pass

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


      var _sqlQ = "SELECT * FROM invitees ORDER BY InvitationListID ASC";
      connection.query(_sqlQ, function(err, results) {
        //connection.release();
        if(err) { console.log('Internal API error:  '+err); res.json(results); connection.end(); return; }
      
        connection.end();

        //TypeError: First argument must be a string or Buffer
        //res.end (results);

        //Returns a JSON file (was able to open up in notepad after browser asked what i wanteed to do with it)
        //res.send (results);
        
        //Returns a JSON file (was able to open up in notepad after browser asked what i wanteed to do with it)
        res.json (results);
        
      });
    } 
  });
}

}

///////////////////////////////////////////////////////////////////////////
//  API to create an Invite List (header record) from PUBLIC callers
//////////////////////////////////////////////////////////////////////////////
exports.apiCreateInviteList = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  
  //1. create the list using a name and then return an Invite List number
  //.. then for invitees, call these methods using the invite list #:
  //2. Add in bulk
  //3. Add 1
  //4. Delete 1

  //Make sure the api call has a valid password
  console.log ("here is the body POST API "+JSON.stringify(req.body))
  var bodyStr = JSON.stringify(req.body)

  var body = JSON.parse(bodyStr)
  console.log ("here is the body "+body[0])
  var token = req.body.token;
  var listName = req.body.listName
  var listComment = req.body.listComment
  
  //listName parameter is required
  if(listName == "") { console.log("API error, incomplete request"); res.status(400); res.send("List Name is Blank"); return }
  

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
        
        inviteLists.createInviteList(connection, listName, listComment, function(err, results) {
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

///////////////////////////////////////////////////////////////////////////////
//  API to add an Invitee to an Invite List from PUBLIC callers
///////////////////////////////////////////////////////////////////////////////
exports.apiAddInvitee = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  
  //1. create the list using a name and then return an Invite List number
  //.. then for invitees, call these methods using the invite list #:
  //2. Add in bulk
  //3. Add 1
  //4. Delete 1

  //Make sure the api call has a valid password
  console.log ("here is the body POST API "+JSON.stringify(req.body))
  var bodyStr = JSON.stringify(req.body)

  var body = JSON.parse(bodyStr)
  console.log ("here is the body "+body[0])
  var token = req.body.token;
  var listID = req.body.listID
  var badgeNumber = req.body.badgeNumber
  var lastName = req.body.lastName
  var firstName = req.body.firstName
  var emailAddress = req.body.emailAddress
  var notificationNumber = req.body.notificationNumber
  var numberFormat = req.body.numberFormat
    


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

        //Make sure the InviteList exists
        var strSQL = "SELECT * FROM InviteList WHERE InvitationListID="+listID
        console.log(strSQL)
        var query = connection.query(strSQL , function(err, result) {
          
            //connection.release();
          if(err) { console.log('Internal API error:  '+err); res.status(400); res.json(result); connection.end(); return; }
          else{
            if (result.length ==0){
              console.log('The inviteList Does Not Exist:  '+err); res.status(400); res.send("Invite list does not exist"); connection.end(); return;
            } else{
              invitees.addInvitee(connection, listID, badgeNumber, lastName, firstName, emailAddress, notificationNumber, numberFormat, function(err, results) {
              
                if(err) { console.log('Internal API error:  '+err); res.status(400); res.json(results); connection.end(); return; }
              
              connection.end();
                
              //Return results in JSON format 
              res.json (results);
                
              });
            }
          }
            
        });

      } 
    });

    } catch (err) {
      console.log('CCERROR, request unsuccessful:  '+err)
      res.status (401) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 400 returned from server
      res.send ('Unauthorised request') // When called from the App, this goes into tData and urlResponse
    }
 
}


///////////////////////////////////////////////////////////////////////////////
//  API to add an Invitee to an Invite List from PUBLIC callers
///////////////////////////////////////////////////////////////////////////////
exports.apiDeleteInvitee = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  
  //1. create the list using a name and then return an Invite List number
  //.. then for invitees, call these methods using the invite list #:
  //2. Add in bulk
  //3. Add 1
  //4. Delete 1

  //Make sure the api call has a valid password
  console.log ("here is the body POST API "+JSON.stringify(req.body))
  var bodyStr = JSON.stringify(req.body)

  var body = JSON.parse(bodyStr)
  console.log ("here is the body "+body[0])
  var token = req.body.token;
  var listID = req.body.listID
  var badgeNumber = req.body.badgeNumber
    


  //decode the token to check it is valid
  try {
    var decoded = jwt.verify(token, "boris")
    console.log("Token from request "+token)
    
    //The token is valid so delete the invitee
    db.createConnection(function(err,reslt){  
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        //callback(err, null);
      }else{
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;

        //Make sure the InviteList exists
        var strSQL = "DELETE FROM Invitees WHERE InvitationListID="+listID+" AND BadgeNumber="+badgeNumber
        console.log(strSQL)
        var query = connection.query(strSQL , function(err, result) {
          
            //connection.release();
          if(err) { console.log('Internal API error:  '+err); res.status(400); res.send("Error attempting to delete"); connection.end(); return; }
          else{
           
              connection.end();
                
              //Return results in JSON format 
              res.json (result);
          }      
        });
      }
            
    });

  } catch (err) {
      console.log('CCERROR, request unsuccessful:  '+err)
      res.status (401) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 400 returned from server
      res.send ('Unauthorised request') // When called from the App, this goes into tData and urlResponse
    }
 
}