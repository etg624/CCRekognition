//######
//###### ###### Sat Jan 6 11:44:28 PST 2018 new module for PRIVATE and PUBLIC api calls for Attendance data
//###### 

var mysql = require('mysql');
var path = require( 'path' );
var db = require('../models/db');
var jwt = require('jsonwebtoken');
//###### ###### Sat Mar 10 11:44:28 PST 2018 new module for PRIVATE api calls to post Attendance data
var attendance = require('../models/attendance');


////////////////////////////////////////////////////////////////////////////
//  API to access Attendance data from PRIVATE callers 
//////////////////////////////////////////////////////////////////////////////
exports.getEventAttendance = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  

//Make sure the api call has a valid password
console.log ("here is the body POST API "+JSON.stringify(req.body))
var pass = req.body.pass
var eventID = req.body.eventID

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
      console.log('here is the connection '+reslt.threadId);
    
      //%%%%%%%%%%%%%%%%%%%%
      //###### Wed May 5 18:23:41 PDT 2018  As well as the regular attendance records, get the muster records sent to the server that were taken for a device-generated muster
      //###### ...before that muster was sent up to the server and received another, server generated, ID.  The original EventID of the device-gen
      //###### ...muster is stored in a field in the events table, TempID
      //###### Note: The app could be sending a device genereated eventid (tempid) Or a regular (server gen'd) eventID, 
      //###### ...depending on whether it was the device that made the event or not.  So need to find out...
      var _sqlQ0 = 'SELECT EventID, TempID FROM events WHERE EventID='+eventID+' OR TempID='+eventID
      console.log(_sqlQ0);
      connection.query(_sqlQ0, function(err, result0) {   
      
          if (err) {
            console.log('Internal API error:  '+err)
            connection.end();
            res.json(results); 
            return; 
              
          }else{
              //###### Use the TempID (if there is one) as well as the EventID
              var tempID = ""
              if (result0[0].EventID == eventID) {
                if (result0[0].TempID =="" || result0[0].TempID == null) {
                  var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+eventID;
                }else{
                  var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+eventID+' or EventID='+result0[0].TempID
                }
              }else{
                var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+eventID+' or EventID='+result0[0].EventID
              }
   
              console.log(_sqlQ);
              

              //%%%%%%%%%%%%%%%%%%%%

              //var _sqlQ = "SELECT * FROM attendance WHERE EventID = '"+eventID+"'";
              connection.query(_sqlQ, function(err, results) {
                //connection.release();
                if(err) { console.log('Internal API error:  '+err); res.json(results); connection.end(); return; }
              
                connection.end();

                //TypeError: First argument must be a string or Buffer
                //res.end (results);

                //Returns a JSON file (was able to open up in notepad after browser asked what i wanteed to do with it)
                //res.send (results);
                
                //Returns a JSON file (was able to open up in notepad after browser asked what i wanteed to do with it)
                console.log("how many records "+results.length)
                for (var y=0; y < results.length; y++){
                  console.log(JSON.stringify(results[y]))
                  console.log ("new line")

                }
                res.json (results);
                
              });

          }
      })
    } 
  });
}

}

