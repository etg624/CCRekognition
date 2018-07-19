//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var muster = require('../models/muster');
var evacuation = require('../models/evacuation');
var db = require('../models/db');
var writeReport = require('./writeReport');
//###### Tue Apr 27 08:29:13 PDT 2018
var emailController = require('../controllers/emailController');
//###### Tue Apr 28 08:29:13 PDT 2018
var ioResultFormatting = require('../controllers/ioResultFormatting');
//###### Tue June 05 08:29:13 PDT 2018 - parameratize server address for sms
var serverAddress = process.env.SERVER_ADDRESS;




//////////////////////////////////////////////////////
// handler for showing the list of musters          //
//////////////////////////////////////////////////////
//###### Tue Apr 28 08:29:13 PDT 2018  Initialize screen errors
//###### Tue May 06 08:29:13 PDT 2018  Order the muster list latest first


module.exports.musterHome = function(req, res) {
  sess=req.session;
  

    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

      //get a connection using the common handler in models/db.js
      db.createConnection(function(err,reslt){  
          if (err) {
            
            callback(err, null);
          }else{
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;
            console.log('here is the connnection '+reslt.threadId);


            // Mustering Phase 1 resuses EVENTS. mustermaster table unused as of 5.2.3
            //var _sqlQ = "SELECT * FROM events where EventsType='mustering'";
            var _sqlQ = "SELECT * FROM events where EventsType='mustering' ORDER BY EventDateTime DESC";
            
            
            //var _sqlQ = "SELECT * FROM musterMaster";

            connection.query(_sqlQ, function(err, results) {
              //connection.release();
              if(err) { console.log('event query bad'+err); callback(true); return; }

            // show the mustering screen if msuter is enabled in the environment variables
            if (process.env.MUSTER == "ON"){
              res.render('musterHome', { title: 'Command Center', username: req.session.username, results });
            }else{
              res.render('disabled', { title: 'Command Center', username: req.session.username, results });
            }
            });
          }
      });
    }
};

////////////////////////////////////////////////////////////
// Gets the muster event detail for view/edit             //
////////////////////////////////////////////////////////////
module.exports.musterGetOneForEdit = function(req,res) {

 sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

  //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var strSQL = 'SELECT * FROM events WHERE EventID='+req.params.musterID;
          
          var query = connection.query(strSQL, function(err, result) {

             if (err) {
                console.log(err)
                connection.end();
                //sess.error = 'There was a problem updating the mobss database: '+err;
                res.render('musterHome', { title: 'Command Center'});
              } else {
                console.log('here is the event name ' + result[0].EventName);
                console.log('here are the comments ' + result[0].Comments);
                var displayDate = datetime.syncGetDateOnlyInDisplayFormat(result[0].EventDateTime);
                var displayTime = datetime.syncGetTimeInDisplayFormat(result[0].EventDateTime);
               
                console.log('display date is as follows : ' + displayDate);
                console.log('display time is as follows : ' + displayTime);
                connection.end();
                res.render('musterModify', { title: 'Command Center', result, displayDate : displayDate, displayTime : displayTime });

                
            };
            });//feb--end of connection.query
        }
      });
  }

}; // end of handler

/////////////////////////////////////////////////////////////////////
// update the database with the modifications to the muster record //
/////////////////////////////////////////////////////////////////////
//###### Wed Apr 20 18:27:05 PDT 2018 Lat Lng validation.  can't put blanks into the db float fields.  default to zeros.

exports.musterUpdateOne = function(req, res) {
  sess=req.session;
    var name = req.query.name;

 //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
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
              
                      var _latitude= field7;
                      var _longitude= field8;
                      if (_latitude ==""){_latitude = 0.000000}
                      if (_longitude == ""){_longitude = 0.000000}

                      var _comments = field5;
                      //var _updateTime = new Date();
                      var _d = new Date();
                      var _t = _d.getTime(); 
                      var _updateTime = _t;
                      var _eventID = field6;
                      console.log('here is locationname  '+_locationName);
                      
                      //var _qFields = '(EventName, EventDateTime, EventLocationName, EventSponsorName, DurationInMins, Latitude, Longitude, RecordStatus, Comments, updateTime, EventsType)';
                      //var _qValues = '("'+_eventName+'", "'+_dateTime+'", "'+_locationName+'", "'+_sponsorName+'", "'+_duration+'", "'+_latitude+'", "'+_longitude+'", "'+_recordStatus+'", "'+_comments+'", "'+_updateTime+'", "'+_eventsType+'")';                                                      
                      var _qUpdates = 'EventName="'+_eventName+'", EventDateTime="'+_dateTime+'"'+', EventLocationName="'+_locationName+'"'+', EventSponsorName="'+_sponsorName+'"'+', Latitude="'+_latitude+'"'+', Longitude="'+_longitude+'"'+', Comments="'+_comments+'"'+', updateTime="'+_updateTime+'"';
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

              

              var strSQL = buildEventQuery.updateEvent(req.body.musterName, _eventDateTime, req.body.location, req.body.musterCaptain, req.body.comments, req.params.musterID, req.body.lat, req.body.lng);
              console.log('update strSQL= '+ strSQL);  

              var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.render('musterModify', { title: 'Command Center'});
                  } else {
                    //console.log(err)
                           
                    connection.end();

                    //res.render('musterHome', { title: 'Command Center'});
                    res.status(301).redirect('/musterHome');


                                  
                };
                });//feb--end of connection.query
        }
    });
   // res.render('/events', { title: 'Command Center 360 - Event List'});
};



////////////////////////////////////////////////////////////
// Gets the card scans associated with this muster event  //
////////////////////////////////////////////////////////////
//###### Wed Apr 19 18:27:05 PDT 2018 Descending order for the list based on the IN TIME
//###### Wed Apr 25 18:27:05 PDT 2018 Add muster point to the attendance records based on the device code
//###### Wed Apr 28 18:27:05 PDT 2018 Common module for date reformat and sorting 



