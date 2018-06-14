//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var db = require('../models/db');
var writeReport = require('./writeReport');



///////////////////////////////////////////////////////////
// Display the list of card scans from table verify records
///////////////////////////////////////////////////////////
//###### Sat Apr 26 18:17:55 CDT 2018 Get the descriptive name for the device

module.exports.verifyHome = function(req, res) {
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

          //###### Fri Feb 9 17:02:27 PST 2018 Only get most recent records (number is user specified in settings, default 1000)
          //###### Sat Apr 19 18:31:35 CDT 2018 Order by Desc for both lists

          if (process.env.CARDSCAN_RECS_LIMIT == ""){
            var _sqlQ = "SELECT * FROM verifyrecords ORDER BY scandatetime DESC";
          }else{
            var _sqlQ = "SELECT * FROM verifyrecords ORDER BY scandatetime DESC LIMIT "+ process.env.CARDSCAN_RECS_LIMIT;
          }
          
          connection.query(_sqlQ, function(err, results) {
            //connection.release();
            if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
          //console.log("Meta query results are "+ JSON.stringify(results));
          //console.log("Meta query results are "+ results[0].maxTime);
          //console.log("check out a field--scanDate : ", results[0].scanDate);

            //###### Thu Feb 8 15:15:21 PST 2018
            //NAME ISNT IN VERIFYRECORDS TABLE SO GET THE LAST NAME FOR EACH OF THE VERIFYRECORDS 
            //BASED ON BADGE NUMBER.
            //FORMAT AN ARRAY TO RENDER INSTEAD OF JUST RENDERING RESULTS
            //TODO: NEED TO MONITOR THE SPEED AS IF THIS IS SLOW ON LARGE NUMBERS OF VERIFYRECORDS
            //THEN MAY BE BETTER ADDING NAME TO THE VERIFYRECORDS TABLE AND POPULATING IT DURING
            //THE SCAN ON THE APP
            var displayArray = []
            var lastNameForBadge = ""
            var _sqlQ1 = "SELECT iClassNumber, LastName FROM people";
             
            connection.query(_sqlQ1, function(err, reslt) {
                //connection.release();
                if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
             
                      for (var j=0; j < results.length; j++) {

                          //We are looking for this last name
                          lastNameForBadge = results[j].BadgeID
                          theLastName = "Unknown" // default the last name to "unknown"
                          for (var k=0; k < reslt.length; k++) {

                            if (reslt[k].iClassNumber == lastNameForBadge){
                              theLastName =reslt[k].LastName
                              break; // a match on badgeId in the people table!
                             
                            }
                          } // Done looking for that LastName

                          //###### Sat Apr 19 18:31:35 CDT 2018 Add clientSWID (which is now the Device ID)
                          //###### Sat Apr 26 18:31:35 CDT 2018 Add description for theResult

                          //Cardscan records screen layout:
                              //Employee ID
                              //Badge ID
                              //LastName
                              //Scan Date/Time
                              //Result
                              //In/Out Type
                              //Device ID (ClientSWID)
                              //MobssOperator (Device ID)
                              var theEmpID = results[j].EmpID                
                              var theBadgeID = results[j].BadgeID
                              var theScanDateTime = results[j].ScanDateTime

                              var theResult = results[j].Result
                              if(theResult=="1"){theResult="Granted"}
                              if(theResult=="2"){theResult="Denied"}
                              
                              var theInOutType = results[j].InOutType
                              var theClientSWID = results[j].ClientSWID
                              var theMobSSOperator = results[j].MobSSOperator        
                              

                              displayArray.push({EmpID : theEmpID, BadgeID : theBadgeID, LastName : theLastName, ScanDateTime : theScanDateTime, Result: theResult, InOutType : theInOutType, ClientSWID : theClientSWID ,MobSSOperator : theMobSSOperator}); 
                      } 
                      
                      
                      //++++++++++++++++++++++++++
                      //###### Sat Apr 26 18:17:55 CDT 2018 Get the descriptive name for the device

                      var _sqlQ1d = 'SELECT * from DeviceHeader';
                      connection.query(_sqlQ1d, function(err, resultsD) {

                        if (err){
                          //just log the error display the results we have
                          console.log("device name get error "+err)
                          connection.end();                      
                          res.render('verifyRecords', { title: 'Command Center - Cardscans', username: req.session.username, results : displayArray });
                          
                        }else{

                          for (var i=0; i < displayArray.length; i++) {
                            
                            for (var j=0; j < resultsD.length; j++) {
                    
                                if (displayArray[i].ClientSWID==resultsD[j].AuthCode) {
                                  //Append the Results JSON array    
                                  if (resultsD[j].name=="" || resultsD[j].name==null ){
                                    displayArray.DeviceAuthCodeDesc = displayArray[i].ClientSWID
                                    
                                  }else{
                                    displayArray[i].DeviceAuthCodeDesc = resultsD[j].name
                                    
                                  }                       
                                    
                                }
                                
                            }
                          }
                          connection.end();                      
                          res.render('verifyRecords', { title: 'Command Center - Cardscans', username: req.session.username, results : displayArray });
                          
                        }
                      })

                      //++++++++++++++++++++++++++
             

              //  res.render('verifyRecords', {                 title: 'Command Center 5.0 - Cardscans', username: req.session.username, results });
               // res.render('verifyRecords', { title: 'Command Center - Cardscans', username: req.session.username, results : displayArray });
            //###### Thu Feb 8 15:16:52 PST 2018 END OF THE GET NAME PROCESSING

            })
          //}
          });
        } 
      });

    }
};




