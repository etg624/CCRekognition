//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var db = require('../models/db');
var writeReport = require('./writeReport');
//###### Tue Feb 28 08:29:13 PDT 2017
var emailController = require('../controllers/emailController');
//###### Tue Apr 28 08:29:13 PDT 2017
var ioResultFormatting = require('../controllers/ioResultFormatting');
//###### Mon Jul 2 10:56:11 PDT 2018
var attendance = require('../models/attendance');



/////////////////////////////////////////////////////////////////////
//  Display events before today
/////////////////////////////////////////////////////////////////////

module.exports.eventsHome = function(req, res) {
	sess=req.session;
  // initializes the success/error messages for the report generation
  // ..so that messages are removed after leaving and re-entering the attendance ascreen
  sess.rptSuccess=null;
  sess.rptError=null;

     // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

        //feb--connect to the database, performa query to get all rows from people and send that data to 
        //--to be rendered as a table in Jade
        //feb- we have user entry at this point and so setting up the credentials here
       //get a connection using the common handler in models/db.js
        db.createConnection(function(err,connectionID){  
            if (err) {
              callback(err, null);
            }else{
              //process the i/o after successful connect.  Connection object returned in callback
              var connection = connectionID;
             
              //###### Tue Oct 17 08:29:13 PDT 2017
              //###### If the User type is 4 (Event Control only), only show those events where the sponsor of the event is same as user name
              console.log('sess.userType = '+sess.userType);
              console.log('sess.userName = '+sess.userName);

              // IF THE USER IS TYPE 4 (EVENT CONTROL)
              if (sess.userType == '4'){
                var _sqlQ = "SELECT * FROM events where EventDateTime < NOW() AND EventsType !='mustering' AND EventSponsorName='"+sess.userName+"'"+" ORDER BY EventDateTime DESC";
              
              }else{
              // Every other user
                var _sqlQ = "SELECT * FROM events where EventDateTime < NOW() AND EventsType !='mustering' ORDER BY EventDateTime DESC";
              }
              //######
              console.log(_sqlQ)

              connection.query(_sqlQ, function(err, allPastEvents) {

                if(err) { console.log('event query bad'+err); connection.end(); callback(true); return; }

                attendance.addAttendanceCountToEventList(connection, allPastEvents, function(err,eventListWithAttendance){  

                  if(err) { console.log('Event list: attendance query bad'+err); connection.end(); callback(true); return; }
    
                        connection.end()
                        
                        res.render('events', { title: 'Command Center - Events', username: req.session.username, eventListWithAttendance });
              
              })
              });
            }
        });
    }
};


/////////////////////////////////////////////////////////////////////
//  Display the list of the upcoming events (includes today's events)
/////////////////////////////////////////////////////////////////////

module.exports.eventsUpComing = function(req, res) {
  sess=req.session;
  // initializes the success/error messages for the report generation
  // ..so that messages are removed after leaving and re-entering the attendance ascreen
  sess.rptSuccess=null;
  sess.rptError=null;

     // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

        //feb--connect to the database, performa query to get all rows from people and send that data to 
        //--to be rendered as a table in Jade
        //feb- we have user entry at this point and so setting up the credentials here
       //get a connection using the common handler in models/db.js
      db.createConnection(function(err,connectionID){  
          if (err) {
            callback(err, null);
          }else{
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = connectionID;

            //###### Tue Oct 17 08:29:13 PDT 2017
              //###### If the User type is 4 (Event Control only), only show those events where the sponsor of the event is same as user name
              console.log('sess.userType = '+sess.userType);
              console.log('sess.userName = '+sess.userName);

              // IF THE USER IS TYPE 4 (EVENT CONTROL)
              if (sess.userType == '4'){
              var _sqlQ = "SELECT * FROM events where EventDateTime >= CURDATE() AND EventsType !='mustering' AND EventSponsorName='"+sess.userName+"'"+" ORDER BY EventDateTime DESC";
              }else{
              // Every other user
              var _sqlQ = "SELECT * FROM events where EventDateTime >= CURDATE() AND EventsType !='mustering' ORDER BY EventDateTime DESC";
            }
              //######
              //console.log(_sqlQ)
            connection.query(_sqlQ, function(err, allFutureEvents) {
           
             if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
              
            connection.end();
            res.render('eventsUpcoming', { title: 'Command Center - Upcoming Events', username: req.session.username, results:allFutureEvents });
            });
          }
      });  

        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};