module.exports.musterGetOne = function(req,res) {

 sess=req.session;


    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {
      
      //get a connection using the common handler in models/db.js
      db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          
          // NOTE:  Mustering phase 1 reuses the EVENTS table

          //+++++++++++++++++++++++++++++++++++++++++
          //###### Wed Apr 19 18:27:05 PDT 2018 Get records for EventId and TempID (for device-created events)

          var _sqlQ0 = 'SELECT TempID, EventName FROM events WHERE EventID='+req.params.musterID;
          console.log(_sqlQ0);
          connection.query(_sqlQ0, function(err, result0) {
          
            //###### Wed Oct 4 18:23:41 PDT 2017  AS well as the rgular attendance records, get the attendance records sent to the server that were taken for a device-generated event
            //before that event was sent up to the server and received another, server generated, ID.  The original EventID of the device-gen
            //event is stored in a new field in the events table, TempID
                if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
                  
                
                //###### Sat Apr 19 18:17:55 CDT 2018 descending order for the attendance list
                var eventTempID =  "CommandCenter-created muster"
                var musterName =  result0[0].EventName
                
                if (result0[0].TempID =="" || result0[0].TempID == null) {
                  var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+req.params.musterID +' ORDER BY InTIme DESC';
                }else{
                  var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+req.params.musterID+' or EventID="'+result0[0].TempID+'"'+' ORDER BY InTIme DESC'
                  eventTempID="Device-created muster #"+result0[0].TempID
                }
                console.log(_sqlQ);
                connection.query(_sqlQ, function(err, results) {
                  //connection.release();
                  if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }

                  var musterID = req.params.musterID;

                  console.log("DESC query "+JSON.stringify(results));
                  
                  
                  //+++++++++++++++++++++ Get the muster point associated with the device

                  var _sqlQ1 = 'SELECT PointID, DeviceAuthCode FROM MusterPoint';
                  connection.query(_sqlQ1, function(err, results2) {
                    //connection.release();
                    if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }


                    //console.log ("MUSTER POINT RESULTS2 "+ JSON.stringify(results2))


                    //Loop through the MusterPoints and if there i a match on the results (attendance records)
                    //on deviceAuthCode, then append the muster point ID to the results array
                    for (var i=0; i < results2.length; i++) {
                      
                      for (var j=0; j < results.length; j++) {
                        //results[j].MusterPoint = "None"
                        //results[j].MusterPoint  = results2[0].PointID
                        //console.log("HERE ARE THE PAIRS "+JSON.stringify(results2[i].DeviceAuthCode)+" "+JSON.stringify(results[j].DeviceAuthCode));
                         
                          if (results2[i].DeviceAuthCode==results[j].DeviceAuthCode) {
                            //Append the Results JSON array with the musterpointID                           
                              results[j].MusterPoint = results2[i].PointID
                              
                          }
                          
                      }
                    }

                     //###### Sat Jun 04 18:17:55 CDT 2018 Give a descriptive name to the checkintype
                     for (var k=0; k < results.length; k++) {                        
                         
                      if (results[k].CheckInType=="1") {
                        //Append the Results JSON array with the musterpointID                           
                          results[k].CheckInTypeDesc = "Credential"
                          
                      } else if (results[k].CheckInType=="2") {
                        results[k].CheckInTypeDesc = "Manual"

                      } else if (results[k].CheckInType=="3") {
                        results[k].CheckInTypeDesc = "SMS"
                      
                      }
                  }
                  //++++++++++++++++

                    //++++++++++++++++++++++++++++++
                    //###### Sat Apr 27 18:17:55 CDT 2018 Get the date into sortable format from the h:mm am/pm format
                    results = ioResultFormatting.reformatTimes(results)
                    //console.log("MY REFORMAT Fn "+JSON.stringify(results))
                                          
                    results = ioResultFormatting.resortByTime(results)
                    //console.log("MY SORT Fn "+JSON.stringify(results))

                    // for (var j=0; j < results.length; j++) {                        
                      
                    //   var _InTime = results[j].InTIme

                    //   //Pad times with leading zero if the hour is single digit
                    //   if (_InTime.length < 8){_InTime = "0"+_InTime}
                      
                    //   var last2 = _InTime.slice(-2);
                    //   var first2 = _InTime.slice(0,2);
                      
                    //   //if am, check for the midnight case and then remove the "am"
                    //   if (last2 == "am"){
                    //     switch (first2)
                    //     {
                    //       case '12':
                    //         _InTime="00" + _InTime.slice(2)
                    //         _InTime=_InTime.slice(0,-2)
                    //         break;
                       
                    //             default:
                    //             _InTime = _InTime.slice(0, -2);
                    //     }

                    //   }else{
                    //     //for pm,  go to 24 hour clock and remove the "pm"
                    //     switch (first2)
                    //     {
                    //       case '01':
                    //         _InTime="13" + _InTime.slice(2)
                    //         _InTime=_InTime.slice(0,-2)
                    //         break;

                    //       case '02':
                    //         _InTime="14" + _InTime.slice(2)
                    //         _InTime=_InTime.slice(0,-2)
                    //         break;

                    //       case '03':
                    //         _InTime="15" + _InTime.slice(2)
                    //         _InTime=_InTime.slice(0,-2)
                    //         break;

                    //       case '04':
                    //         _InTime="16" + _InTime.slice(2)
                    //         _InTime=_InTime.slice(0,-2)  
                    //         break;

                    //       case '05':
                    //         _InTime="17" + _InTime.slice(2)
                    //         _InTime=_InTime.slice(0,-2)                                
                    //         break;

                    //       case '06':
                    //         _InTime="18" + _InTime.slice(2)
                    //         _InTime=_InTime.slice(0,-2)     
                    //         break;

                    //       case '07':
                    //         _InTime="19" + _InTime.slice(2)
                    //         _InTime=_InTime.slice(0,-2)     
                    //         break;

                    //       case '08':
                    //         _InTime="20" + _InTime.slice(2)
                    //         _InTime=_InTime.slice(0,-2)     
                    //         break;

                    //       case '09':
                    //         _InTime="21" + _InTime.slice(2)
                    //         _InTime=_InTime.slice(0,-2)     
                    //         break;

                    //       case '10':
                    //         _InTime="22" + _InTime.slice(2)
                    //         _InTime=_InTime.slice(0,-2)     
                    //         break;

                    //       case '11':
                    //         _InTime="23" + _InTime.slice(2)
                    //         _InTime=_InTime.slice(0,-2)                                   
                    //         break;

                    //       case '12':
                    //         _InTime="12" + _InTime.slice(2)
                    //         _InTime=_InTime.slice(0,-2)
                                                          
                    //         break;
                      
            
                    //       default: 
                    //     }
          
          
                    //   }  
                    //   results[j].InTIme = _InTime
                    // }


                  //++++++++++++++++++++++++++
                  //###### Sat Apr 26 18:17:55 CDT 2018 Get the descriptive name for the device

                  var _sqlQ1d = 'SELECT * from DeviceHeader';
                  connection.query(_sqlQ1d, function(err, resultsD) {

                    if (err){
                      //just log the error display the results we have
                      console.log("device name get error "+err)
                      connection.end();                      
                      res.render('musterDetail', { title: 'Command Center - Muster Detail', results : results, musterID : musterID, musterName : musterName, eventTempID : eventTempID});
                      
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
                      res.render('musterDetail', { title: 'Command Center - Muster Detail', results : results, musterID : musterID, musterName : musterName, eventTempID : eventTempID});

                    }
                  })

                  //++++++++++++++++++++++++++


                  // var musterID = req.params.musterID;

                  // //console.log(JSON.stringify(results));    
                  
                  // connection.end();                      
                  // //res.render('eventAttendance', { title: 'Command Center', results : results, eventID : eventID, eventName : eventName, eventTempID : eventTempID});
                  // res.render('musterDetail', { title: 'Command Center - Muster Detail', results : results, musterID : musterID, musterName : musterName, eventTempID : eventTempID});

                  });

                });

        
          })// new get for TempID    

          //++++++++++++++++++++++++++++++++++++++++++++++++++

          // Mustering phase 1 reuses the EVENTS table
          // var strSQL = 'SELECT * FROM attendance WHERE EventID='+req.params.musterID;
          // var query = connection.query(strSQL, function(err, result) {

          // if (err) {
          //     console.log(err)
          //     //sess.error = 'There was a problem updating the mobss database: '+err;
          //     res.render('musterDetail', { title: 'Command Center'});
          //   } else {
              
          //     console.log('full set of muster results are: ' + JSON.stringify(result));
          //     var musterID=req.params.musterID;
          //     var musterName="No muster records yet";
          //     if(result.length>0){
          //       musterID = result[0].EventID;
          //       musterName = result[0].EventName;
          //     }
              
          //     res.render('musterDetail', { title: 'Command Center - Muster Detail', results : result, musterID : musterID, musterName : musterName});
          //   }
          // });//feb--end of connection.query
        }
      });    
    };
}; //feb--end of post handler