///////////////////////////////////////////////////////////
// Display the select record when user selects SELECT 
///////////////////////////////////////////////////////////

module.exports.verifyGetOne = function(req,res) {

 sess=req.session;
 sess.cardholdername=null;
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

          // Get the cardholders name from the people table for display
          console.log('badgeID param '+req.params.badgeID);
          var strSQL1 = 'SELECT LastName, FirstName FROM people WHERE iClassNumber='+req.params.badgeID;
          var query = connection.query(strSQL1, function(err, rest) {

                 if (err) {
                    console.log(err)
                    //sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    res.render('verifyRecords', { title: 'Command Center'});
                    
                  } else {
                    if (rest.length >0 ) {
                    sess.cardholdername = rest[0].LastName+', '+rest[0].FirstName;
                    }else{
                    sess.cardholdername = 'Name not found'
                    }

                  }
                });//feb--end of connection.query

          //###### Sat Apr 19 18:31:35 CDT 2018 Order by Desc for list
          var strSQL = 'SELECT * FROM verifyrecords WHERE BadgeID='+req.params.badgeID+' ORDER BY ScanDateTime DESC';
          var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    //sess.error = 'There was a problem updating the mobss database: '+err;
                    res.render('verifyRecords', { title: 'Command Center'});
                  } else {
                    
                    var badgeNum = req.params.badgeID;

                      //++++++++++++++++++++++++++
                      //###### Sat Apr 26 18:17:55 CDT 2018 Get the descriptive name for the device & Access Result

                      // Convert the Result code into user friendly text
                      for (var j=0; j < result.length; j++) {
                        
                          if (result[j].Result=="1") {result[j].Result="Granted"}
                          if (result[j].Result=="2") {result[j].Result="Denied"}
                                     
                      }

                      //++++++++++++++++++++++++++
                      // Get the descriptive name for the devices

                      var _sqlQ1d = 'SELECT * from DeviceHeader';
                      connection.query(_sqlQ1d, function(err, resultsD) {

                        if (err){
                          //just log the error display the results we have
                          console.log("device name get error "+err)
                          connection.end();                      
                          res.render('verifyCheck', { title: 'Command Center', results : result, badgeNum : badgeNum, cardholderName : sess.cardholdername});
                          
                        }else{

                          for (var i=0; i < result.length; i++) {
                            
                            for (var j=0; j < resultsD.length; j++) {
                    
                                if (result[i].ClientSWID==resultsD[j].AuthCode) {
                                  //Append the Results JSON array    
                                  if (resultsD[j].name=="" || resultsD[j].name==null ){
                                    result.DeviceAuthCodeDesc = result[i].ClientSWID
                                    
                                  }else{
                                    result[i].DeviceAuthCodeDesc = resultsD[j].name
                                    
                                  }                       
                                    
                                }
                                
                            }
                          }
                          connection.end();                      
                          res.render('verifyCheck', { title: 'Command Center', results : result, badgeNum : badgeNum, cardholderName : sess.cardholdername});
                          
                        }
                      })

                      //++++++++++++++++++++++++++
             

                    
                    //res.render('verifyCheck', { title: 'Command Center', results : result, badgeNum : badgeNum, cardholderName : sess.cardholdername});
                  }
                });//feb--end of connection.query
        }
      });
    }
}; //feb--end of post handler