/////////////////////////////////////////////////////////////////////
//  Display the event Add page
/////////////////////////////////////////////////////////////////////
exports.eventAdd = function(req, res) {
  sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {
    
  //###### Sat Dec 9 12:59:24 PST 2017  Add  flg to condition whether the user sees EventType or not
    var name = req.query.name;
    var eventType = ""
    var eventTypeEnabled = process.env.EVENTTYPE_ENABLED
    
    res.render('eventAdd', { title: 'Command Center', eventType, eventTypeEnabled });
 };
};


/////////////////////////////////////////////////////////////////////
//  Post an event to the database
/////////////////////////////////////////////////////////////////////
//###### Sun Apr 22 13:13:39 PDT 2018 lat lng default to 0
exports.eventPostDatabase = function(req,res) {

//get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          var buildEventQuery = (function() {
                      var insertEvent = function(field1, field2, field3, field4, field5,field6,field7) {
              
                      var _eventName = field1;
                      var _dateTime = field2;
                      var _locationName = field3;
                      var _sponsorName = field4;
                      var _duration = field5;
                      var _latitude= 0.000000;
                      var _longitude= 0.000000;
                      var _recordStatus=null;
                      var _invitationListID =0;

                      var _comments = field6;
                      //var _updateTime = new Date();
                      var _d = new Date();
                      var _t = _d.getTime(); 
                      var _updateTime = _t;
                      var _eventsType = field7;
                      console.log('here is updateTIme  '+_updateTime);
                      
                      var _qFields = '(EventName, EventDateTime, EventLocationName, EventSponsorName, DurationInMins, Latitude, Longitude, RecordStatus, Comments, updateTime, EventsType, InvitationListID)';
                      var _qValues = '("'+_eventName+'", "'+_dateTime+'", "'+_locationName+'", "'+_sponsorName+'", "'+_duration+'", "'+_latitude+'", "'+_longitude+'", "'+_recordStatus+'", "'+_comments+'", "'+_updateTime+'", "'+_eventsType+'", '+_invitationListID+')';                                                      
                      var _qUpdates = 'EventName="'+_eventName+'", EventDateTime="'+_dateTime+'"'+', EventLocationName="'+_locationName+'"'+', EventSponsorName="'+_sponsorName+'"'+', DurationInMins="'+_duration+'"'+', Latitude="'+_latitude+'"'+', Longitude="'+_longitude+'"'+', RecordStatus="'+_recordStatus+'"'+', Comments="'+_comments+'"'+', updateTime="'+_updateTime+'"'+', EventsType="'+_eventsType+'", InvitationListID='+_invitationListID;
                      var parmQuery3 = 'INSERT INTO events '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
                      //console.log('parmQuery3= '+parmQuery3);
                      return parmQuery3;
               };
               return {insertEvent : insertEvent};
              })();//feb--end of revealing module

              var _eventDateTime = req.body.eventDate + ' ' + req.body.eventTime;
              //var _eventDateTime = datetime.syncFormatDateStringForDB(eventDateTime);
              console.log('here is the date   '+req.body.eventDate);
              console.log('here is the time  '+req.body.eventTime);
              console.log('here is the EVENTDATETIME  '+_eventDateTime);


              //feb--set the duration field in minutes based on the user input
              var _durationInMinutes = '';
              if (req.body.duration == '30 minutes'){
                _durationInMinutes = '30';
                }else if (req.body.duration == '1 hour'){
                    _durationInMinutes = '60';
                    }else if (req.body.duration == '90 minutes'){
                        _durationInMinutes = '90';
                        }else if (req.body.duration == '2 hours'){
                             _durationInMinutes = '120';
                                }else if (req.body.duration == '3 hours'){
                                  _durationInMinutes = '180';
                                  }else if (req.body.duration == '4 hours'){
                                    _durationInMinutes = '240';
                                  }else {_durationInMinutes = '1440'}

              console.log('duration in minutes ' + _durationInMinutes);
              
              //###### Tue Oct 17 08:29:13 PDT 2017
              //If the usert type is 4, default the user name into the sponsor field
              var _eventSponsorName = '';
              if (sess.userType == '4'){
                _eventSponsorName = sess.userName
              }else{
                _eventSponsorName = req.body.eventSponsorName
              }

              var strSQL = buildEventQuery.insertEvent(req.body.eventName, _eventDateTime, req.body.eventLocationName, _eventSponsorName, _durationInMinutes, req.body.comments, req.body.eventType);
              console.log('POST strSQL= '+ strSQL);  
              var query = connection.query(strSQL, function(err, result) {
                
                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.render('eventAdd', { title: 'Command Center 360'});
                  } else {
                    //console.log(err);
                    console.log('INSERT  ID????'+result.insertId);

                    var eventID =  result.insertId;
                    connection.end();
                    res.status(301).redirect('/inviteListsAdd/'+eventID);
                    //res.render('inviteLists', { title: 'Command Center', eventID : lastInsertID});
                  }
              });//feb--end of connection.query
        }
    });

}; //feb--end of post handler