//////////////////////
// Add a new muster //
//////////////////////

exports.musterAdd = function(req, res) {
  sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

    var name = req.query.name;
    var defaultLat = process.env.LAT 
    var defaultLng = process.env.LNG 
    console.log("default lat " +defaultLat)

    // show the mustering screen if msuter is enabled in the environment variables
    if (process.env.MUSTER == "ON"){
      res.render('musterAdd', { title: 'Command Center',defaultLat : defaultLat, defaultLng : defaultLng});            
    }else{
      res.render('disabled', { title: 'Command Center', username: req.session.username });
    }
 };
};


//////////////////////////////////////////////////////////////
// handler for posting a new muster to the EVENT table      //
// This is Phase 1 of  mustering -- reusing the attendance  //
// functionality in the App                                 //
//////////////////////////////////////////////////////////////
//###### Wed Apr 20 18:27:05 PDT 2018 Lat Lng validation.  can't put blanks into the db float fields.  default to zeros.

exports.musterPostDatabase = function(req,res) {

  //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var buildEventQuery = (function() {
                      var insertEvent = function(field1, field2, field3, field4, field5,field6,field7, field8, field9) {
              
                      var _eventName = field1;
                      var _dateTime = field2;
                      var _locationName = field3;
                      var _sponsorName = field4;
                      var _duration = field5;
                      var _latitude= field8;
                      var _longitude= field9;
                      if (_latitude ==""){_latitude = 0.000000}
                      if (_longitude == ""){_longitude = 0.000000}
                      var _recordStatus=null;
                      var _invitationListID =0;

                      var _comments = field6;
                      //var _updateTime = new Date();
                      var _d = new Date();
                      var _t = _d.getTime(); 
                      var _updateTime = _t;
                      var _eventsType = field7;
                      
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
          
              //feb--set the duration field in minutes based on the user input
              var _durationInMinutes = '';
              var _eventType = 'mustering';
              //console.log("LATLATLATLAT "+req.body.lat)
              //console.log("LATLATLATLAT "+JSON.stringify(req.body.lat))
              


              var strSQL = buildEventQuery.insertEvent(req.body.musterName, _eventDateTime, req.body.Location, req.body.musterCaptain, _durationInMinutes, req.body.comments, _eventType, req.body.lat, req.body.lng);
              console.log('POST strSQL= '+ strSQL);  
              var query = connection.query(strSQL, function(err, result) {
                
                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.render('musterAdd', { title: 'Command Center'});
                  } else {

                    var eventID =  result.insertId;
                    connection.end();
                    res.status(301).redirect('/musterHome');
                    //res.render('inviteLists', { title: 'Command Center', eventID : lastInsertID});
                  }
              });//feb--end of connection.query
          

        }
    });
}; //feb--end of post handler


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  FUTURE design for mustering that uses separate Muster tables rather than reusing events and attendance //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.musterPostDatabase_FUTURE = function(req,res) {

  //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          var buildMusterMasterQuery = (function() {
                    var insertMuster = function(field1, field2, field3, field4, field5,field6,field7) {
    
                      //var _musterID = field1;
                      var _musterName = field1;
                      var _Location = field2;
                      var _dateTime = field3;
                      var _musterCaptain = field4;
                      var _Status= field5;
                      var _Type= field6;
                      var _Zones=field7;

                      //var _comments = field6;
                      //var _updateTime = new Date();
                      //var _eventsType = field7;
                      //console.log('here is updateTIme  '+_updateTime);
                      
                      var _qFields = '(musterName, Location, dateTime, musterCaptain, Status, Type, Zones)';
                      var _qValues = '("'+_musterName+'", "'+_Location+'", "'+_dateTime+'", "'+_musterCaptain+'", "'+_Status+'", "'+_Type+'", "'+_Zones+'")';                                                      
                      var _qUpdates = 'musterName="'+_musterName+'", Location="'+_Location+'"'+', dateTime="'+_dateTime+'"'+', musterCaptain="'+_musterCaptain+'"'+', Status="'+_Status+'"'+', Type="'+_Type+'"'+', Zones="'+_Zones+'"';
                      var parmQuery3 = 'INSERT INTO musterMaster '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
                      //console.log('parmQuery3= '+parmQuery3);
                      return parmQuery3;
               };
               return {insertMuster : insertMuster};
              })();//feb--end of revealing module

              var strSQL = buildMusterMasterQuery.insertMuster(req.body.musterName, req.body.Location, req.body.eventDate, req.body.musterCaptain, req.body.Status, req.body.Type, req.body.Zones);
              console.log('POST strSQL= '+ strSQL);  
              var query = connection.query(strSQL, function(err, result) {

                              // INSERT INTO Users (id, weight, desiredWeight) VALUES(1, 160, 145) ON DUPLICATE KEY UPDATE weight=160, desiredWeight=145
               // Neat!
                            //if (err) throw error;
                             if (err) {
                                console.log(err)
                                sess.error = 'There was a problem posting the mobss database: '+err;
                                connection.end();
                                res.render('eventAdd', { title: 'Command Center 360'});
                              } else {
                                //console.log(err);
                                connection.end();
                                res.redirect('/musterHome');
                            };
                            });//feb--end of connection.query
        }
    });
}; //feb--end of post handler