module.exports.contractorGetOne = function(req,res) {

 sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {
      console.log('am i making it this far CONTRACTORGETONE??');
      console.log('am i making it this far???' + req.query);
      console.log('am i making it this far???' + req.params);
      console.log('and the paramter is ' + JSON.stringify(req.body.EventID));
      //get a connection using the common handler in models/db.js
     db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          var strSQL = 'SELECT * FROM verifyrecords WHERE contractor='+"'"+req.params.contractor+"'";
          console.log('here is the query string for contractorGetOne  ' + strSQL);
          //console.log('strSQL= '+ strSQL);  
          var query = connection.query(strSQL, function(err, result) {

                 if (err) {
                    console.log(err)
                    //sess.error = 'There was a problem updating the mobss database: '+err;
                    res.render('verifyRecords', { title: 'Command Center'});
                  } else {
                    
                    console.log('full set of results are: ' + JSON.stringify(result));
                    var contractor = req.params.contractor;
                    
                    res.render('contractorCheck', { title: 'Command Center - Contractors', results : result, contractor : contractor});
                  }
                });//feb--end of connection.query
        }
      });
    };
}; //feb--end of post handler



//////////////////////////////////////////////////////////////////////////////////////
// Within the verifyRecords detail screen (verifyCheck), handles the date range search
//////////////////////////////////////////////////////////////////////////////////////
exports.verifySearch = function(req, res) {
  sess=req.session;
    var name = req.query.name;

    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);


          // first get the search variables from the screen entries
          // is start is later than end, if so, just swap and them around and return the range anyway
          // format with the h/m/s variables to match the verifyRecords scanDateTime variable format
           
          var dayStart = ' 00:00:00';
          var dayEnd =  ' 23:59:59';
          if (req.body.startDate > req.body.endDate) {
                var searchStartDate = "'"+req.body.endDate+dayStart+"'";
                var searchEndDate =  "'"+req.body.startDate+dayEnd+"'";
              }else{
                var searchStartDate = "'"+req.body.startDate+dayStart+"'";
                var searchEndDate =  "'"+req.body.endDate+dayEnd+"'";
              }

              

          // set the form display dates (same as the format of the request)
          var displaySearchStart = req.body.startDate;
          var displaySearchEnd = req.body.endDate;

          var strSQL =  'select * from verifyrecords where BadgeID='+req.params.badgeID+' and ScanDateTime between '+searchStartDate+' and '+searchEndDate;
          console.log('full query'+ strSQL);
          var query = connection.query(strSQL, function(err, result) {

             if (err) {
                console.log(err)
                res.render('verifyCheck', { title: 'Command Center'});
              } else {
                console.log('full set of results are: ' + JSON.stringify(result));
                //for (var i=1; i < result.length; i++) {
                console.log('display start date is : ' + displaySearchStart);
                
                var badgeNum = req.params.badgeID;
                connection.end();
              

                res.render('verifyCheck', { title: 'Command Center', results : result, badgeNum : badgeNum, cardholderName : sess.cardholdername, displaySearchStart : displaySearchStart, displaySearchEnd : displaySearchEnd});
              }
            });//feb--end of connection.query
        }
    });
};




