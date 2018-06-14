//######
//###### ###### Sat Jan 6 11:43:28 PST 2018  New module for PRIVATE and PUBLIC API calls fro events data 
//###### 
var mysql = require('mysql');
var path = require( 'path' );
var db = require('../models/db');
var jwt = require('jsonwebtoken');
//###### ###### Sat Apr 11 11:44:28 PST 2018 new module for PRIVATE api calls to post Events data
var event = require('../models/events');



////////////////////////////////////////////////////////////////////////////
//  API to access Events data from PRIVATE callers 
//////////////////////////////////////////////////////////////////////////////
exports.getEvents = function(req, res) {
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


      var _sqlQ = "SELECT * FROM events";
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

//###### ###### Sat Mar 10 11:44:28 PST 2018 new module for PRIVATE api calls to post Events
//###### ###### Sat Apr 10 11:44:28 PST 2018 Corrected postAttendanceRecords to postEventRecords
////////////////////////////////////////////////////////////////////////////
//  API to POST Events from PRIVATE callers 
//////////////////////////////////////////////////////////////////////////////
exports.postEventRecords = function(req, res) {
  

  console.log ("here is the POST body "+JSON.stringify(req.body))
  var data1  = req.body.data
  data = JSON.parse(data1)
  var pass = req.body.pass
  var device = req.body.authCode
  


  // console.log("the elements . "+JSON.stringify(data[2]))
  // console.log("the elements p "+JSON.stringify(data[2].BadgeID))
  // console.log("the elements p "+ data[2].BadgeID)
  // console.log("the nuimber of rows sent is "+data.length)


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
          event.createEventRecord(connection, fields, function(err,reslt){ 
            totalCounter++
            if (err) {
              console.log('API Error: Events post: ' + err);
              errorCounter++
              
            }else{
              counter++
              
            }
            //keep track of the total number of times we get callbacks from the model
            totalCounter = counter + errorCounter
            if (totalCounter == rowsToInsert){  

              if (errorCounter ==0){

                res.status(200);
                res.send(counter+' Eventsrecords posted to commandCenter');

              }else{
                
                res.status(500);
                res.send('Error : only '+counter+' of '+totalCounter+' Event records posted');
                
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
//  API to access Events data from PUBLIC callers
//////////////////////////////////////////////////////////////////////////////
exports.apiGetEvents = function(req, res) {
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
  var eventStartDate = req.body.eventStartDate
  var eventEndDate = req.body.eventEndDate
  


  //2017-12-04 00:30:00 ---  is the database format.  Appending begin and end of day hh:mm:ss.
  if (eventID != ""){
        var _sqlQ = "SELECT * FROM events WHERE EventID = "+eventID;
    }else if (eventName != ""){
        var _sqlQ = "SELECT * FROM events WHERE EventName = '"+eventName+"'";
    }else if (eventStartDate != "" && eventEndDate == ""){
        var startSearchDate = eventStartDate+" 00:00:00"  
        var endSearchDate = eventStartDate+" 23:59:59"  
        var _sqlQ = "SELECT * FROM events WHERE EventDateTime >= '"+startSearchDate+"'"+" AND EventDateTime <= '"+endSearchDate+"'";
    }else if (eventStartDate != "" && eventEndDate != ""){  
        var startSearchDate = eventStartDate+" 00:00:00"  
        var endSearchDate = eventEndDate+" 23:59:59"  
        var _sqlQ = "SELECT * FROM events WHERE EventDateTime >= '"+startSearchDate+"'"+" AND EventDateTime <= '"+endSearchDate+"'";
    }else{
        var _sqlQ = "SELECT * FROM events";
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
//  API to create an Event from PUBLIC callers
///////////////////////////////////////////////////////////////////////////

exports.apiCreateEvent = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  

  //Make sure the api call has a valid password
  console.log ("here is the body POST API "+JSON.stringify(req.body))
  var bodyStr = JSON.stringify(req.body)
  var body = JSON.parse(bodyStr)
  console.log ("here is the body "+body[0])

 // +-------------------+--------------+------+-----+---------+----------------+
 // | Field             | Type         | Null | Key | Default | Extra          |
 // +-------------------+--------------+------+-----+---------+----------------+
 // | EventID           | int(11)      | NO   | PRI | NULL    | auto_increment |
 // | EventName         | varchar(40)  | NO   |     | NULL    |                |
 // | EventDateTime     | varchar(25)  | NO   |     | NULL    |                |
 // | EventLocationName | varchar(40)  | NO   |     | NULL    |                |
 // | EventSponsorName  | varchar(40)  | NO   |     | NULL    |                |
 // | DurationInMins    | varchar(5)   | NO   |     | NULL    |                |
 // | Latitude          | varchar(20)  | YES  |     | NULL    |                |
 // | Longitude         | varchar(20)  | YES  |     | NULL    |                |
 // | RecordStatus      | varchar(10)  | NO   |     | NULL    |                |
 // | Comments          | varchar(256) | NO   |     | NULL    |                |
 // | updateTime        | varchar(60)  | YES  |     | NULL    |                |
 // | EventsType        | varchar(20)  | NO   |     | NULL    |                |
 // | InvitationListID  | int(11)      | NO   |     | NULL    |                |
 // | TempID            | varchar(20)  | YES  |     | NULL    |                |
 // +-------------------+--------------+------+-----+---------+----------------+


  var token = req.body.token;
  var eventName = req.body.eventName
  var eventDateTime = req.body.eventDateTime
  var eventLocationName = req.body.eventLocationName
  var eventSponsorName = req.body.eventSponsorName
  var durationInMinutes = req.body.durationInMinutes
  var comments = req.body.comments
  var eventsType = req.body.eventsType
  var invitationListID = req.body.invitationListID

  //listName parameter is required
  if(eventName == "") { console.log("API error, incomplete request"); res.status(400); res.send("Event Name is Blank"); return }
  if(eventDateTime == "") { console.log("API error, incomplete request"); res.status(400); res.send("Event Date/Time is Blank"); return }
  if((invitationListID) == "") { console.log("API error, incomplete request"); res.status(400); res.send("Invitation List ID must be 0, if no list is to be associated"); return }
  if (/[a-zA-Z]/.test(invitationListID)) { console.log("API error, incomplete request"); res.status(400); res.send("Invitation List ID must be numeric"); return };
  //decode the token to check it is valid
  try {
    var decoded = jwt.verify(token, "boris")
    console.log("Token from request "+token)
    
    //The token is valid and so create the event
    db.createConnection(function(err,reslt){  
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        //callback(err, null);
      }else{
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;      
  
        var buildEventQuery = (function() {
                    var insertEvent = function(field1, field2, field3, field4, field5,field6,field7, field8) {
            
                    var _eventName = field1;
                    var _dateTime = field2;
                    var _locationName = field3;
                    var _sponsorName = field4;
                    var _duration = field5;
                    var _latitude= "";
                    var _longitude= "";
                    var _recordStatus="API";
                    var _comments =field6;
                    var _eventsType=field7;
                    var _invitationListID =field8;
                    var _tempID ="";
           
                    var _d = new Date();
                    var _t = _d.getTime(); 
                    var _updateTime = _t;
                    
                    var _qFields = '(EventName, EventDateTime, EventLocationName, EventSponsorName, DurationInMins, Latitude, Longitude, RecordStatus, Comments, updateTime, EventsType, InvitationListID)';
                    var _qValues = '("'+_eventName+'", "'+_dateTime+'", "'+_locationName+'", "'+_sponsorName+'", "'+_duration+'", "'+_latitude+'", "'+_longitude+'", "'+_recordStatus+'", "'+_comments+'", "'+_updateTime+'", "'+_eventsType+'", '+_invitationListID+')';                                                      
                    var _qUpdates = 'EventName="'+_eventName+'", EventDateTime="'+_dateTime+'"'+', EventLocationName="'+_locationName+'"'+', EventSponsorName="'+_sponsorName+'"'+', DurationInMins="'+_duration+'"'+', Latitude="'+_latitude+'"'+', Longitude="'+_longitude+'"'+', RecordStatus="'+_recordStatus+'"'+', Comments="'+_comments+'"'+', updateTime="'+_updateTime+'"'+', EventsType="'+_eventsType+'", InvitationListID='+_invitationListID;
                    var parmQuery3 = 'INSERT INTO events '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
                    //console.log('parmQuery3= '+parmQuery3);
                    return parmQuery3;
                 };
                 return {insertEvent : insertEvent};
                })();//feb--end of revealing module
          
  
                var strSQL = buildEventQuery.insertEvent(eventName, eventDateTime, eventLocationName, eventSponsorName, durationInMinutes, comments, eventsType, invitationListID);
                console.log('POST strSQL= '+ strSQL);  
                var query = connection.query(strSQL, function(err, result) {
                  
                   if (err) {
                      console.log(err)
                      sess.error = 'There was a problem updating the mobss database: '+err;
                      connection.end();
                      res.status (500) 
                      res.send ("There was a problem creating the event! "+err) 
                   }else{                   
                      console.log('INSERT  ID????'+result.insertId);
                      var eventID =  result.insertId;
                      connection.end();
                      res.status(200)
                      //res.send ("EventID: "+eventID) 
                      res.json (eventID);
                      
                    }
                });//feb--end of connection.query
          }
      



























        
    
    });

    } catch (err) {
      console.log('CCERROR, request unsuccessful:  '+err)
      res.status (401) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 400 returned from server
      res.send ('Unauthorised request') // When called from the App, this goes into tData and urlResponse
    }
 
}