///////////////////////////////////////////////////////////////
// Live muster screen                                        //
///////////////////////////////////////////////////////////////
//###### Wed Apr 20 18:27:05 PDT 2018 1. Separate count of unknowns, 2. New attendance field DeviceAuthcode

exports.musterLive= function(req, res) {
  sess = req.session;
  sess.time = '';
  
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') {
      res.redirect('/');
    }else{
    
    /**
     * 1. Get the attendance records for this event (may need to differentiate between check in and check out)
     * 2. Format an array, one entry for each device in the attendance records, with total scanned in
     * 3. Get the evactuation list and biuld an array for those who dont have yet have attendance records
     *
     */
    if (process.env.MUSTER == "ON"){

      //###### Wed May 04 18:27:05 PDT 2018 Add TempID to the retrievals of muster records
      //###### to support device generated musters.
      muster.getMusterRecords(req.params.musterID, function(err, tempID, resz1){ 
      if (err) {
        console.log('Error while performing query: ' + err);
      }
      else {
          // Get the muster counts per device
          
          muster.getMusterCounts(req.params.musterID, tempID, function(err, resz2){ 
          if (err) {
            console.log('Error while performing query: ' + err);
          }
          else {


            console.log('getting to before getEvacuationList');
          evacuation.getEvacuationList(function(err, resEvacs){ 
           if (err) {
            console.log('Error while performing get evac records: ' + err);
            }
            else {              

            // loop through the evac array and remove entry if badgeId record exists in the muster array 
            //console.log('whats the array length  ' + JSON.stringify(resEvacs.length));
            //console.log('whats the array value  ' + JSON.stringify(resEvacs[0].iClassNumber));
            var origEvacLength = resEvacs.length;
            var resEvacDisplay = resEvacs
            var resTotalScanned = resz1.length
            
            
            // attn: Have to deal with the case where the  there are two attendance records for the event that 
            // have the same iClassNumber.  if splice from the array when first match is found, then
            // It remove from the array
            // for (var i=0; i < resEvacs.length; i++) {
              
            //   console.log('whats the array value  ' + JSON.stringify(resEvacs[i].iClassNumber)); 
            //   console.log('whats the muster array length  ' + JSON.stringify(resz1.length)); 
              
            //   for (var j=0; j < resz1.length; j++) {
            //       var intOfString = parseInt(resz1[j].iClassNumber); 
            //       console.log('Evacs index '+ i);
            //       if (intOfString==resEvacs[i].iClassNumber) {
            //         console.log('ever getting here?? ') 
            //         resEvacDisplay.splice(i,1);
                    
            //   }
                  
            //   }
            // }
            // Loop through the muster records and remove them from the evac array
            
            console.log('logging resz1 from mustering.js');
            console.log(resz1);
            for (var i=0; i < resz1.length; i++) {
              
              
              for (var j=0; j < resEvacDisplay.length; j++) {
                  var intOfString = parseInt(resz1[i].iClassNumber); 
                  //console.log('Evacs index '+ i);
                  if (intOfString==resEvacDisplay[j].iClassNumber) {
                    //delete reEvacsDisplay[i]
                    resEvacDisplay.splice(j,1);
                    
              }
                  
              }
            }
        
            // to assist making the progress bars variable, carry both a number and the number+% in array

        //     var progress = [{
        //         statusPicture1:'status_Red.png',
        //         progress1 : '16%'
        //         },
        //         {statusPicture2:'status_Orange.png',
        //         progress2 : '66%'
        //         },
        //         {statusPicture3:'status_Red.png',
        //         progress3 : '6%'
        //         },
        //         {statusPicture4:'status_Green.png',
        //         progress4 : '100%'
        //         },
        //         {statusPicture5:'status_Red.png',
        //         progress5 : '36%'
        //         },
        //         {statusPicture6:'status_Orange.png',
        //         progress6 : '76%'
        //         }];

            var missingCount = resEvacs.length;
            var overallProg = (origEvacLength - missingCount) / origEvacLength * 100;
            var overallProgRound = overallProg.toFixed(0);
            var overallProgress = overallProg.toFixed(0)+'%';
            statusBar="danger";
            var musterLat = process.env.LAT
            var musterLng = process.env.LNG
            //Use the lat/lng from the event or, if blank, use the environmental default settings  
            
            muster.getOneMusterRecord(req.params.musterID, function(err, resMusterRecord){ 
             if (err) {
              console.log('Error while performing get muster record: ' + err);
              }
              else {
               
                //###### Wed Apr 20 18:27:05 PDT 2018 if the muster event lat lng are zero, default to env settings. 
                //###### they will never be blank as they are float fields in db

               //atn: logic here to use the muster(event) GPS fields rather than the environmental variables
               if (resMusterRecord[0].Latitude !==0.000000 || resMusterRecord[0].Longitude !==0.000000){
                //if (resMusterRecord[0].Latitude !=="" && resMusterRecord[0].Longitude !==""){
                  
                  //console.log("Changing Lat/Lng");

                  musterLat = resMusterRecord[0].Latitude
                  musterLng = resMusterRecord[0].Longitude

                }        
                //###### Wed Apr 20 18:27:05 PDT 2018 Get and count invalid scans and unkknown manual check-ins
                //###### Wed May 01 18:27:05 PDT 2018 Add musterID to the musterLive render parms

                muster.getUnknownCount(req.params.musterID, tempID, function(err, resUnknowns, resInvalids ){ 
                  if (err) {
                   console.log('Error while performing get unknowns: ' + err);
                   }
                   else {
                    var resTotalUnknown = 0
                    var resTotalInvalid = 0
                    if (resUnknowns != null){var resTotalUnknown = resUnknowns.length}
                    if (resInvalids != null){var resTotalInvalid = resInvalids.length}

                    var musterID = req.params.musterID

                    console.log('here is the RESEVACDISPLAY '+JSON.stringify(resEvacDisplay.length))

                    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

                    evacuation.updateUnaccounted(musterID, resEvacDisplay, function(err, result ){ 
                      if (err) {
                        console.log('Error while performing unaccounted table update: ' + err);
                    
                      }else {
                          // var resTotalFromEvacList = resTotalScanned - resTotalUnknown - resTotalInvalid
                          // res.render('musterLive', { title: 'Command Center', statusBar : statusBar, overallProgress : overallProgress, overallProgRound : overallProgRound, missingCount : missingCount, progress : progress, username: req.session.username, resz1 : resz1, resz2 : resz2, resEvacDisplay : resEvacDisplay, resTotalScanned, resTotalUnknown, resTotalInvalid, resTotalFromEvacList, musterLat, musterLng, musterID});

                      }
                      // ###### Wed May 9 11:16:35 PDT 2018  Add muster name to the live display
                      // ###### Wed May 22 11:16:35 PDT 2018  Handle the case where there are no muster records yet
                      if (resz1.length > 0){
                        var musterName=resz1[0].EventName
                      }else{
                        musterName =""
                      }
                      
                      var resTotalFromEvacList = resTotalScanned - resTotalUnknown - resTotalInvalid
                      //###### Tue June 05 08:29:13 PDT 2018 - parameratize server address for sms
                      res.render('musterLive', { title: 'Command Center', statusBar : statusBar, overallProgress : overallProgress, overallProgRound : overallProgRound, missingCount : missingCount, username: req.session.username, resz1 : resz1, resz2 : resz2, resEvacDisplay : resEvacDisplay, resTotalScanned, resTotalUnknown, resTotalInvalid, resTotalFromEvacList, musterLat, musterLng, musterID, musterName, serverAddress});
                    })

                //     db.createConnection(function(err,reslt){  
                //       if (err) {
                //         console.log('Error while performing common connect query: ' + err);
                //         callback(err, null);
                //       }else{
                //         var connection = reslt
                //     //--
                //     // Update the unaccounted table
                //     // _sqlQU = 'DELETE FROM unaccounted'
                //     // connection.query(_sqlQU, [values], function(err) {
                //     //   if (err) throw err;

                //     //   //--
                //     //   // Insert the remaining evacuees back into the tabe
                //       var insertArray = []
                //       for (var n=0; n < resEvacDisplay.length; n++) {
                        

                      
                //         insertArray.push([resEvacDisplay[n].iClassNumber, resEvacDisplay[n].LastName, resEvacDisplay[n].FirstName, "", "", "", ""])
                 
                //     }
                //         console.log('The ARARAY '+JSON.stringify(insertArray))
                //         //console.log('The ARARAY '+insertArray)
                        
                //     //}



                //   //     connection.end();
                //   // });
                //   var sql = "INSERT IGNORE INTO unaccounted (iClassNumber, LastName, FirstName, image, title, imageName, hasImage) VALUES ?";
                //   console.log ('sql to UNACCOUNTED '+sql)
                //   //   var values = [
                //   //       ['demian', 'demian@gmail.com', 1],
                //   //       ['john', 'john@gmail.com', 2],
                //   //       ['mark', 'mark@gmail.com', 3],
                //   //       ['pete', 'pete@gmail.com', 4]
                //   //   ];
                //   connection.query(sql, [insertArray], function(err) {
                //          if (err) throw err;
                //          connection.end();
                    

                //   //   var pars = [
                //   //     [99, "1984-11-20", 1.1, 2.2, 200], 
                //   //     [98, "1984-11-20", 1.1, 2.2, 200], 
                //   //     [97, "1984-11-20", 1.1, 2.2, 200]
                //   //   ];

                //     //--

                    
                   
                //     var resTotalFromEvacList = resTotalScanned - resTotalUnknown - resTotalInvalid
                //     res.render('musterLive', { title: 'Command Center', statusBar : statusBar, overallProgress : overallProgress, overallProgRound : overallProgRound, missingCount : missingCount, progress : progress, username: req.session.username, resz1 : resz1, resz2 : resz2, resEvacDisplay : resEvacDisplay, resTotalScanned, resTotalUnknown, resTotalInvalid, resTotalFromEvacList, musterLat, musterLng, musterID});
                    
                //   });

                // } //db
                // }) //db
                //});
                    
                    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5

                   }
                  })

            // show the mustering live screen
              //###### Wed Apr 20 18:27:05 PDT 2018 if the muster event lat lng are zero, default to env settings. 
              //res.render('musterLive', { title: 'Command Center', statusBar : statusBar, overallProgress : overallProgress, overallProgRound : overallProgRound, missingCount : missingCount, progress : progress, username: req.session.username, resz1 : resz1, resz2 : resz2, resEvacDisplay : resEvacDisplay, resTotalScanned, musterLat, musterLng});
            }
            });
          }
          });  //end of evac
        }
        });
       } // if else first get muster
      });
    
    }else{
      //mustering is disabled in the environmental variables so show disabled screen
      res.render('disabled', { title: 'Command Center', username: req.session.username});
    }   
}  
}; //end of handler