////////////////////////////////////////////////
// Get an event for edit 
////////////////////////////////////////////////
module.exports.eventGetOne = function(req,res) {

 sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

  //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          console.log('eventId param '+req.params.eventID);
          var strSQL = 'SELECT * FROM events WHERE EventID='+req.params.eventID;
          console.log('here is the query string' + strSQL);
          //console.log('strSQL= '+ strSQL);  
          var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    connection.end();
                    //sess.error = 'There was a problem updating the mobss database: '+err;
                    res.render('events', { title: 'Command Center 360'});
                  } else {
                    console.log('here is the event name ' + result[0].EventName);
                    console.log('here are the comments ' + result[0].Comments);
                    console.log('pre disp date is as follows : ' + result[0].EventDateTime);
                    console.log('pre disp time is as follows : ' + result[0].EventDateTime);
                    var displayDate = datetime.syncGetDateOnlyInDisplayFormat(result[0].EventDateTime);
                    var displayTime = datetime.syncGetTimeInDisplayFormat(result[0].EventDateTime);
                    
                    // ###### Sat Dec 10 14:05:25 PST 2017 -- Event Type enabled/disabled flag
                    var eventTypeEnabled = process.env.EVENTTYPE_ENABLED
                    
                    //get the invite ListName for display
                    var inviteListName = '';
                    console.log('here is the value of the invite list ID '+result[0].InvitationListID);
                    if (result[0].InvitationListID > 0) {
                    var strSQL2 = 'SELECT ListName FROM InviteList WHERE InvitationListID='+result[0].InvitationListID;
                              
                              var query = connection.query(strSQL2, function(err, result2, calllback) {

                                     if (err) {
                                        inviteListName = 'No name found for this invite list';
                                       
                                      } else {
                                        console.log('return values '+result2.ListName+' '+result2[0].ListName);
                                        inviteListName = result2[0].ListName;
                                        console.log('display date is as follows : ' + displayDate);
                                        console.log('display time is as follows : ' + displayTime);
                                        connection.end();
                                        console.log('LIST NAME '+inviteListName);
                                        res.render('eventModify', { title: 'Command Center 360 - events', result, displayDate : displayDate, displayTime : displayTime, inviteListName : inviteListName, eventTypeEnabled });
                                      }
                              });
                    }else{
                      //0 value means no invite list has been attached yet
                      inviteListName = 'No invite list for this event'
                      console.log('display date is as follows : ' + displayDate);
                      console.log('display time is as follows : ' + displayTime);
                      connection.end();
                      console.log('LIST NAME '+inviteListName);
                      res.render('eventModify', { title: 'Command Center 360 - events', result, displayDate : displayDate, displayTime : displayTime, inviteListName : inviteListName, eventTypeEnabled });

                    }
  

                    
                };
                });//feb--end of connection.query
        }
    });
};
}; // end of handler