//###### ###### Sat Mar 10 11:44:28 PST 2018 new module for PRIVATE api calls to post Attendance data
////////////////////////////////////////////////////////////////////////////
//  API to POST Attendance data from PRIVATE callers 
//////////////////////////////////////////////////////////////////////////////
exports.postAttendanceRecords = function(req, res) {
  

  console.log ("here is the POST body "+JSON.stringify(req.body))
  var data1  = req.body.data
  data = JSON.parse(data1)
  var pass = req.body.pass
  var device = req.body.authCode
  

  // console.log("the password sent is "+pass)
  // console.log("the data sent is "+JSON.stringify(data))
  // console.log("the device sent is "+device)
  // console.log("the device sent is "+JSON.stringify(device))

  // // console.log("the elements . "+JSON.stringify(data[2]))
  // // console.log("the elements p "+JSON.stringify(data[2].BadgeID))
  // console.log("the elements ***************** "+ data[0].MobSSID)
  // console.log("the length ***************** "+ data.length)
  
  // // console.log("the nuimber of rows sent is "+data.length)


  //check the caller is authorized
  if (pass != "agpbrtdk") {
    res.status (400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
    res.send ('Error: Invalid API password') // This goes into tData and urlResponse
    // or res.status(400).json({error: 'message'})
    
  }else{

    db.createConnection(function(err,reslt){  
      if (err) {
        console.log('API Error: common connect : ' + err);
        callback(err, null);
      }else{
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;

        //Initialize counters to keep track of number of callbacks from the model and any errors
        var rowsToInsert = data.length
        var counter = 0
        var totalCounter = 0
        var errorCounter = 0
        
        //Loop through all the data records sent in the HTTP request body and post them to 
        //the verifyrecords table
        for (var j=0; j < data.length; j++) {
          
              var fields = data[j]
          
          //Process the update through the MODEL
          attendance.createAttendanceRecord(connection, fields, function(err,reslt){ 
            totalCounter++
            if (err) {
              console.log('API Error: Attendance post: ' + err);
              errorCounter++
              
            }else{
              counter++
              
            }
            //keep track of the total number of times we get callbacks from the model
            totalCounter = counter + errorCounter
            if (totalCounter == rowsToInsert){  

              if (errorCounter ==0){
                  //###### May 26 2018 - TODO This is where we should test for end of event and email
                //1. Go get the event associated with the attendance
                //2. If the event has a date and end time...
                //3. Test to see if event has ended
                //4. Then email the designated user [need to figure how this is established]

                res.status(200);
                res.send(counter+' records posted to commandCenter');

              }else{
                
                res.status(500);
                res.send('Error : only '+counter+' of '+totalCounter+' records posted');
                
              }      
              connection.end();                
            }
  

          })//end of send attendance MODEL call
        
        }



      }
      
      
    });
  } 
  
}

///////////////////////////////////////////////////////////////////////////
//  API to access attendance data from PUBLIC callers
//////////////////////////////////////////////////////////////////////////////
exports.apiGetAttendance = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  
  //Make sure the api call has a valid password
  console.log ("here is the body POST API "+JSON.stringify(req.body))
  var bodyStr = JSON.stringify(req.body)

  var body = JSON.parse(bodyStr)
  console.log ("here is the body "+body[0])
  var token = req.body.token;
  var eventID= req.body.eventID
  var eventName = req.body.eventName
  var attendDate = req.body.attendDate

  if (eventID != ""){
    var _sqlQ = "SELECT * FROM attendance WHERE EventID = '"+eventID+"'";
  }else if (eventName != ""){
    var _sqlQ = "SELECT * FROM attendance WHERE EventName = '"+eventName+"'";
  }else if (attendDate != ""){
    var _sqlQ = "SELECT * FROM attendance WHERE AttendDate = '"+attendDate+"'";
  }else{
    var _sqlQ = "SELECT * FROM attendance";
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

///////////////////////////////////////////////////////////////////////////
//  API to access attendance data from PUBLIC callers
//////////////////////////////////////////////////////////////////////////////
exports.apiGetForAttendee = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  
  //Make sure the api call has a valid password
  console.log ("here is the body POST API "+JSON.stringify(req.body))
  var bodyStr = JSON.stringify(req.body)

  var body = JSON.parse(bodyStr)
  console.log ("here is the body "+body[0])
  var token = req.body.token;
  var empID= req.body.empID
  var badgeNumber = req.body.badgeNumber
  var lastName = req.body.lastName
  var firstName = req.body.firstName

  if (empID != ""){
    var _sqlQ = "SELECT * FROM attendance WHERE EmpID = '"+empID+"'";
  }else if (badgeNumber != "" & badgeNumber !=""){
    var _sqlQ = "SELECT * FROM attendance WHERE iClassNumber = "+badgeNumber;
  }else if (lastName != "" & firstName !=""){
    var _sqlQ = "SELECT * FROM attendance WHERE LastName = '"+lastName+"'"+" AND FirstName = '"+firstName+"'";
  }else if (lastName != ""){
    var _sqlQ = "SELECT * FROM attendance WHERE LastName = '"+lastName+"'";
  }else if (firstName != ""){
    var _sqlQ = "SELECT * FROM attendance WHERE FirstName = '"+firstName+"'";
  }else{
    var _sqlQ = "SELECT * FROM attendance";
  }

  //decode the token to check it is valid
  try {
    var decoded = jwt.verify(token, "boris")
    console.log("Token from request "+token)
    
    //The token is valid and so ertireve the people data and return it to the erequester
    db.createConnection(function(err,reslt){  
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        res.status(500); res.send("Error connecting to the database"); connection.end(); return;
      }else{
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;

        console.log('The SQL : ' + _sqlQ);
        
        connection.query(_sqlQ, function(err, results) {
          //connection.release();
        if(err) { console.log('Internal API error:  '+err); res.status(400); res.send("Error querying the attendance table"); connection.end(); return; }
        
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

///////////////////////////////////////////////////////////////////////////
//  API to access attendance data from PUBLIC callers
//////////////////////////////////////////////////////////////////////////////
exports.apiMarkAttendance = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  
  //Make sure the api call has a valid password
  console.log ("here is the body POST API "+JSON.stringify(req.body))
  var bodyStr = JSON.stringify(req.body)

  var body = JSON.parse(bodyStr)
  console.log ("here is the body "+body[0])
  var token = req.body.token;
  var empID= req.body.empID
  var eventID = req.body.eventID
  

 
  if (empID != "" & eventID !=""){
    var _sqlQ = "SELECT * FROM attendance WHERE EventID = "+eventID+" AND EmpID = "+empID;
  }else{
    res.status(400); 
    res.send("EmpID and EventID cannot be blank!"); 
    connection.end();
    return; s
  }

  //decode the token to check it is valid
  try {
    var decoded = jwt.verify(token, "boris")
    console.log("Token from request "+token)
    
    //The token is valid and so ertireve the people data and return it to the erequester
    db.createConnection(function(err,reslt){  
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        res.status(500); res.send("Error connecting to the database"); connection.end(); return;
      }else{
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;

        console.log('The SQL : ' + _sqlQ);
        
        connection.query(_sqlQ, function(err, results) {
          //connection.release();
        if(err) { console.log('Internal API error:  '+err); res.status(400); res.send("Error querying the attendance table"); connection.end(); return; }
        
        if (results.length == 0){
          res.status(200)
          res.send(false)

        }else{
          res.status(200)
          res.send(true)
        }
        connection.end();
      
        });
      } 
    });

    } catch (err) {
      console.log('CCERROR, request unsuccessful:  '+err)
      res.status (401) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 400 returned from server
      res.send ('Unauthorised request') // When called from the App, this goes into tData and urlResponse
    }
 
}