///////////////////////////////////////////////////////////////
// FUTURE live muster screen that will use the muster tables //
///////////////////////////////////////////////////////////////
exports.musterLive_FUTURE= function(req, res) {
  sess = req.session;
  sess.time = '';
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') {
      res.redirect('/');
    }else{
    
    muster.getMusterRecords(req.params.musterID, '1', function(err, resz1){ // begin of gets
    if (err) {
      console.log('Error while performing query: ' + err);
    }
    else {

      muster.getMusterRecords(req.params.musterID, '2', function(err, resz2){ 
      if (err) {
        console.log('Error while performing query: ' + err);
      }
      else {
      
        muster.getMusterRecords(req.params.musterID,'3', function(err, resz3){ 
          if (err) {
        console.log('Error while performing query: ' + err);
         }
         else {
            evacuation.getEvacuationList(function(err, resEvacs){ 
             if (err) {
              console.log('Error while performing get evac records: ' + err);
              }
              else {

              // loop through the evac array and remove entry if badgeId record exists in the muster array 
              console.log('whats the array length  ' + JSON.stringify(resEvacs.length));
              //console.log('whats the array value  ' + JSON.stringify(resEvacs[0].iClassNumber));
              var origEvacLength = resEvacs.length;
              

              for (var i=0; i < resEvacs.length; i++) {
                
                console.log('whats the array value  ' + JSON.stringify(resEvacs[i].iClassNumber)); 
                console.log('whats the muster array length  ' + JSON.stringify(resz3.length)); 
                
                for (var j=0; j < resz3.length; j++) {
                    var intOfString = parseInt(resz3[j].BadgeID); 
                    console.log('the two values '+ intOfString + ' '+resEvacs[i].iClassNumber);
                    if (intOfString==resEvacs[i].iClassNumber) {
                      console.log('ever getting here?? ') 
                      resEvacs.splice(i,1);
                      
                }
                
            }
          }
      
          // to assist making the progress bars variable, carry both a number and the number+% in array

          var progress = [{
              statusPicture1:'status_Red.png',
              progress1 : '16%'
              },
              {statusPicture2:'status_Orange.png',
              progress2 : '66%'
              },
              {statusPicture3:'status_Red.png',
              progress3 : '6%'
              },
              {statusPicture4:'status_Green.png',
              progress4 : '100%'
              },
              {statusPicture5:'status_Red.png',
              progress5 : '36%'
              },
              {statusPicture6:'status_Orange.png',
              progress6 : '76%'
              }];

          console.log('AGAIN');
          var missingCount = resEvacs.length;
          var overallProg = (origEvacLength - missingCount) / origEvacLength * 100;
          console.log('overall progress is '+overallProg)
          var overallProgRound = overallProg.toFixed(0);
          var overallProgress = overallProg.toFixed(0)+'%';
          statusBar="danger";


          res.render('musterLive', { title: 'Command Center - Live Muster', statusBar : statusBar, overallProgress : overallProgress, overallProgRound : overallProgRound, missingCount : missingCount, resEvacs : resEvacs, progress : progress, username: req.session.username, resz1 : resz1, resz2 : resz2, resz3 : resz3});
        }
      });
        } // if else last get muster
      });
      } // if else second get muster
    });
    } // if else third get muster
  });
      }
     
    }; //end of handler