////////////////////////////////////////////////
// update the database with the modifications //
////////////////////////////////////////////////
//###### Sun Apr 22 13:13:39 PDT 2018 lat lng default to 0

exports.eventUpdateOne = function(req, res) {
  sess=req.session;
    var name = req.query.name;

 //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var buildEventQuery = (function() {
                    var updateEvent = function(field1, field2, field3, field4, field5,field6,field7,field8) {
    
                      var _eventName = field1;
                      var _dateTime = field2;
                      var _locationName = field3;
                      var _sponsorName = field4;
                      var _duration = field5;
                      var _latitude= 0.000000;
                      var _longitude= 0.000000;
                      var _recordStatus=null;

                      var _comments = field6;
                      //var _updateTime = new Date();
                      var _d = new Date();
                      var _t = _d.getTime(); 
                      var _updateTime = _t;
                      var _eventsType = field7;
                      var _eventID = field8;
                      console.log('here is updateTIme  '+_updateTime);
                      
                      var _qFields = '(EventName, EventDateTime, EventLocationName, EventSponsorName, DurationInMins, Latitude, Longitude, RecordStatus, Comments, updateTime, EventsType)';
                      var _qValues = '("'+_eventName+'", "'+_dateTime+'", "'+_locationName+'", "'+_sponsorName+'", "'+_duration+'", "'+_latitude+'", "'+_longitude+'", "'+_recordStatus+'", "'+_comments+'", "'+_updateTime+'", "'+_eventsType+'")';                                                      
                      var _qUpdates = 'EventName="'+_eventName+'", EventDateTime="'+_dateTime+'"'+', EventLocationName="'+_locationName+'"'+', EventSponsorName="'+_sponsorName+'"'+', DurationInMins="'+_duration+'"'+', Latitude="'+_latitude+'"'+', Longitude="'+_longitude+'"'+', RecordStatus="'+_recordStatus+'"'+', Comments="'+_comments+'"'+', updateTime="'+_updateTime+'"'+', EventsType="'+_eventsType+'"';
                      var parmQuery3 = 'UPDATE events SET '+_qUpdates+' WHERE EventID='+_eventID;
                      //console.log('parmQuery3= '+parmQuery3);
                      return parmQuery3;
               };
               return {updateEvent : updateEvent};
              })();//feb--end of revealing module

 
              var _eventDateTime = req.body.eventDate + ' ' + req.body.eventTime;
              //var _eventDateTime = datetime.syncFormatDateStringForDB(eventDateTime);

              //feb--set the duration field in minutes based on the user input
              var _durationInMinutes = '';
              if (req.body.duration == '30 minutes'){
                _durationInMinutes = '30';
                }else if (req.body.duration == '1 hour'){
                    _durationInMinutes = '60';
                    }else if (req.body.duration == '90 minutes'){
                        _durationInMinutes = '90';
                        }else if (req.body.duration == '2 hours'){
                             _durationInMinutes = '120';
                                }else if (req.body.duration == '3 hours'){
                                  _durationInMinutes = '180';
                                  }else if (req.body.duration == '4 hours'){
                                    _durationInMinutes = '240';
                                  }else {_durationInMinutes = '1440'}

              console.log('duration in minutes ' + _durationInMinutes);

              //###### Tue Oct 17 08:29:13 PDT 2017
              //If the usert type is 4, default the user name into the sponsor field
              var _eventSponsorName = '';
              if (sess.userType == '4'){
                _eventSponsorName = sess.userName
              }else{
                _eventSponsorName = req.body.eventSponsorName
              }
              
              //###### Tue Dec 10 08:29:13 PDT 2017 -- Use screen entry if event type enabled, otherwise blank
              var _eventTypeUpdate = ""
              if (process.env.EVENTTYPE_ENABLED == "YES"){
                _eventTypeUpdate =  req.body.eventType
              }
              var strSQL = buildEventQuery.updateEvent(req.body.eventName, _eventDateTime, req.body.eventLocationName, _eventSponsorName, _durationInMinutes, req.body.comments, _eventTypeUpdate, req.params.eventID);
              console.log('update strSQL= '+ strSQL);  

              var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.render('eventAdd', { title: 'Command Center 360'});
                  } else {
                    //console.log(err)
                            var invitationListID = '';
                            var strSQL1 =  "SELECT InvitationListID from events where EventID="+req.params.eventID;
                              connection.query(strSQL1, function(err, rows) {
                                   if (err) {
                                    //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
                                    
                                      console.log('results of quert'+JSON.stringify(rows));
                                      
                                      }else{
                                          invitationListID = rows[0].InvitationListID === 0 ? 'No invite list' : rows[0].InvitationListID;
                                           
                                    
                                          //res.status(301).redirect('/inviteListsChange/'+req.params.eventID+'/'+req.body.eventName+'/'+invitationListID);
                                      }
                                    //REgardless of result of InvitationListID lookup, we are heading for the list change screen
                                    connection.end();
                                    res.status(301).redirect('/inviteListsChange/'+req.params.eventID+'/'+req.body.eventName+'/'+invitationListID);

                                    });

                    //res.status(301).redirect('/inviteListsChange/'+req.params.eventID+'/'+req.body.eventName+'/'+invitationListID);
                };
                });//feb--end of connection.query
        }
    });
   // res.render('/events', { title: 'Command Center 360 - Event List'});
};