////////////////////////////////////////////////////////
//  Get a set of verifyrecords by date range
//////////////////////////////////////////////////////////
//###### Thu Feb 8 15:15:21 PST 2018 New method to handle the date range search

exports.verifyRecordsSearch = function(req, res) {
  sess=req.session;
    var name = req.query.name;

    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);


          // first get the search variables from the screen entries
          // is start is later than end, if so, just swap and them around and return the range anyway
          // format with the h/m/s variables to match the verifyRecords scanDateTime variable format
           
          var dayStart = ' 00:00:00';
          var dayEnd =  ' 23:59:59';
          if (req.body.startDate == "" && req.body.endDate == ""){
            //Just get the default amount of records
            if (process.env.CARDSCAN_RECS_LIMIT == ""){
              var strSQL = "SELECT * FROM verifyrecords";
            }else{
              var strSQL = "SELECT * FROM verifyrecords ORDER BY scandatetime DESC LIMIT "+ process.env.CARDSCAN_RECS_LIMIT;
            }
            
          }else{
              if (req.body.startDate == "" && req.body.endDate != ""){
                var searchEndDate =  "'"+req.body.endDate+dayEnd+"'";
                var strSQL =  'select * from verifyrecords where ScanDateTime <= '+searchEndDate;
                

              }else{
                if (req.body.startDate != "" && req.body.endDate == ""){
                  var searchStartDate = "'"+req.body.startDate+dayStart+"'";
                  var strSQL =  'select * from verifyrecords where ScanDateTime >= '+searchStartDate;
                  

                }else{

                  if (req.body.startDate > req.body.endDate) {
                    var searchStartDate = "'"+req.body.endDate+dayStart+"'";
                    var searchEndDate =  "'"+req.body.startDate+dayEnd+"'";
                  }else{
                    var searchStartDate = "'"+req.body.startDate+dayStart+"'";
                    var searchEndDate =  "'"+req.body.endDate+dayEnd+"'";
                  }

                  var strSQL =  'select * from verifyrecords where ScanDateTime between '+searchStartDate+' and '+searchEndDate;
                }
              }

          }
          console.log('full query'+ strSQL);
          var query = connection.query(strSQL, function(err, result) {

             if (err) {
                console.log(err)
                res.render('verifyrecords', { title: 'Command Center'});
              } else {
                console.log('full set of results are: ' + JSON.stringify(result));
                //for (var i=1; i < result.length; i++) {
                console.log('display start date is : ' + displaySearchStart);
                
                connection.end();

                // set the form display dates (same as the format of the request)
                var displaySearchStart = req.body.startDate;
                var displaySearchEnd = req.body.endDate;

                res.render('verifyRecords', { title: 'Command Center', results : result, displaySearchStart : displaySearchStart, displaySearchEnd : displaySearchEnd});
              }
            });//feb--end of connection.query
        }
    });
};


// handler displaying the attendance records for a particular event
module.exports.writeCardscansRpt = function(req, res) {
  sess=req.session;
  var badgeID = req.params.badgeID;
  //###### Mon Dec 11 11:04:34 PST 2017  Added a dummy tempID as function shared with atendance which now needs this
  var tempID =""

  writeReport.writeReport('Cardscans', badgeID, tempID, function(err,reslt){  
          //###### Sun Dec 11 09:43:07 PDT 2017 Download the report (regardless if already exists)
          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!
          var yy = today.getFullYear();

          today = mm+'-'+dd+'-'+yy;
         
          var title='Cardscan Report - Generated '+today+'- for BadgeID '+badgeID;
          var appPath = path.normalize(__dirname+'/..');
          var rptPath = path.normalize(appPath+'/public/reports/');
          var rptFullName = rptPath+title+'.csv';

          //var appPath = path.normalize(__dirname+'/..');

          res.download(rptFullName, title+'.csv');
          //res.download(appPath + '/public/reports/foo.txt', 'foo.txt');
          //res.status(301).redirect('/verifyCheck/'+badgeID);

    });
 
};