/////////////////////////////////////////////////
// List mustering zones                        //
/////////////////////////////////////////////////
exports.musterPointHome = function(req, res) {
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
        db.createConnection(function(err,reslt){  
            if (err) {
              callback(err, null);
            }else{
              //process the i/o after successful connect.  Connection object returned in callback
              var connection = reslt;

              var _sqlQ = "SELECT * FROM musterpoint";
              connection.query(_sqlQ, function(err, results) {
                //connection.release();
                if(err) { console.log('musterpoint query error : '+err); connection.end(); callback(true); return; }
             
              connection.end()

              res.render('musterPoints', { title: 'Command Center', username: req.session.username, results });
              });
            }
        });
    }
};



/////////////////////////////////////////////////
// Add a mustering zone and associate a device //
/////////////////////////////////////////////////
exports.musterPointAdd = function(req, res) {
  sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

    // show the mustering screen if msuter is enabled in the environment variables
          if (process.env.MUSTER == "ON"){
            res.render('musterPointAdd', { title: 'Command Center'});
          }else{
            res.render('disabled', { title: 'Command Center', username: req.session.username});
          }
 };
};


////////////////////////////////////////////////////////////
// Create muster zone record and move to device list page //
////////////////////////////////////////////////////////////
//###### Wed Apr 20 18:27:05 PDT 2018 Lat Lng validation.  can't put blanks into the db float fields.  default to zeros.

exports.musterPointPostDatabase = function(req,res) {

//get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var buildZoneQuery = (function() {
                var insertZone = function(field1, field2, field3, field4, field5,field6,field7, field8, field9) {
        
                var _pointID = field1;
                var _lat= field2;
                var _lng = field3;
                if (_lat ==""){_lat = 0.000000}
                if (_lng == ""){_lng = 0.000000}
                var _description = field4;
                var _region = field5;
                var _campus= field6;
                var _building=field7;
                var _Location=field8;
                var _warden=field9
                //set the deviceAuthCode to "0" for now.  Device can be associated with zone from a list after the NEXT button is pressed 
                var _deviceAuthCode ='0';

               
                
                var _qFields = '(PointID, lat, lng, Description, Region, Campus, Building, Location, Warden , DeviceAuthCode)';
                var _qValues = '("'+_pointID+'", "'+_lat+'", "'+_lng+'", "'+_description+'", "'+_region+'", "'+_campus+'", "'+_building+'", "'+_Location+'", "'+_warden+'", "'+_deviceAuthCode+'")';                                                      
                var parmQuery = 'INSERT INTO musterpoint '+_qFields+' VALUES ' +_qValues
                //console.log('parmQuery3= '+parmQuery3);
                return parmQuery;
               };
               return {insertZone : insertZone};
              })();//feb--end of revealing module
            

              var strSQL = buildZoneQuery.insertZone(req.body.pointID, req.body.lat, req.body.lng, req.body.description, req.body.region, req.body.campus, req.body.building, req.body.location,req.body.warden);
              console.log('POST strSQL= '+ strSQL);  
              var query = connection.query(strSQL, function(err, result) {
                
                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.render('musterPointAdd', { title: 'Command Center 360'});
                  } else {
                    //console.log(err);
                    console.log('INSERT  ID????'+result.insertId);

                    var eventID =  result.insertId;
                    pointID = req.body.pointID
                    connection.end();
                    res.status(301).redirect('/devicePointAdd/'+pointID);
                    //res.render('inviteLists', { title: 'Command Center', eventID : lastInsertID});
                  }
              });//feb--end of connection.query
        }
    });

}; //feb--end of post handler


//////////////////////////////////////////////////////////////////////////////////////
// Show the device list so that the user can associate a device with a muster point //
//////////////////////////////////////////////////////////////////////////////////////
//###### Wed Apr 24 18:27:05 PDT 2018 Only show devices that are available to be assigned

exports.deviceListForPoint = function(req, res) {

  sess=req.session;
  sess.rptError =null;
  sess.rptSuccess =null;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

      //get a connection using the common handler in models/db.js
     db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var _sqlQ = "SELECT * FROM deviceheader where CurrentStatus='1'";
          connection.query(_sqlQ, function(err, results1) {
            //connection.release();
            if(err) { console.log('device query bad'+err); callback(true); connection.end(); return; }
            
            var _sqlQ2 = "SELECT DeviceAuthCode FROM MusterPoint";
            
            connection.query(_sqlQ2, function(err, results2) {
              //connection.release();
            if(err) { console.log('musterPoint query bad'+err); callback(true); connection.end(); return; 
            }else{
                
              //loop through the reults of DeviceHeader and remove each device already assigned to another muster point
             var results = results1
             
              for (var i=0; i < results2.length; i++) {
                
                for (var j=0; j < results1.length; j++) {
                  if (results1[j].AuthCode==results2[i].DeviceAuthCode) {
                    results.splice(j,1);                    
                    
                  }
              
                }
              }

            connection.end();
            res.render('devicePointAdd', { title: 'Command Center', username: req.session.username, pointID : req.params.pointID, results });
     
           }
          })
     
     
          });
        } 
      });

        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};