/////////////////////////////////////////////////////////////////////
// Add an invite list to an event
/////////////////////////////////////////////////////////////////////

exports.eventAddInviteList = function(req, res) {
  sess=req.session;
    var name = req.query.name;
  console.log('here are the PARAMS for the UPDATE '+req.params.eventID+' '+req.params.InvitationListID);

 //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          /**
           * When an event is added with no invite list, the app complans
           * it is not getting enough felds (12 instead of 13), and the server
           * side db shows NULL in a different way than the other fields
           *
           */
            var _invitationListID = 0;
            console.log('the parm '+JSON.stringify(req.params.InvitationListID))
            if (req.params.InvitationListID ==" " || req.params.InvitationListID ==undefined){_invitationListID = 0}else{_invitationListID = req.params.InvitationListID}

              var strSQL = 'UPDATE events SET InvitationListID='+_invitationListID+' WHERE eventID='+req.params.eventID;
              console.log('update INVITELIST ID strSQL= '+ strSQL);  

              var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.redirect('/eventsUpcoming');
                  } else {
                    //console.log(err);
                    connection.end();
                    sess.success = 'New invitation list attached for this event'; 
                    res.redirect('/eventsUpcoming');
                };
                });//feb--end of connection.query
        }
    });
   // res.render('/events', { title: 'Command Center 360 - Event List'});
};

/////////////////////////////////////////////////////////////////////
//  Change the invite list asssociated with an event
/////////////////////////////////////////////////////////////////////

exports.eventChangeInviteList = function(req, res) {
  sess=req.session;
    var name = req.query.name;
  console.log('here are the PARAMS for the UPDATE '+req.params.eventID+' '+req.params.InvitationListID);

 //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          
            var _invitationListID = 0;
            if (req.params.InvitationListID ==" " || req.params.InvitationListID ==undefined){_invitationListID = 0}else{_invitationListID = req.params.InvitationListID}

              var strSQL = 'UPDATE events SET InvitationListID='+_invitationListID+' WHERE eventID='+req.params.eventID;
             // var strSQL = 'UPDATE events SET InvitationListID='+req.params.InvitationListID+' WHERE eventID='+req.params.eventID;
              console.log('update INVITELIST ID strSQL= '+ strSQL);  

              var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.redirect('/eventsUpcoming');
                  } else {
                    //console.log(err);
                    connection.end();
                    res.redirect('/eventsUpcoming');
                };
                });//feb--end of connection.query
        }
    });
   // res.render('/events', { title: 'Command Center 360 - Event List'});
};

/////////////////////////////////////////////////////////////////////
//  handler displaying the attendance records for a particular event
/////////////////////////////////////////////////////////////////////
//###### Wed Apr 28 18:27:05 PDT 2018 Common module for date reformat and sorting 


