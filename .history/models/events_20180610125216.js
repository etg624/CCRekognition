//###### Sat Mar 10 11:36:54 EST 2018 - New handler to support API
//Attendance records were previously posted from the app through mobss_scripts.lc from syncToServer 

var datetime = require('../controllers/datetime');
var mysql    = require('mysql');
var db = require('./db');

//###### Sat Apr 19 11:36:54 EST 2018 - Note: EventsType server but EventType comes from App
//###### Sat Apr 26 11:36:54 EST 2018 -Lat Lng default to 0

///////////////////////////////////////////////////////////////////////////
//  Create an Event record
///////////////////////////////////////////////////////////////////////////

exports.createEventRecord = function(connection, data, callback) {
 
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

  
        var buildEventQuery = (function() {
                    var insertEvent = function(fields) {
            
                    var _eventName = fields.EventName;
                    var _dateTime = fields.EventDateTime;
                    var _locationName = fields.EventLocationName;
                    var _sponsorName = fields.EventSponsorName;
                    var _duration = fields.DurationInMins;
                    var _latitude= 0;
                    var _longitude= 0;
                    var _recordStatus=fields.RecordStatus;
                    var _comments =fields.Comments;
                    var _eventsType=fields.EventType; //changed this after sys tst
                    
                    var _invitationListID =fields.InvitationListID;
                    var _tempID =fields.EventID;
           
                    var _d = new Date();
                    var _t = _d.getTime(); 
                    var _updateTime = _t;
                    
                    var _qFields = '(EventName, EventDateTime, EventLocationName, EventSponsorName, DurationInMins, Latitude, Longitude, RecordStatus, Comments, updateTime, EventsType, InvitationListID, TempID)';
                    var _qValues = '("'+_eventName+'", "'+_dateTime+'", "'+_locationName+'", "'+_sponsorName+'", "'+_duration+'", "'+_latitude+'", "'+_longitude+'", "'+_recordStatus+'", "'+_comments+'", "'+_updateTime+'", "'+_eventsType+'", '+_invitationListID+', "'+_tempID+'")';                                                      
                    var _qUpdates = 'EventName="'+_eventName+'", EventDateTime="'+_dateTime+'"'+', EventLocationName="'+_locationName+'"'+', EventSponsorName="'+_sponsorName+'"'+', DurationInMins="'+_duration+'"'+', Latitude="'+_latitude+'"'+', Longitude="'+_longitude+'"'+', RecordStatus="'+_recordStatus+'"'+', Comments="'+_comments+'"'+', updateTime="'+_updateTime+'"'+', EventsType="'+_eventsType+'", InvitationListID='+_invitationListID+', TempID="'+_tempID+'"';
                    var parmQuery3 = 'INSERT INTO events '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
                    //console.log('parmQuery3= '+parmQuery3);
                    return parmQuery3;
                 };
                 return {insertEvent : insertEvent};
                })();//feb--end of revealing module
          
  
                var strSQL = buildEventQuery.insertEvent(data);
                console.log('POST strSQL= '+ strSQL);  
                var query = connection.query(strSQL, function(err, result) {
                  
                  if (err) {
                    console.log("Event creation error :" +err)
                    //immediate exit with error
                    callback(err, null);
                  } else {    
                    console.log("Insert successful for ONE record")
                    callback(null, result);
                    
                  }
                });//feb--end of connection.query
        
}


//###### Sun Jun 10 09:51:51 PDT 2018 Support for Event End monitoring
///////////////////////////////////////////////////////////////////////////
//  Create an Event record
///////////////////////////////////////////////////////////////////////////

exports.getAllEventsEndedSinceLastSweep = function(connection, callback) {
  
  var currentDateTime = datetime.syncCurrentDateTimeforDB()
  var strSQL = "Select * from events where EventDateTime <= '"+currentDateTime+"' AND EventEndProcessed !='YES'"
  //
  console.log('Event End strSQL= '+ strSQL); 
  //
  var query = connection.query(strSQL, function(err, result) {
    
    if (err) {
      console.log("Event End retrieval error :" +err)
      callback(err, null);
    } else {    
      callback(null, result);
    }

  });
         
}