//////////////////////////////////////////////////////////////////////////
// Post the device to the zone after it has been selected from the list //
// Used for both Add and Modify of Muster Point                         //
//////////////////////////////////////////////////////////////////////////
exports.deviceAddForPoint = function(req, res) {

  sess=req.session;
  //var name = req.query.name;

 //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          var _authCode = req.params.AuthCode
     
          var strSQL2 = 'UPDATE musterpoint SET DeviceAuthCode="'+_authCode+'" WHERE PointID="'+req.params.pointID+'"';

          var query = connection.query(strSQL2, function(err, result2) {

              if (err) {
                console.log(err)
                sess.error = 'There was a problem updating the mobss database: '+err;
                connection.end();
                res.redirect('/musterPoints');
              } else {
                //console.log(err);
                connection.end();
                sess.success = 'New device attached for this zone'; 
                res.redirect('/musterPoints');
            };
            });//feb--end of connection.query

        }
    });
};


/////////////////////////////////
// Get a muster point for edit //
/////////////////////////////////
//###### Wed Apr 20 18:27:05 PDT 2018 Escape Quotes

module.exports.musterPointGetForModify = function(req,res) {

 sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

  //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          pointID = req.params.pointID
          pointID = pointID.replace("'", "\\'")
          
          
          var strSQL = "SELECT * FROM musterpoint WHERE PointID='"+pointID+"'";
          console.log(strSQL)
          var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    connection.end();
                    //sess.error = 'There was a problem updating the mobss database: '+err;
                    res.render('MusterPoints', { title: 'Command Center'});
                  } else {
                   console.log(JSON.stringify(result))
                    res.render('musterPointModify', { title: 'Command Center', result});
                    
                };
                });//feb--end of connection.query
        }
    });
};
}; // end of handler


////////////////////////////////////
// Get a muster point for Delete  //
////////////////////////////////////
//###### Wed Apr 20 18:27:05 PDT 2018 Escape Quotes

module.exports.musterPointGetForDelete = function(req,res) {
  
   sess=req.session;
      // don't let nameless people view the dashboard, redirect them back to the homepage
      if (typeof sess.username == 'undefined') res.redirect('/');
      else {
  
    //get a connection using the common handler in models/db.js
      db.createConnection(function(err,reslt){  
          if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
          }else{
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;
            pointID = req.params.pointID
            pointID = pointID.replace("'", "\\'")
  
            var strSQL = "SELECT * FROM musterpoint WHERE PointID='"+pointID+"'";
            console.log(strSQL)
            var query = connection.query(strSQL, function(err, result) {
  
                   if (err) {
                      console.log(err)
                      connection.end();
                      //sess.error = 'There was a problem updating the mobss database: '+err;
                      res.redirect('/musterPoints');
                    } else {
                     console.log(JSON.stringify(result))
                      res.render('musterPointDelete', { title: 'Command Center', result});
                      
                  };
            });//feb--end of connection.query
          }
      });
  };
  }; // end of handler



//////////////////////////////////////
// Delete a muster point           //
////////////////////////////////////
//###### Wed Apr 20 18:27:05 PDT 2018 New

module.exports.musterPointDeleteOne = function(req,res) {
  
   sess=req.session;
      // don't let nameless people view the dashboard, redirect them back to the homepage
      if (typeof sess.username == 'undefined') res.redirect('/');
      else {
  
    //get a connection using the common handler in models/db.js
      db.createConnection(function(err,reslt){  
          if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
          }else{
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;
             //Escape Quotes
             pointID = req.params.pointID
             pointID = pointID.replace("'", "\\'")
  
            var strSQL = "DELETE FROM musterpoint WHERE PointID='"+pointID+"'";
            console.log(strSQL)
            var query = connection.query(strSQL, function(err, result) {
  
                   if (err) {
                      console.log(err)
                      connection.end();
                      sess.error = 'There was a problem updating the mobss database';
                      res.redirect('/musterPoints');
                    } else {
                      res.redirect('/musterPoints');
                      
                  };
            });//feb--end of connection.query
          }
      });
  };
  }; // end of handler



////////////////////////////////////////////////////////////
// Update muster point record and move to device list page//
////////////////////////////////////////////////////////////
//###### Wed Apr 20 18:27:05 PDT 2018 Lat Lng validation.  can't put blanks into the db float fields.  default to zeros.
//###### Wed Apr 20 18:27:05 PDT 2018 Escape Quotes
//###### Wed May 06 18:27:05 PDT 2018 update the point id

exports.musterPointUpdateOne = function(req,res) {

//get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var buildPointQuery = (function() {
                var updatePoint = function(field1, field2, field3, field4, field5,field6,field7, field8, field9, field10, field11) {
        
                var _pointID = field1;
                var _pointBodyID = field11;
                var _lat= field2;
                var _lng = field3;
                if (_lat ==""){_lat = 0.000000}
                if (_lng == ""){_lng = 0.000000}
                var _description = field4;
                var _region = field5;
                var _campus= field6;
                var _building=field7;
                var _location=field8;
                var _warden=field9
                //set the deviceAuthCode to "0" for now.  Device can be associated with zone from a list after the NEXT button is pressed 
                var _deviceAuthCode =field10;

               
                
                var _qFields = '(PointID, lat, lng, Description, Region, Campus, Building, Location, Warden , DeviceAuthCode)';
                var _qValues = '("'+_pointBodyID+'", "'+_lat+'", "'+_lng+'", "'+_description+'", "'+_region+'", "'+_campus+'", "'+_building+'", "'+_location+'", "'+_warden+'", "'+_deviceAuthCode+'")';                                                      
                var _qUpdates = 'PointID="'+_pointBodyID+'", Lat="'+_lat+'"'+', Lng="'+_lng+'"'+', Description="'+_description+'"'+', Region="'+_region+'"'+', Campus="'+_campus+'"'+', Building="'+_building+'"'+', Location="'+_location+'"'+', Warden="'+_warden+'"';
                var parmQuery = "UPDATE musterpoint SET "+_qUpdates+" WHERE PointID='"+_pointID+"'";
                //console.log('parmQuery3= '+parmQuery3);
                return parmQuery;
               };
               return {updatePoint : updatePoint};
              })();//feb--end of revealing module

              //###### Wed Apr 20 18:27:05 PDT 2018 Escape Quotes
              pointID = req.params.pointID
              pointID = pointID.replace("'", "\\'")
              pointBodyID = req.body.pointID
              pointBodyID = pointBodyID.replace("'", "\\'")


              var strSQL = buildPointQuery.updatePoint(pointID, req.body.lat, req.body.lng, req.body.description, req.body.region, req.body.campus, req.body.building, req.body.location,req.body.warden, req.body.deviceAuthCode, pointBodyID);
              console.log('POST strSQL= '+ strSQL);  
              var query = connection.query(strSQL, function(err, result) {
                
                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.render('musterPoints', { title: 'Command Center'});
                  } else {
                   
                    //Go to the device list screen
                    connection.end();
                    res.status(301).redirect('/devicePointChange/'+req.params.pointID+'/'+req.body.deviceAuthCode);

                  }
              });//feb--end of connection.query
        }
    });

}; //feb--end of post handler