module.exports.eventAttendance = function(req, res) {
  sess=req.session;
  //###### Sun Oct 29 09:56:19 PDT 2017  Reset the screen error messages
  
 
  // don't let nameless people view the dashboard, redirect them back to the homepage
  if (typeof sess.username == 'undefined') res.redirect('/');
  else {

            //connect to the database, perform query to get all rows from people and send that data to 
            //to be rendered as a table in Jade
            //get a connection using the common handler in models/db.js
        db.createConnection(function(err,reslt){  
            if (err) {
             
              callback(err, null);
            }else{
              //process the i/o after successful connect.  Connection object returned in callback
              var connection = reslt;
              console.log('here is the connnection '+reslt.threadId);

              
              var _sqlQ0 = 'SELECT TempID FROM events WHERE EventID='+req.params.eventID;
              console.log(_sqlQ0);
              connection.query(_sqlQ0, function(err, result0) {
              
                //###### Wed Oct 4 18:23:41 PDT 2017  AS well as the rgular attendance records, get the attendance records sent to the server that were taken for a device-generated event
                //before that event was sent up to the server and received another, server generated, ID.  The original EventID of the device-gen
                //event is stored in a new field in the events table, TempID
                    if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
                      
                    //###### Wed Oct 4 18:27:05 PDT 2017  Need to make robust.  what if NULL, what if a records not found for the event, etc.
                    //###### Sat Oct 28 18:17:55 CDT 2017 Send the Temp Device ID to the Screen, then use it later to
                    //to ensure we get attendance reports for both EventID and TempID
                    //###### Sat Apr 19 18:17:55 CDT 2018 descending order for the attendance list
                    var eventTempID =  "CommandCenter-created event"
                    if (result0[0].TempID =="" || result0[0].TempID == null) {
                      var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+req.params.eventID +' ORDER BY InTIme DESC';
                    }else{
                      var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+req.params.eventID+' or EventID="'+result0[0].TempID+'"'+' ORDER BY InTIme DESC'
                      eventTempID="Device-created event #"+result0[0].TempID
                    }
                    console.log(_sqlQ);
                    connection.query(_sqlQ, function(err, results) {
                      //connection.release();
                      if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }

                      var eventID = req.params.eventID;
                      var eventName = "";
                      if(results.length > 0){
                        var eventName = results[0].EventName;
                      }


                      
                      //+++++++++++++++
                      //###### Sat Apr 19 18:17:55 CDT 2018 Give a descriptive name to the checkintype
                      for (var j=0; j < results.length; j++) {                        
                          
                          if (results[j].CheckInType=="1") {
                            //Append the Results JSON array with the musterpointID                           
                              results[j].CheckInTypeDesc = "Credential"
                              
                          } else if (results[j].CheckInType=="2") {
                            results[j].CheckInTypeDesc = "Manual"

                          } else if (results[j].CheckInType=="3") {
                            results[j].CheckInTypeDesc = "SMS"
                          
                          }
                      }
                      //++++++++++++++++

                      //###### Sat Apr 27 18:17:55 CDT 2018 Get the date into sortable format from the h:mm am/pam format
                      results = ioResultFormatting.reformatTimes(results)
                      //console.log("MY REFORMAT Fn "+JSON.stringify(results))
                                            
                      results = ioResultFormatting.resortByTime(results)
                      //console.log("MY SORT Fn "+JSON.stringify(results))

                      //++++++++++++++

                      //++++++++++++++++++++++++++
                      //###### Sat Apr 26 18:17:55 CDT 2018 Get the descriptive name for the device

                      var _sqlQ1d = 'SELECT * from DeviceHeader';
                      connection.query(_sqlQ1d, function(err, resultsD) {

                        if (err){
                          //just log the error display the results we have
                          console.log("device name get error "+err)
                          connection.end();                      
                          res.render('eventAttendance', { title: 'Command Center', results : results, eventID : eventID, eventName : eventName, eventTempID : eventTempID});
                          
                        }else{

                          for (var i=0; i < results.length; i++) {
                            
                            for (var j=0; j < resultsD.length; j++) {
                 
                              if (results[i].DeviceAuthCode==resultsD[j].AuthCode) {
                                //Append the Results JSON array    
                                if (resultsD[j].name=="" || resultsD[j].name==null ){
                                  results[i].DeviceAuthCodeDesc = results[i].DeviceAuthCode
                                  
                                }else{
                                  results[i].DeviceAuthCodeDesc = resultsD[j].name
                                
                                }                        
                                
                              }
                            
                            }
                          }
                          connection.end();                      
                          res.render('eventAttendance', { title: 'Command Center', results : results, eventID : eventID, eventName : eventName, eventTempID : eventTempID});
                      
                        }  
                      })

                  //++++++++++++++++++++++++++

                     
                      // connection.end();                      
                      // res.render('eventAttendance', { title: 'Command Center', results : results, eventID : eventID, eventName : eventName, eventTempID : eventTempID});
                    });

            
              })// new get for TempID    
              
        }
    });
  }
};


/////////////////////////////////////////////////////////////////////
//  Report the attendance records for a particular event
/////////////////////////////////////////////////////////////////////

exports.writeAttendanceRpt = function(req, res) {
  console.error('im in the write handler: '+ JSON.stringify(req.body));
  sess=req.session;
  var eventID = req.params.eventID;
//###### Sat Oct 28 18:24:30 CDT 2017 Send the TempID too.  Added a parm to the writeReport call
 
db.createConnection(function(err,reslt){  
  if (err) {
   
    callback(err, null);
  }else{
    var connection = reslt;
    
    //###### Sun Oct 29 09:43:07 PDT 2017 Get the tempID for this event to pass to the report writer
    //###### Sat Dec 9 07:58:51 PST 2017 Also get the EventName as this wil be the report name for the download
    var _sqlQ0 = 'SELECT TempID, EventName FROM events WHERE EventID='+req.params.eventID;
    connection.query(_sqlQ0, function(err, result0) {
      
      if (!err) {
        var eventTempID = result0[0].TempID;
        var eventName = result0[0].EventName
        console.log ("Here is the tempID in write report "+eventTempID)
        writeReport.writeReport('Attendance', eventID, eventTempID, function(err,reslt, fileName){  
                            
              //###### Sun Dec or 09:43:07 PDT 2017 Download the report (regardless if already exists)
              var cleanName = eventName.replace(/\//g, "-");
              //###### Sun Feb 22 09:43:07 PDT 2017 Timestamp the name so multiple copies can be run
              //Need to pass back the name from the writeReport module as this will just gen a new timestamp
              console.log("here is what was passed back "+fileName)

              if(fileName != null){
                var title=fileName;
                //var title='Attendance Report -- '+cleanName;
                var appPath = path.normalize(__dirname+'/..');
                var rptPath = path.normalize(appPath+'/public/reports/');
                var rptFullName = rptPath+title+'.csv';
                //res.download(rptFullName, title+'.csv');
                


                //###### Sat Feb 28 18:28:20 CDT 2018 moved email processing to here 
                 //###### Sat Apr 30 18:28:20 CDT 2018 Repositioned file download as email was tying up the file causing download of blank report
                //^^^^^^^^^^^^^email processing
                // Email the attendance report to the command center user.
                // Get the user's email, using the session username from log-in and their 
                // email from the USERS db table
                var userName= JSON.stringify(sess.username)
                var _sqlQ1 = 'SELECT UserEmail FROM Users WHERE UserName='+userName;
                connection.query(_sqlQ1, function(err, resultU) {
                  if(err) { console.log('email query bad'+err); connection.end();}
                  else{
                    console.log('user mail'+resultU[0].UserEmail)

                    //--
                    // Once back from the email query, download the report
                    res.download(rptFullName, title+'.csv');
                    
                    //--
                    // Email report
                    if (resultU[0].UserEmail !=""){
                      var fullFileName = title+'.csv'  
                      //###### Sat Feb 28 18:28:20 CDT 2018 User config report name prefix 
                      //emailController.sendAttendanceEmail('Attendance Report -- '+eventName, 'Please find Attendance Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
                      emailController.sendAttendanceEmail(fileName, 'Please find Attendance Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
                      if (err) {
                        console.log('a problem occurred, attempting to email customer support')
                        
                      }

                    
                      });
                    }
                     
                    connection.end()

                  }
                });

             //^^^^^^^^^^^^^^^^end email processing
             res.status(301).redirect('/reportConfirm/'+eventID+'/'+rptFullName+'/'+title);
             

          }else{
            //redisplay the screen to show the error message
            res.status(301).redirect('/eventAttendance/'+eventID);


             }    

        });
      };


    });
  }
});
 
}