////////////////////////////////////////////////////////////////////////////////////
// Show the list of available devices so that user can change the one associated  //
// with this muster point                                                         //
////////////////////////////////////////////////////////////////////////////////////
//###### Wed Apr 24 18:27:05 PDT 2018 Only show devices that are available to be assigned

exports.deviceChangeForMusterPoint = function(req, res) {

  sess=req.session;
  sess.rptError =null;
  sess.rptSuccess =null;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

      //get a connection using the common handler in models/db.js
     db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;


          var _sqlQ = "SELECT * FROM deviceheader WHERE CurrentStatus = '1'";
          connection.query(_sqlQ, function(err, results1) {
            //connection.release();
            if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }



            var _sqlQ2 = "SELECT DeviceAuthCode FROM MusterPoint";
            
            connection.query(_sqlQ2, function(err, results2) {
              //connection.release();
            if(err) { console.log('musterPoint query bad'+err); callback(true); connection.end(); return; 
            }else{
                
              //loop through the reults of DeviceHeader and remove each device already assigned to another muster point
             var results = results1
             
              for (var i=0; i < results2.length; i++) {
                
                for (var j=0; j < results1.length; j++) {
                  if (results1[j].AuthCode==results2[i].DeviceAuthCode) {
                    results.splice(j,1);                    
                    
                  }
              
                }
              }

            connection.end();
            res.render('devicePointChange', { title: 'Command Center', username: req.session.username, pointID : req.params.pointID, deviceAuthCode : req.params.deviceAuthCode, results });
           }
          })
          

        
          });
        } 
      });

        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};


// ////////////////////////////////////////////////////////////////////////////////////
// // Handler for the mustering report.  OLD.                                        //
// ////////////////////////////////////////////////////////////////////////////////////

// exports.writeMusteringRpt = function(req, res) {
//   console.error('im in the write handler: '+ JSON.stringify(req.body));
//   sess=req.session;
//   var eventID = req.params.eventID;


//   writeReport.writeReport('Mustering', eventID, function(err,reslt){  
          
//           res.status(301).redirect('/musterDetail/'+eventID);

//   });
//  
// };



//###### Sat Apr 28 18:24:30 CDT 2018 NEW mustering report writing module
////////////////////////////////////////////////////////////////////////////////////
// Handler for the mustering report.                                              //
////////////////////////////////////////////////////////////////////////////////////
exports.writeMusteringRpt = function(req, res) {
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
    //###### Sat Dec 9 07:58:51 PST 2017 Also get the EventName as this will be the report name for the download
    var _sqlQ0 = 'SELECT TempID, EventName FROM events WHERE EventID='+req.params.eventID;
    connection.query(_sqlQ0, function(err, result0) {
      
      if (!err) {
        var eventTempID = result0[0].TempID;
        var eventName = result0[0].EventName
        writeReport.writeReport('Mustering', eventID, eventTempID, function(err,reslt, fileName){  
                            
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
                // email the user support if there is a problem connecting to the database
                // Get the user's email, using the session username from log-in and their 
                // email from the USERS db table
                var userName= JSON.stringify(sess.username)
                var _sqlQ1 = 'SELECT UserEmail FROM Users WHERE UserName='+userName;
                connection.query(_sqlQ1, function(err, resultU) {
                  if(err) { console.log('email query bad'+err); connection.end();}
                  else{

                    //--
                    // Download report
                    //res.download(rptFullName, title+'.csv');
                    
                    //--
                    // Email report
                    if (resultU[0].UserEmail !=""){
                      var fullFileName = title+'.csv'  
                      //###### Sat Feb 28 18:28:20 CDT 2018 User config report name prefix 
                      //emailController.sendAttendanceEmail('Attendance Report -- '+eventName, 'Please find Attendance Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
                      emailController.sendAttendanceEmail(fileName, 'Please find Mustering Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
                      if (err) {
                        console.log('a problem occurred, attempting to email customer support')
                        
                      }
                      //res.render ('/reportConfirm:eventID') 
                      //res.status(301).redirect('/reportConfirm/'+eventID);
                    
                      });
                      }else{
                        //res.render ('/reportConfirm:eventID') 
                        //res.status(301).redirect('/reportConfirm/'+eventID);
                                                
                      }
                   
                      connection.end()

                  }
                });

                res.status(301).redirect('/reportConfirm/'+eventID+'/'+rptFullName+'/'+title);
                //res.status(301).redirect('/inviteListsChange/'+req.params.eventID+'/'+req.body.eventName+'/'+invitationListID);
                
                //res.status(301).redirect('/inviteListsChange/'+req.params.eventID
                ///res.download(rptFullName, title+'.csv');
                
                //res.download()
                

             //^^^^^^^^^^^^^^^^end email processing

          }else{
            //redisplay the screen to show the error message
            
            res.status(301).redirect('/musterDetail/'+eventID);


             }    

        });
      };


    });
  }
});
 
}




//###### Sat Apr 28 18:24:30 CDT 2018 NEW module for emailing unaccounted
////////////////////////////////////////////////////////////////////////////////////
// Handler for emailing the unaccounted during a muster.                          //
////////////////////////////////////////////////////////////////////////////////////
exports.emailUnaccounted = function(req, res) {
  //console.error('im in the EMAIL EVAC handler: '+ req.params.resEvacDisplay);
  sess=req.session;
  var musterID = req.params.musterID;
 
 //###### Sat Apr 28 18:24:30 CDT 2018 Only get the emails for this musterID
    evacuation.getUnaccounted("Email", musterID, function(err,reslt){  
      if (err) {

        console.error('Error connecting to database: '+ err);
        res.status(301).redirect('/musterLive/'+musterID);
      }else{

            //--
            // Loop through the unaccounted table and find their emails
            for (var i=0; i < reslt.length; i++) {
              
                    //--
                    // Email report
                    if (reslt[i].EmailAddress !="" && reslt[i].EmailAddress !=null ){
                      var title = process.env.EMERGENCY_TITLE 
                      var message = process.env.EMERGENCY_MESSAGE
                      
                        emailController.sendIncidentEmail(title, message, reslt[i].EmailAddress,function(err,reslt){
                          if (err) {console.log('a problem occurred, attempting to email evacuee')}
                          });
                     
                    }
                    
            }            

            res.status(301).redirect('/musterLive/'+musterID);
      }
         
    })
 
}