//###### Fri Nov 17 08:02:03 PST 2017. New module for Event Deletion.
///////////////////////////////////////////////
// Get an event for Deletion 
////////////////////////////////////////////////
module.exports.eventGetForDelete = function(req,res) {
  
   sess=req.session;
      // don't let nameless people view the dashboard, redirect them back to the homepage
      if (typeof sess.username == 'undefined') res.redirect('/');
      else {
  
    //get a connection using the common handler in models/db.js
      db.createConnection(function(err,reslt){  
          if (err) {
            console.log('Error while pErforming common connect query: ' + err);
            callback(err, null);
          }else{
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;
  
            console.log('eventId param '+req.params.eventID);
            var strSQL = 'SELECT * FROM events WHERE EventID='+req.params.eventID;
            var query = connection.query(strSQL, function(err, result) {
  
                   if (err) {
                      console.log(err)
                      connection.end();
                      //sess.error = 'There was a problem updating the mobss database: '+err;
                      res.render('events', { title: 'Command Center 360'});
                    } else {
                     
                      var displayDate = datetime.syncGetDateOnlyInDisplayFormat(result[0].EventDateTime);
                      var displayTime = datetime.syncGetTimeInDisplayFormat(result[0].EventDateTime);
                      
                     
                      //get the invite ListName for display
                      var inviteListName = '';
                      console.log('here is the value of the invite list ID '+result[0].InvitationListID);
                      if (result[0].InvitationListID > 0) {
                      var strSQL2 = 'SELECT ListName FROM InviteList WHERE InvitationListID='+result[0].InvitationListID;
                                
                                var query = connection.query(strSQL2, function(err, result2, calllback) {
  
                                       if (err) {
                                          inviteListName = 'No name found for this invite list';
                                         
                                        } else {
                                          inviteListName = result2[0].ListName;
                                          connection.end();
                                          res.render('eventDelete', { title: 'Command Center', result, displayDate : displayDate, displayTime : displayTime, inviteListName : inviteListName });
                                        }
                                });
                      }else{
                        //0 value means no invite list has been attached yet
                        inviteListName = 'No invite list for this event'
                        connection.end();
                        res.render('eventDelete', { title: 'Command Center ', result, displayDate : displayDate, displayTime : displayTime, inviteListName : inviteListName });
  
                      }
                      
                  };
                  });//feb--end of connection.query
          }
      });
  };
  }; // end of handler



  //###### Fri Nov 17 08:02:03 PST 2017. New module for Event Deletion.
///////////////////////////////////////////////
// Delete the Event 
////////////////////////////////////////////////
module.exports.eventDeleteOne = function(req,res) {
  
   sess=req.session;
      // don't let nameless people view the dashboard, redirect them back to the homepage
      if (typeof sess.username == 'undefined') res.redirect('/');
      else {
  
    //get a connection using the common handler in models/db.js
      db.createConnection(function(err,reslt){  
          if (err) {
            console.log('Error while pErforming common connect query: ' + err);
            callback(err, null);
          }else{
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;
  
            var strSQL = 'DELETE FROM events WHERE EventID='+req.params.eventID;
            var query = connection.query(strSQL, function(err, result) {
  
                   if (err) {
                      console.log(err)
                      connection.end();
                      //sess.error = 'There was a problem updating the mobss database: '+err;
                      res.status(301).redirect('/events');
                  } else {
                             
                      var strSQL2 = 'DELETE FROM attendance WHERE EventID='+req.params.eventID;
                                
                        var query = connection.query(strSQL2, function(err, result2, calllback) {
  
                          if (err) {console.log('Error while performing attendance delete: ' + err);}         
                          connection.end();
                          res.status(301).redirect('/events');                                      
                        });
                     
                  };
                  });//feb--end of connection.query
          }
      });
  };
  }; // end of handler

  
  