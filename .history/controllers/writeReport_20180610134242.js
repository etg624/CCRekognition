var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var db = require('../models/db');
var emailController = require('../controllers/emailController');
var client = require('ftp');
//###### Tue Apr 28 08:29:13 PDT 2017
var ioResultFormatting = require('../controllers/ioResultFormatting');
//###### Tue May 02 08:29:13 PDT 2017
var evacuation = require('../models/evacuation');





///////////////////////////////////////////
// Report Junction handler               //
///////////////////////////////////////////
//###### Sat Oct 28 18:28:20 CDT 2018  TempID added as a parm and for passing to the attendance report
//###### Sat Apr 28 18:28:20 CDT 2018  Common module added for Attendance and mustering -- handles config files
//###### and descriptive names for device codes & check in type

module.exports.writeReport = function(report, itemID, itemTempID, callback) {
 

          //get a connection using the common handler in models/db.js
      db.createConnection(function(err,reslt){  
          if (err) {
            callback(err, null);
          }else{
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;
            console.log('here is the connnection '+reslt.threadId);

            // Run the attendance report
            if (report == 'Attendance') {
              var eventID = itemID;
              //###### Sat Feb 25 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times for 
              //an event.  Neeed to pass the name back through the callbacks
              //###### Sun Jun 10 13:29:41 PDT 2018 Distinguish screen from sweep caller
              module.exports.writeActivityReport ("screen", report, connection, eventID, itemTempID, function(err,reslt, fileName){  
                callback(sess.rptError, sess.rptSuccess, fileName);
                return;
            });
            } 
            
            // Run the cardscans report
            if (report == 'Cardscans') {
              var badgeID = itemID;  
            
              module.exports.writeCardscanReport (connection, badgeID, function(err,reslt){  
                callback(sess.rptError, sess.rptSuccess);
                return;

              });   
            } 
            // Run the mustering report
            if (report == 'Mustering') {
              var musterID = itemID;  
            
              //###### Sat Apr 27 18:31:35 CDT 2018 Add tempID to the mustering report processing
              //###### Sat Apr 27 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times for 
              //###### Sun Jun 10 13:29:41 PDT 2018 Distinguish screen from sweep caller
              module.exports.writeActivityReport ("screen", report, connection, musterID, itemTempID, function(err,reslt, fileName){  
                callback(sess.rptError, sess.rptSuccess, fileName);
                //return;

              });   
            } 
           };
      });
};


//###### Sat Feb 28 18:31:35 CDT 2018 This has been significantly refactored to allow for user config of report
///////////////////////////////////////////
// Report of all Attendance for an Event //
///////////////////////////////////////////
//###### Sat Oct 28 18:31:35 CDT 2017 Added a parm and processing for attendance from device generated events
//###### Sat Feb 28 18:31:35 CDT 2018 Report format is pulled from user config (csv file)
//###### Sat Apr 17 18:31:35 CDT 2018 Process new field for Device Auth Code
//###### Sat Apr 27 18:31:35 CDT 2018 Process new field for CheckInType
//###### Sat Apr 28 18:17:55 CDT 2018 Give a descriptive name to the checkintype
//###### Sat Apr 28 18:17:55 CDT 2018 TODO --- MOVED TO COMMON MODULE
module.exports.writeAttendanceReport = function(connection, eventID, eventTempID, callback) {

  //Read the report configuration file, which is in the root directory
  //and then parse it.   
  fs.readFile('./attRpt.csv', {
        encoding: 'utf-8'
      }, function(err, csvData) {
            if (err) {
            sess.error = 'File not found.  Please check directory and file name.';
            callback(err, null);
            }

      csvParser(csvData, {
        delimiter: ',',
        escape: "'"
        //columns: true
        }, function(err, data) {
          if (err) {
        console.log(err);
            sess.error = 'csv file problem -- '+err;
            callback(err, null);
        } else {
            
          // Initialize the fields for retrieval to just the mandatory ones
          var _sql3 = "EventName"

          //Initialise the header string
          var header=''+','
          var detail=''+','
          
          
          // This is what the attendance table looks like
          // +---------------+-------------+------+-----+---------+-------+
          // | Field         | Type        | Null | Key | Default | Extra |
          // +---------------+-------------+------+-----+---------+-------+
          // | MobSSID       | int(11)     | YES  |     | NULL    |       |
          // | FirstName     | varchar(25) | YES  | MUL | NULL    |       |
          // | LastName      | varchar(25) | YES  | MUL | NULL    |       |
          // | InTIme        | varchar(20) | YES  |     | NULL    |       |
          // | OutTIme       | varchar(20) | YES  |     | NULL    |       |
          // | EventID       | varchar(25) | YES  |     | NULL    |       |
          // | EventName     | varchar(40) | YES  |     | NULL    |       |
          // | iClassNumber  | bigint(20)  | YES  | MUL | NULL    |       |
          // | AttendDate    | varchar(20) | YES  |     | NULL    |       |
          // | InSeconds     | varchar(20) | YES  |     | NULL    |       |
          // | OutSeconds    | varchar(20) | YES  |     | NULL    |       |
          // | EmpID         | varchar(40) | YES  |     | NULL    |       |
          // | RecordStatus  | varchar(10) | YES  |     | NULL    |       |
          // | MobSSOperator | varchar(40) | YES  |     | NULL    |       |
          // | DeviceAuthCode| varchar(40) | YES  |     | NULL    |       |
          // | CheckInType   | varchar(4)  | YES  |     | NULL    |       |
          // +---------------+-------------+------+-----+---------+-------+
         
          //read the fields from the report format file
          var firstNameKey = data[0][0];
          var firstName = data[0][1];
          var lastNameKey = data[1][0];
          var lastName = data[1][1];
          var inTImeKey = data[2][0];
          var inTIme = data[2][1];
          var outTImeKey = data[3][0];
          var outTIme = data[3][1];
          var iClassNumberKey = data[4][0];
          var iClassNumber = data[4][1];
          var attendDateKey = data[5][0];
          var attendDate = data[5][1];
          var inSecondsKey = data[6][0];
          var inSeconds = data[6][1];
          var outSecondsKey = data[7][0];
          var outSeconds = data[7][1];
          var empIDKey = data[8][0];
          var empID = data[8][1];
          var mobSSOperatorKey = data[9][0];
          var mobSSOperator = data[9][1];
          var eventIdNumKey = data[10][0];
          var eventIdNum = data[10][1];
          var emailAddKey = data[11][0];
          var emailAdd = data[11][1];
          var identifierFldKey = data[12][0];
          var identifierFld = data[12][1];
          var reportPrefix = data[13][1];
          var devAuthCodeKey = data[14][0];
          var devAuthCode = data[14][1];
          var checkInTypeKey = data[15][0];
          var checkInType = data[15][1];
          
          //Create the rest of the SQL statement field list based on the 
          //the report format file
          if (firstName == "YES"){_sql3=_sql3+","+firstNameKey, header=header+firstNameKey+","}
          if (lastName == "YES"){_sql3=_sql3+","+lastNameKey, header=header+lastNameKey+","}
          if (inTIme == "YES"){_sql3=_sql3+","+inTImeKey, header=header+inTImeKey+","}
          if (outTIme == "YES"){_sql3=_sql3+","+outTImeKey, header=header+outTImeKey+","}
          if (iClassNumber == "YES"){_sql3=_sql3+","+iClassNumberKey, header=header+"BadgeNumber"+","}
          if (attendDate == "YES"){_sql3=_sql3+","+attendDateKey, header=header+attendDateKey+","}
          if (inSeconds == "YES"){_sql3=_sql3+","+inSecondsKey, header=header+inSecondsKey+","}
          if (outSeconds == "YES"){_sql3=_sql3+","+outSecondsKey, header=header+outSecondsKey+","}
          if (empID == "YES"){_sql3=_sql3+","+empIDKey, header=header+empIDKey+","}
          if (checkInType == "YES"){_sql3=_sql3+","+checkInTypeKey, header=header+checkInTypeKey+","}
          if (mobSSOperator == "YES"){_sql3=_sql3+","+mobSSOperatorKey, header=header+mobSSOperatorKey+","}
          if (devAuthCode == "YES"){_sql3=_sql3+","+devAuthCodeKey, header=header+devAuthCodeKey+","}
          if (eventIdNum == "YES"){_sql3=_sql3+","+eventIdNumKey, header=header+eventIdNumKey+","}
          if (emailAdd == "YES"){header=header+emailAddKey+","}
          if (identifierFld == "YES"){header=header+identifierFldKey+","}
          
          header = header+'\n'
          //var header='Last Name'+','+ 'First Name'+','+'Employee ID'+','+'Attendance Date'+','+'Email'+','+'Time In'+','+'Time Out'+','+'Badge ID'+','+'Identifier'+','+'\n';
          console.log("here is the header "+ header)


          //Format the rest of the SQl statement based on whether there there is a 
          //tempId (device created event) associated with the event
          if (eventTempID =="") {
            //var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+eventID;
            var _sqlQ = 'SELECT '+_sql3+' FROM attendance WHERE EventID='+eventID;
            //console.log("here is the _sqlQ "+ _sqlQ)
                
                
                
              }else{
                //var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+eventID+' or EventID="'+eventTempID+'"'
                var _sqlQ = 'SELECT '+_sql3+' FROM attendance WHERE EventID='+eventID+' or EventID="'+eventTempID+'"'
                
              }  
                  //console.log(_sqlQ);
                  connection.query(_sqlQ, function(err, results) {
                    //connection.release();
                    if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
                    var eventID = eventID;
                    var eventName = "";
                    
                    if(results.length > 0){
                      
                      var eventName = results[0].EventName;
                      //pb 2017.09.15 remove slashes as they can be added to event name on the device (although not on command center) 
                      //###### Tue Dec 5 09:36:46 PST 2017 - Crashes if the name is blank
                      var cleanName = eventName.replace(/\//g, "-");
                      //###### Tue Feb 23 09:36:46 PST 2018 - Use time stamp so many copies of same report can be run
      
                      var _d = new Date();
                      var _u = _d.getTime();
                      //###### Tue Feb 28 09:36:46 PST 2018 - Use the user configured prefix
                      //var title='Attendance Report -- '+cleanName+"--"+_u;
                      var title=reportPrefix+' -- '+cleanName+"--"+_u;
                      
                      console.log("here is the full title of the report "+ title)
                      

                      //++++++++++++++++++++++++++++++++++++++++++++
                      //###### Sat Apr 28 18:17:55 CDT 2018 Give a descriptive name to the checkintype
                      if (checkInType =="YES"){
                        for (var j=0; j < results.length; j++) {                        
                          
                            if (results[j].CheckInType=="1") {
                              //Append the Results JSON array with the musterpointID                           
                                results[j].CheckInType = "Credential"
                                
                            } else if (results[j].CheckInType=="2") {
                              results[j].CheckInType = "Manual"

                            } else if (results[j].CheckInType=="3") {
                              results[j].CheckInType = "SMS"
                            
                            } else{
                              results[j].CheckInType = ""
                            }
                        }
                      }
                      //++++++++++++++++++++++++++++++++++++++++++++++

                    //++++++++++++++++++++++++++++++++++++++++++++++
                    //###### Sat Apr 28 18:17:55 CDT 2018 Get the descriptive name for the device

                    var _sqlQ1d = 'SELECT * from DeviceHeader';
                    connection.query(_sqlQ1d, function(err, resultsD) {

                      if (err){
                        //just log the error display the results we have
                        console.log("device name get error "+err)
                        connection.end();                      
                        
                      }else{

                        for (var i=0; i < results.length; i++) {
                          
                          for (var j=0; j < resultsD.length; j++) {
                  
                              if (results[i].DeviceAuthCode==resultsD[j].AuthCode) {
                                //Append the Results JSON array    
                                if (resultsD[j].name=="" || resultsD[j].name==null ){
                                  results[i].DeviceAuthCode = results[i].DeviceAuthCode
                                  
                                }else{
                                  results[i].DeviceAuthCode = resultsD[j].name
                                  
                                }                       
                                  
                              }
                              
                          }
                        }

                      }

                      // Do the rest of the report processing

                      //var title='Attendance Report -- '+cleanName;
                      var appPath = path.normalize(__dirname+'/..');
                      var rptPath = path.normalize(appPath+'/public/reports/');
                      //fs.open('./'+title+'.csv', 'wx', (err) => {
                      fs.open(rptPath+title+'.csv', 'wx', (err, fd) => {
                        if (err) {
                          if (err.code === "EEXIST") {
                            console.error('myfile already exists');
                            sess.rptSuccess = null;
                            //sess.rptError = "No report generated, file already exists in "+rptPath+".  To re-generate, delete the existing report first."
                            sess.rptError = "Report already exists";
                            connection.end();
                            //###### Sat Feb 25 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times 
                            callback(sess.rptError, sess.rptSuccess, title);
      
                            return;
                          } else {
                            throw err;
                          }
                        }
                    
                      var wstream = fs.createWriteStream(rptPath+title+'.csv');
                      
                      //###### Sat Feb 25 18:28:20 CDT 2018  Now doing this from the report format file above
                      //var header='Last Name'+','+ 'First Name'+','+'Employee ID'+','+'Attendance Date'+','+'Email'+','+'Time In'+','+'Time Out'+','+'Badge ID'+','+'Identifier'+','+'\n';
                      wstream.write(header);
                      wstream.write('\n');
                        
                      /**
                       * Add email to the report [plus identifier field], as per BCBS {for ACM} request.
                       * These fields are in the PEOPLE table, so i/o to the people table and then loop
                       * through the array to find the match on iClassNumber between the attendance table and
                       * the people tables results.
                       * 
                       */
             
                      var _sqlQ1 = 'SELECT EmailAddr, Identifier1, iClassNumber FROM people';
                      connection.query(_sqlQ1, function(err, results1) {
                        if(err) { console.log('email query bad'+err);}
      
                        //loop through the attendance records, finding the Email and Identifier fields
                        //and then writing out the report line
                        for (i=0; i<results.length; i++) {  
                          //###### Sat Apr 28 18:17:55 CDT 2018 Initialize email and identifier fields here, not before loop
                          var emailField=""
                          var identifier=""


                          //format the detail write line
                          detail =","

                          if (firstName == "YES"){detail=detail+results[i].FirstName+","}
                          if (lastName == "YES"){detail=detail+results[i].LastName+","}
                          if (inTIme == "YES"){detail=detail+results[i].InTIme+","}
                          if (outTIme == "YES"){detail=detail+results[i].OutTIme+","}
                          if (iClassNumber == "YES"){detail=detail+results[i].iClassNumber+","}
                          if (attendDate == "YES"){detail=detail+results[i].AttendDate+","}
                          if (inSeconds == "YES"){detail=detail+results[i].InSeconds+","}
                          if (outSeconds == "YES"){detail=detail+results[i].OutSeconds+","}
                          if (empID == "YES"){detail=detail+results[i].EmpID+","}
                          if (checkInType == "YES"){detail=detail+results[i].CheckInType+","}
                          if (mobSSOperator == "YES"){detail=detail+results[i].MobSSOperator+","}
                          if (devAuthCode == "YES"){detail=detail+results[i].DeviceAuthCode+","}
                          if (eventIdNum == "YES"){detail=detail+results[i].EventID+","}
      
                        // Populate the email and Identifier fields for the report output
                        // Initialize the index to null as comparison to "" below also caught 0
                            var index = null
                            for(var j = 0; j < results1.length; j++) {
                                 if(results1[j].iClassNumber === results[i].iClassNumber) {
                                   index = j;
                                 }
                              }
                          //populate the email and identifier fields if found, otherwise leave them blank
                          
                          //###### Sat Feb 28 18:28:20 CDT 2018  use null not "", as latter captures 0 too
                          //###### Sat Apr 28 18:17:55 CDT 2018 Print blanks on the report for null emails in the db
                          if (index != null){
                            if(results1[index].EmailAddr != null){emailField = results1[index].EmailAddr;}
                            if(results1[index].Identifier1 != null){ identifier = results1[index].Identifier1}
                          }
                          //if (index != ""){emailField = results1[index].EmailAddr; identifier = results1[index].Identifier1}
                          //###### Sat Feb 28 18:28:20 CDT 2018  Only do this if the user has requested email or identifier fields
                          if (emailAdd == "YES"){detail=detail+emailField+","}
                          if (identifierFld == "YES"){detail=detail+identifier+","}
      
                          console.log('results of array search '+emailField+' '+identifier)
                          
                          //###### Sat Feb 28 18:28:20 CDT 2018  Add leading empty column.  Makes logic simpler for format the header line that way.
                          //wstream.write(results[i].LastName+','+ results[i].FirstName+','+results[i].EmpID+','+results[i].AttendDate+','+emailField+','+results[i].InTIme+','+results[i].OutTIme+','+results[i].iClassNumber+','+identifier+'\n');
                          detail=detail+'\n'
                         
                          //wstream.write(','+results[i].LastName+','+ results[i].FirstName+','+results[i].EmpID+','+results[i].AttendDate+','+emailField+','+results[i].InTIme+','+results[i].OutTIme+','+results[i].iClassNumber+','+identifier+'\n');
                          
                          wstream.write(detail);
                          
                        }
                        // end the report once the loop is done but still inside the PEOPLE i/o Async
                        wstream.write('\n');
                        wstream.end();
                        
                        });
                      
                      
                      sess.rptError =null;
                      sess.rptSuccess =  'Report has been generated'
      
                      // Used an fs.open so need to close the file,  other functions close after operation but 
                      // with fs.open, we have to tidy up.  NOTE, added file decriptor object to the fs.open callback, 
                      // before i just had err in the callback
                      fs.close(fd, function(err){         
                        if (err){            
                          console.log(err);
                        }
                          console.log("File closed successfully.");
                          callback(sess.rptError, sess.rptSuccess, title);
                          //###### Sat Feb 28 18:28:20 CDT 2018 Moved email processsing out to events 

                          // email the user support if there is a problem connecting to the database
                          // Get the user's email, using the session username from log-in and their 
                          // email from the USERS db table
                        //   var userName= JSON.stringify(sess.username)
      
                        //   var _sqlQ1 = 'SELECT UserEmail FROM Users WHERE UserName='+userName;
                        //   connection.query(_sqlQ1, function(err, resultU) {
                        //     if(err) { console.log('email query bad'+err); connection.end();}
                        //     else{
                        //       console.log('user mail'+resultU[0].UserEmail)
                              
                        //       if (resultU[0].UserEmail !=""){
                        //         var fullFileName = title+'.csv'  
                        //         //###### Sat Feb 28 18:28:20 CDT 2018 User config report name prefix 
                        //         //emailController.sendAttendanceEmail('Attendance Report -- '+eventName, 'Please find Attendance Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
                        //         emailController.sendAttendanceEmail(reportPrefix+' -- '+cleanName, 'Please find Attendance Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
                        //         if (err) {
                        //           console.log('a problem occurred, attempting to email customer support')
                        //           //###### Sat Feb 28 18:28:20 CDT Try inside the callback as report downloading with empty detail lines
                        //           callback(sess.rptError, sess.rptSuccess, title);
                        //         }
                        //           //###### Sat Feb 28 18:28:20 CDT 2018 Try inside the callback as report downloading with empty detail lines
                        //           callback(sess.rptError, sess.rptSuccess, title);
                              
                        //         });
                        //         }
                        //         connection.end()
                        //         //###### Sat Feb 25 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times for 
                        //         //an event.  Neeed to pass the name back through the callbacks
                        //         //callback(sess.rptError, sess.rptSuccess, title);
      
                        //     }
                        // });
      
                        }); 
      
                    
                    });  //END of fs open




                  }) // deviceheader END

                      //++++++++++++++++++++++++++++++++++++++++++++++


                    //   //var title='Attendance Report -- '+cleanName;
                    //   var appPath = path.normalize(__dirname+'/..');
                    //   var rptPath = path.normalize(appPath+'/public/reports/');
                    //   //fs.open('./'+title+'.csv', 'wx', (err) => {
                    //   fs.open(rptPath+title+'.csv', 'wx', (err, fd) => {
                    //     if (err) {
                    //       if (err.code === "EEXIST") {
                    //         console.error('myfile already exists');
                    //         sess.rptSuccess = null;
                    //         //sess.rptError = "No report generated, file already exists in "+rptPath+".  To re-generate, delete the existing report first."
                    //         sess.rptError = "Report already exists";
                    //         connection.end();
                    //         //###### Sat Feb 25 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times 
                    //         callback(sess.rptError, sess.rptSuccess, title);
      
                    //         return;
                    //       } else {
                    //         throw err;
                    //       }
                    //     }
                    
                    //   var wstream = fs.createWriteStream(rptPath+title+'.csv');
                      
                    //   //###### Sat Feb 25 18:28:20 CDT 2018  Now doing this from the report format file above
                    //   //var header='Last Name'+','+ 'First Name'+','+'Employee ID'+','+'Attendance Date'+','+'Email'+','+'Time In'+','+'Time Out'+','+'Badge ID'+','+'Identifier'+','+'\n';
                    //   wstream.write(header);
                    //   wstream.write('\n');
                        
                    //   /**
                    //    * Add email to the report [plus identifier field], as per BCBS {for ACM} request.
                    //    * These fields are in the PEOPLE table, so i/o to the people table and then loop
                    //    * through the array to find the match on iClassNumber between the attendance table and
                    //    * the people tables results.
                    //    * 
                    //    */
             
                    //   var _sqlQ1 = 'SELECT EmailAddr, Identifier1, iClassNumber FROM people';
                    //   connection.query(_sqlQ1, function(err, results1) {
                    //     if(err) { console.log('email query bad'+err);}
      
                    //     //loop through the attendance records, finding the Email and Identifier fields
                    //     //and then writing out the report line
                    //     for (i=0; i<results.length; i++) {  
                    //       //###### Sat Apr 28 18:17:55 CDT 2018 Initialize email and identifier fields here, not before loop
                    //       var emailField=""
                    //       var identifier=""


                    //       //format the detail write line
                    //       detail =","

                    //       if (firstName == "YES"){detail=detail+results[i].FirstName+","}
                    //       if (lastName == "YES"){detail=detail+results[i].LastName+","}
                    //       if (inTIme == "YES"){detail=detail+results[i].InTIme+","}
                    //       if (outTIme == "YES"){detail=detail+results[i].OutTIme+","}
                    //       if (iClassNumber == "YES"){detail=detail+results[i].iClassNumber+","}
                    //       if (attendDate == "YES"){detail=detail+results[i].AttendDate+","}
                    //       if (inSeconds == "YES"){detail=detail+results[i].InSeconds+","}
                    //       if (outSeconds == "YES"){detail=detail+results[i].OutSeconds+","}
                    //       if (empID == "YES"){detail=detail+results[i].EmpID+","}
                    //       if (checkInType == "YES"){detail=detail+results[i].CheckInType+","}
                    //       if (mobSSOperator == "YES"){detail=detail+results[i].MobSSOperator+","}
                    //       if (devAuthCode == "YES"){detail=detail+results[i].DeviceAuthCode+","}
                    //       if (eventIdNum == "YES"){detail=detail+results[i].EventID+","}
      
                    //     // Populate the email and Identifier fields for the report output
                    //     // Initialize the index to null as comparison to "" below also caught 0
                    //         var index = null
                    //         for(var j = 0; j < results1.length; j++) {
                    //              if(results1[j].iClassNumber === results[i].iClassNumber) {
                    //                index = j;
                    //              }
                    //           }
                    //       //populate the email and identifier fields if found, otherwise leave them blank
                          
                    //       //###### Sat Feb 28 18:28:20 CDT 2018  use null not "", as latter captures 0 too
                    //       //###### Sat Apr 28 18:17:55 CDT 2018 Print blanks on the report for null emails in the db
                    //       if (index != null){
                    //         if(results1[index].EmailAddr != null){emailField = results1[index].EmailAddr;}
                    //         if(results1[index].Identifier1 != null){ identifier = results1[index].Identifier1}
                    //       }
                    //       //if (index != ""){emailField = results1[index].EmailAddr; identifier = results1[index].Identifier1}
                    //       //###### Sat Feb 28 18:28:20 CDT 2018  Only do this if the user has requested email or identifier fields
                    //       if (emailAdd == "YES"){detail=detail+emailField+","}
                    //       if (identifierFld == "YES"){detail=detail+identifier+","}
      
                    //       console.log('results of array search '+emailField+' '+identifier)
                          
                    //       //###### Sat Feb 28 18:28:20 CDT 2018  Add leading empty column.  Makes logic simpler for format the header line that way.
                    //       //wstream.write(results[i].LastName+','+ results[i].FirstName+','+results[i].EmpID+','+results[i].AttendDate+','+emailField+','+results[i].InTIme+','+results[i].OutTIme+','+results[i].iClassNumber+','+identifier+'\n');
                    //       detail=detail+'\n'
                         
                    //       //wstream.write(','+results[i].LastName+','+ results[i].FirstName+','+results[i].EmpID+','+results[i].AttendDate+','+emailField+','+results[i].InTIme+','+results[i].OutTIme+','+results[i].iClassNumber+','+identifier+'\n');
                          
                    //       wstream.write(detail);
                          
                    //     }
                    //     // end the report once the loop is done but still inside the PEOPLE i/o Async
                    //     wstream.write('\n');
                    //     wstream.end();
                        
                    //     });
                      
                      
                    //   sess.rptError =null;
                    //   sess.rptSuccess =  'Report has been generated'
      
                    //   // Used an fs.open so need to close the file,  other functions close after operation but 
                    //   // with fs.open, we have to tidy up.  NOTE, added file decriptor object to the fs.open callback, 
                    //   // before i just had err in the callback
                    //   fs.close(fd, function(err){         
                    //     if (err){            
                    //       console.log(err);
                    //     }
                    //       console.log("File closed successfully.");
                    //       callback(sess.rptError, sess.rptSuccess, title);
                    //       //###### Sat Feb 28 18:28:20 CDT 2018 Moved email processsing out to events 

                    //       // email the user support if there is a problem connecting to the database
                    //       // Get the user's email, using the session username from log-in and their 
                    //       // email from the USERS db table
                    //     //   var userName= JSON.stringify(sess.username)
      
                    //     //   var _sqlQ1 = 'SELECT UserEmail FROM Users WHERE UserName='+userName;
                    //     //   connection.query(_sqlQ1, function(err, resultU) {
                    //     //     if(err) { console.log('email query bad'+err); connection.end();}
                    //     //     else{
                    //     //       console.log('user mail'+resultU[0].UserEmail)
                              
                    //     //       if (resultU[0].UserEmail !=""){
                    //     //         var fullFileName = title+'.csv'  
                    //     //         //###### Sat Feb 28 18:28:20 CDT 2018 User config report name prefix 
                    //     //         //emailController.sendAttendanceEmail('Attendance Report -- '+eventName, 'Please find Attendance Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
                    //     //         emailController.sendAttendanceEmail(reportPrefix+' -- '+cleanName, 'Please find Attendance Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
                    //     //         if (err) {
                    //     //           console.log('a problem occurred, attempting to email customer support')
                    //     //           //###### Sat Feb 28 18:28:20 CDT Try inside the callback as report downloading with empty detail lines
                    //     //           callback(sess.rptError, sess.rptSuccess, title);
                    //     //         }
                    //     //           //###### Sat Feb 28 18:28:20 CDT 2018 Try inside the callback as report downloading with empty detail lines
                    //     //           callback(sess.rptError, sess.rptSuccess, title);
                              
                    //     //         });
                    //     //         }
                    //     //         connection.end()
                    //     //         //###### Sat Feb 25 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times for 
                    //     //         //an event.  Neeed to pass the name back through the callbacks
                    //     //         //callback(sess.rptError, sess.rptSuccess, title);
      
                    //     //     }
                    //     // });
      
                    //     }); 
      
                    
                    // });  //END of fs open
      
                    }else {
                      sess.rptSuccess = null;
                      sess.rptError = "No report generated."
                      connection.end();
                       //###### Sat Feb 25 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times
                      callback(sess.rptError, sess.rptSuccess, null);
                      return;
                      //res.render('eventAttendance', { title: 'Command Center - Attendance', results : results, eventID : eventID, eventName : eventName, rptSuccess : sess.rptSuccess, rptError : sess.rptError});
                    };
                  });
           
 }; //feb--end of else in csvParser
}); //feb--end of csvParser 

});
  
  
  
    
};


///////////////////////////////////////////
// Report of all Card scans for a badge
///////////////////////////////////////////

// handler displaying the cardscan records for a particular badge
module.exports.writeCardscanReport = function(connection, badgeID, callback) {
  console.error('im in the cardscan write handler: '+ badgeID);

          
      var _sqlQ = 'SELECT * FROM verifyrecords WHERE BadgeID='+badgeID;
            console.log(_sqlQ);
            connection.query(_sqlQ, function(err, results) {
              //connection.release();
              console.log('full set of VR results are: ' + JSON.stringify(results));
              if(err) { console.log('verifyrecords query bad'+err); callback(true); connection.end(); return; }

              if(results.length > 0){
                var empID = results[0].EmpID;
                
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!
                var yy = today.getFullYear();

                today = mm+'-'+dd+'-'+yy;
               
                var title='Cardscan Report - Generated '+today+'- for BadgeID '+badgeID;
                var appPath = path.normalize(__dirname+'/..');
                var rptPath = path.normalize(appPath+'/public/reports/');
                //fs.open('./'+title+'.csv', 'wx', (err) => {
                fs.open(rptPath+title+'.csv', 'wx', (err, fd) => {
                  if (err) {
                    if (err.code === "EEXIST") {
                      console.error('myfile already exists');
                      sess.rptSuccess = null;
                      //sess.rptError = "No report generated, file already exists in "+rptPath+".  To re-generate, delete the existing report first."
                      sess.rptError = "Report already exists";

                      connection.end();
                      callback(sess.rptError, sess.rptSuccess);

                      return;
                    } else {
                      throw err;
                    }
                  }
              
                var wstream = fs.createWriteStream(rptPath+title+'.csv');

                var header='Scan Time'+','+'Employee ID'+','+'Result'+','+'Reader'+','+'Operator'+'\n';
          
                wstream.write(header);
                wstream.write('\n');


                for (i=0; i<results.length; i++) {
                  //console.log('the reporter results length is '+results.length);
                  //console.log('wstream data :'+results[i].ScanDateTime);
                  var resultField = null;
                  if (results[i].result == '1') {resultField = "Approved"}else{resultField="Denied"}

                  wstream.write(results[i].ScanDateTime+','+results[i].EmpID+','+resultField+','+results[i].ClientSWID+','+results[i].MobSSOperator+'\n');
                }
                wstream.write('\n');
                wstream.end();
                sess.rptError =null;
                //sess.rptSuccess = "'"+title+'.csv'+"'"+ ' has been generated in location '+rptPath;
                sess.rptSuccess =  'Report has been generated'
                connection.end();
                
                // Used an fs.open so need to close the file,  other functions close after operation but 
                // with fs.open, we have to tidy up.  NOTE, added file decriptor object to the fs.open callback, 
                // before i just had err in the callback
                fs.close(fd, function(err){         
                  if (err){            
                    console.log("Error: Unsuccessful file close  "+err);
                  }
                    //console.log("File closed successfully.");
                    callback(sess.rptError, sess.rptSuccess);
                    
                  }); 

                
              });  //END of fs open

              }else {
                sess.rptSuccess = null;
                sess.rptError = "No report generated."
                connection.end();
                callback(sess.rptError, sess.rptSuccess);
                return;
              };
            });
    
 
};

////////////////////////////////////////////////////
// Report of all Mustering Check Ins for an Event //
////////////////////////////////////////////////////
// module.exports.writeMusteringReport = function(connection, eventID, eventTempID, callback) {

           
//             var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+eventID;
//             console.log(_sqlQ);
//             connection.query(_sqlQ, function(err, results) {
//               //connection.release();
//               if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
//               var eventID = eventID;
//               var eventName = "";
//               if(results.length > 0){
//                 var eventName = results[0].EventName;
//                 //pb 2017.09.15 remove slashes as they can be added to event name on the device (although not on command center)
//                 var cleanName = eventName.replace(/\//g, "-");
//                 var title='Mustering Report -- '+cleanName;
//                 var appPath = path.normalize(__dirname+'/..');
//                 var rptPath = path.normalize(appPath+'/public/reports/');
//                 //fs.open('./'+title+'.csv', 'wx', (err) => {
//                 fs.open(rptPath+title+'.csv', 'wx', (err, fd) => {
//                   if (err) {
//                     if (err.code === "EEXIST") {
//                       console.error('myfile already exists');
//                       sess.rptSuccess = null;
//                       //sess.rptError = "No report generated, file already exists in "+rptPath+".  To re-generate, delete the existing report first."
//                       sess.rptError = "Report already exists";
//                       connection.end();
//                       callback(sess.rptError, sess.rptSuccess);

//                       return;
//                     } else {
//                       throw err;
//                     }
//                   }
              
//                 var wstream = fs.createWriteStream(rptPath+title+'.csv');
                  
//           /**
//            * Add email to the report [plus identifier field], as per BCBS {for ACM} request.
//            * These fields are in the PEOPLE table, so i/o to the people table and then loop
//            * through the array to find the match on iClassNumber between the attendance table and
//            * the people tables results.
//            */

          
//                 var header='Last Name'+','+ 'First Name'+','+'Employee ID'+','+'Muster Date'+','+'Email'+','+'Time In'+','+'Time Out'+','+'Badge ID'+','+'Identifier'+','+'\n';
          
//                 wstream.write(header);
//                 wstream.write('\n');
//                 var emailField=""
//                 var index = ""
//                 var identifier=""


//                 var _sqlQ1 = 'SELECT EmailAddr, Identifier1, iClassNumber FROM people';
//                 connection.query(_sqlQ1, function(err, results1) {
//                   if(err) { console.log('email query bad'+err);}

//                   //loop through the attendance records, finding the Email and Identifier fields
//                   //and then writing out the report line
//                   for (i=0; i<results.length; i++) {  

//                   // Populate the email and Identifier fields for the report output

//                       for(var j = 0; j < results1.length; j++) {
//                            if(results1[j].iClassNumber === results[i].iClassNumber) {
//                              index = j;
//                            }
//                         }
//                     //populate the email and identifier fields if found, otherwise leave them blank
//                     if (index != ""){emailField = results1[index].EmailAddr; identifier = results1[index].Identifier1}

//                     console.log('results of array search '+emailField+' '+identifier)

//                     wstream.write(results[i].LastName+','+ results[i].FirstName+','+results[i].EmpID+','+results[i].AttendDate+','+emailField+','+results[i].InTIme+','+results[i].OutTIme+','+results[i].iClassNumber+','+identifier+'\n');

//                   }
//                   // end the report once the loop is done but still inside the PEOPLE i/o Async
//                   wstream.write('\n');
//                   wstream.end();
                  
//                   });
                
                
//                 sess.rptError =null;
//                 sess.rptSuccess =  'Report has been generated'

//                 // Used an fs.open so need to close the file,  other functions close after operation but 
//                 // with fs.open, we have to tidy up.  NOTE, added file decriptor object to the fs.open callback, 
//                 // before i just had err in the callback
//                 fs.close(fd, function(err){         
//                   if (err){            
//                     console.log(err);
//                   }
//                     console.log("File closed successfully.");
//                     // email the user support if there is a problem connecting to the database
//                     // Get the user's email, using the session username from log-in and their 
//                     // email from the USERS db table
//                     var userName= JSON.stringify(sess.username)

//                     var _sqlQ1 = 'SELECT UserEmail FROM Users WHERE UserName='+userName;
//                     connection.query(_sqlQ1, function(err, resultU) {
//                       if(err) { console.log('email query bad'+err); connection.end();}
//                       else{
//                         if (resultU[0].UserEmail !=""){
//                           console.log('inside the email loop?'+ JSON.stringify(resultU[0].UserEmail))
//                           var fullFileName = title+'.csv'  
//                           emailController.sendAttendanceEmail('Mustering Report -- '+eventName, 'Please find Mustering Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
//                           if (err) {console.log('a problem occurred, attempting to email customer support')}
//                           });
//                           }
//                           connection.end()
//                           callback(sess.rptError, sess.rptSuccess);

//                       }

//                   });
//                   }); 

              
//               });  //END of fs open

//               }else {
//                 sess.rptSuccess = null;
//                 sess.rptError = "No report generated."
//                 connection.end();
//                 callback(sess.rptError, sess.rptSuccess);
//                 return;
//                 //res.render('eventAttendance', { title: 'Command Center - Attendance', results : results, eventID : eventID, eventName : eventName, rptSuccess : sess.rptSuccess, rptError : sess.rptError});
//               };
//             });
    
// };


////++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//###### Sat Feb 28 18:31:35 CDT 2018 This has been significantly refactored to allow for user config of report
/////////////////////////////////////////////////
// Report of all Muster activity for a muster //
////////////////////////////////////////////////
//###### Sat Oct 28 18:31:35 CDT 2017 Added a parm and processing for attendance from device generated events
//###### Sat Feb 28 18:31:35 CDT 2018 Report format is pulled from user config (csv file)
//###### Sat Apr 17 18:31:35 CDT 2018 Process new field for Device Auth Code
//###### Sat Apr 28 18:17:55 CDT 2018 TODO --- MOVED TO COMMON MODULE

module.exports.writeMusteringReport = function(connection, eventID, eventTempID, callback) {
  
    //Read the report configuration file, which is in the root directory
    //and then parse it.   
    fs.readFile('./attRpt.csv', {
          encoding: 'utf-8'
        }, function(err, csvData) {
              if (err) {
              sess.error = 'File not found.  Please check directory and file name.';
              callback(err, null);
              }
  
        csvParser(csvData, {
          delimiter: ',',
          escape: "'"
          //columns: true
          }, function(err, data) {
            if (err) {
          console.log(err);
              sess.error = 'csv file problem -- '+err;
              callback(err, null);
          } else {
              
            // Initialize the fields for retrieval to just the mandatory ones
            var _sql3 = "EventName"
  
            //Initialise the header string
            var header=''+','
            var detail=''+','
            
            
            // This is what the attendance table looks like
            // +---------------+-------------+------+-----+---------+-------+
            // | Field         | Type        | Null | Key | Default | Extra |
            // +---------------+-------------+------+-----+---------+-------+
            // | MobSSID       | int(11)     | YES  |     | NULL    |       |
            // | FirstName     | varchar(25) | YES  | MUL | NULL    |       |
            // | LastName      | varchar(25) | YES  | MUL | NULL    |       |
            // | InTIme        | varchar(20) | YES  |     | NULL    |       |
            // | OutTIme       | varchar(20) | YES  |     | NULL    |       |
            // | EventID       | varchar(25) | YES  |     | NULL    |       |
            // | EventName     | varchar(40) | YES  |     | NULL    |       |
            // | iClassNumber  | bigint(20)  | YES  | MUL | NULL    |       |
            // | AttendDate    | varchar(20) | YES  |     | NULL    |       |
            // | InSeconds     | varchar(20) | YES  |     | NULL    |       |
            // | OutSeconds    | varchar(20) | YES  |     | NULL    |       |
            // | EmpID         | varchar(40) | YES  |     | NULL    |       |
            // | RecordStatus  | varchar(10) | YES  |     | NULL    |       |
            // | MobSSOperator | varchar(40) | YES  |     | NULL    |       |
            // | DeviceAuthCode| varchar(40) | YES  |     | NULL    |       |
            // | CheckInType   | varchar(4)  | YES  |     | NULL    |       |
            // +---------------+-------------+------+-----+---------+-------+
           
            //read the fields from the report format file
            var firstNameKey = data[0][0];
            var firstName = data[0][1];
            var lastNameKey = data[1][0];
            var lastName = data[1][1];
            var inTImeKey = data[2][0];
            var inTIme = data[2][1];
            var outTImeKey = data[3][0];
            var outTIme = data[3][1];
            var iClassNumberKey = data[4][0];
            var iClassNumber = data[4][1];
            var attendDateKey = data[5][0];
            var attendDate = data[5][1];
            var inSecondsKey = data[6][0];
            var inSeconds = data[6][1];
            var outSecondsKey = data[7][0];
            var outSeconds = data[7][1];
            var empIDKey = data[8][0];
            var empID = data[8][1];
            var mobSSOperatorKey = data[9][0];
            var mobSSOperator = data[9][1];
            var eventIdNumKey = data[10][0];
            var eventIdNum = data[10][1];
            var emailAddKey = data[11][0];
            var emailAdd = data[11][1];
            var identifierFldKey = data[12][0];
            var identifierFld = data[12][1];
            var reportPrefix = data[13][1];
            var devAuthCodeKey = data[14][0];
            var devAuthCode = data[14][1];
            var checkInTypeKey = data[15][0];
            var checkInType = data[15][1];
            
            //Create the rest of the SQL statement field list based on the 
            //the report format file
            if (firstName == "YES"){_sql3=_sql3+","+firstNameKey, header=header+firstNameKey+","}
            if (lastName == "YES"){_sql3=_sql3+","+lastNameKey, header=header+lastNameKey+","}
            if (inTIme == "YES"){_sql3=_sql3+","+inTImeKey, header=header+inTImeKey+","}
            if (outTIme == "YES"){_sql3=_sql3+","+outTImeKey, header=header+outTImeKey+","}
            if (iClassNumber == "YES"){_sql3=_sql3+","+iClassNumberKey, header=header+"BadgeNumber"+","}
            if (attendDate == "YES"){_sql3=_sql3+","+attendDateKey, header=header+attendDateKey+","}
            if (inSeconds == "YES"){_sql3=_sql3+","+inSecondsKey, header=header+inSecondsKey+","}
            if (outSeconds == "YES"){_sql3=_sql3+","+outSecondsKey, header=header+outSecondsKey+","}
            if (empID == "YES"){_sql3=_sql3+","+empIDKey, header=header+empIDKey+","}
            if (checkInType == "YES"){_sql3=_sql3+","+checkInTypeKey, header=header+checkInTypeKey+","}
            if (mobSSOperator == "YES"){_sql3=_sql3+","+mobSSOperatorKey, header=header+mobSSOperatorKey+","}
            if (devAuthCode == "YES"){_sql3=_sql3+","+devAuthCodeKey, header=header+devAuthCodeKey+","}
            if (eventIdNum == "YES"){_sql3=_sql3+","+eventIdNumKey, header=header+eventIdNumKey+","}
            if (emailAdd == "YES"){header=header+emailAddKey+","}
            if (identifierFld == "YES"){header=header+identifierFldKey+","}
            
            header = header+'\n'
            //var header='Last Name'+','+ 'First Name'+','+'Employee ID'+','+'Attendance Date'+','+'Email'+','+'Time In'+','+'Time Out'+','+'Badge ID'+','+'Identifier'+','+'\n';
            console.log("here is the header "+ header)
  
  
            //Format the rest of the SQl statement based on whether there there is a 
            //tempId (device created event) associated with the event
            if (eventTempID =="") {
              //var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+eventID;
              var _sqlQ = 'SELECT '+_sql3+' FROM attendance WHERE EventID='+eventID;
              //console.log("here is the _sqlQ "+ _sqlQ)
                  
                  
                  
                }else{
                  //var _sqlQ = 'SELECT * FROM attendance WHERE EventID='+eventID+' or EventID="'+eventTempID+'"'
                  var _sqlQ = 'SELECT '+_sql3+' FROM attendance WHERE EventID='+eventID+' or EventID="'+eventTempID+'"'
                  
                }  
                    //console.log(_sqlQ);
                    connection.query(_sqlQ, function(err, results) {
                      //connection.release();
                      if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
                      var eventID = eventID;
                      var eventName = "";
                      
                      if(results.length > 0){
                        
                        var eventName = results[0].EventName;
                        //pb 2017.09.15 remove slashes as they can be added to event name on the device (although not on command center) 
                        //###### Tue Dec 5 09:36:46 PST 2017 - Crashes if the name is blank
                        var cleanName = eventName.replace(/\//g, "-");
                        //###### Tue Feb 23 09:36:46 PST 2018 - Use time stamp so many copies of same report can be run
        
                        var _d = new Date();
                        var _u = _d.getTime();
                        //###### Tue Feb 28 09:36:46 PST 2018 - Use the user configured prefix
                        var title='Mustering Report -- '+cleanName+"--"+_u;
                        //var title=reportPrefix+' -- '+cleanName+"--"+_u;
                        
                        console.log("here is the full title of the MUSTERING report "+ title)


                        //++++++++++++++++++++++++++++++++++++++++++++
                        //###### Sat Apr 28 18:17:55 CDT 2018 Give a descriptive name to the checkintype
                        if (checkInType =="YES"){
                          for (var j=0; j < results.length; j++) {                        
                            
                              if (results[j].CheckInType=="1") {
                                //Append the Results JSON array with the musterpointID                           
                                  results[j].CheckInType = "Credential"
                                  
                              } else if (results[j].CheckInType=="2") {
                                results[j].CheckInType = "Manual"

                              } else if (results[j].CheckInType=="3") {
                                results[j].CheckInType = "SMS"
                              
                              } else{
                                results[j].CheckInType = ""
                              }
                          }
                        }
                        //+++++++++++++++++++++++++++++++++++++++++++++



                    //++++++++++++++++++++++++++++++++++++++++++++++
                    //###### Sat Apr 28 18:17:55 CDT 2018 Get the descriptive name for the device

                    var _sqlQ1d = 'SELECT * from DeviceHeader';
                    connection.query(_sqlQ1d, function(err, resultsD) {

                      if (err){
                        //just log the error display the results we have
                        console.log("device name get error "+err)
                        connection.end();                      
                        
                      }else{

                        for (var i=0; i < results.length; i++) {
                          
                          for (var j=0; j < resultsD.length; j++) {
                  
                              if (results[i].DeviceAuthCode==resultsD[j].AuthCode) {
                                //Append the Results JSON array    
                                if (resultsD[j].name=="" || resultsD[j].name==null ){
                                  results[i].DeviceAuthCode = results[i].DeviceAuthCode
                                  
                                }else{
                                  results[i].DeviceAuthCode = resultsD[j].name
                                  
                                }                       
                                  
                              }
                              
                          }
                        }

                      }

                      // Do the rest of the report processing

                      //var title='Attendance Report -- '+cleanName;
                      var appPath = path.normalize(__dirname+'/..');
                      var rptPath = path.normalize(appPath+'/public/reports/');
                      //fs.open('./'+title+'.csv', 'wx', (err) => {
                      fs.open(rptPath+title+'.csv', 'wx', (err, fd) => {
                        if (err) {
                          if (err.code === "EEXIST") {
                            console.error('myfile already exists');
                            sess.rptSuccess = null;
                            //sess.rptError = "No report generated, file already exists in "+rptPath+".  To re-generate, delete the existing report first."
                            sess.rptError = "Report already exists";
                            connection.end();
                            //###### Sat Feb 25 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times 
                            callback(sess.rptError, sess.rptSuccess, title);
      
                            return;
                          } else {
                            throw err;
                          }
                        }
                    
                      var wstream = fs.createWriteStream(rptPath+title+'.csv');
                      
                      //###### Sat Feb 25 18:28:20 CDT 2018  Now doing this from the report format file above
                      //var header='Last Name'+','+ 'First Name'+','+'Employee ID'+','+'Attendance Date'+','+'Email'+','+'Time In'+','+'Time Out'+','+'Badge ID'+','+'Identifier'+','+'\n';
                      wstream.write(header);
                      wstream.write('\n');
                        
                      /**
                       * Add email to the report [plus identifier field], as per BCBS {for ACM} request.
                       * These fields are in the PEOPLE table, so i/o to the people table and then loop
                       * through the array to find the match on iClassNumber between the attendance table and
                       * the people tables results.
                       * 
                       */
             
                      var _sqlQ1 = 'SELECT EmailAddr, Identifier1, iClassNumber FROM people';
                      connection.query(_sqlQ1, function(err, results1) {
                        if(err) { console.log('email query bad'+err);}
      
                        //loop through the attendance records, finding the Email and Identifier fields
                        //and then writing out the report line
                        for (i=0; i<results.length; i++) {  
                          //###### Sat Apr 28 18:17:55 CDT 2018 Initialize email and identifier fields here, not before loop
                          var emailField=""
                          var identifier=""


                          //format the detail write line
                          detail =","

                          if (firstName == "YES"){detail=detail+results[i].FirstName+","}
                          if (lastName == "YES"){detail=detail+results[i].LastName+","}
                          if (inTIme == "YES"){detail=detail+results[i].InTIme+","}
                          if (outTIme == "YES"){detail=detail+results[i].OutTIme+","}
                          if (iClassNumber == "YES"){detail=detail+results[i].iClassNumber+","}
                          if (attendDate == "YES"){detail=detail+results[i].AttendDate+","}
                          if (inSeconds == "YES"){detail=detail+results[i].InSeconds+","}
                          if (outSeconds == "YES"){detail=detail+results[i].OutSeconds+","}
                          if (empID == "YES"){detail=detail+results[i].EmpID+","}
                          if (checkInType == "YES"){detail=detail+results[i].CheckInType+","}
                          if (mobSSOperator == "YES"){detail=detail+results[i].MobSSOperator+","}
                          if (devAuthCode == "YES"){detail=detail+results[i].DeviceAuthCode+","}
                          if (eventIdNum == "YES"){detail=detail+results[i].EventID+","}
      
                        // Populate the email and Identifier fields for the report output
                        // Initialize the index to null as comparison to "" below also caught 0
                            var index = null
                            for(var j = 0; j < results1.length; j++) {
                                 if(results1[j].iClassNumber === results[i].iClassNumber) {
                                   index = j;
                                 }
                              }
                          //populate the email and identifier fields if found, otherwise leave them blank
                          
                          //###### Sat Feb 28 18:28:20 CDT 2018  use null not "", as latter captures 0 too
                          //###### Sat Apr 28 18:17:55 CDT 2018 Print blanks on the report for null emails in the db
                          if (index != null){
                            if(results1[index].EmailAddr != null){emailField = results1[index].EmailAddr;}
                            if(results1[index].Identifier1 != null){ identifier = results1[index].Identifier1}
                          }
                          //if (index != ""){emailField = results1[index].EmailAddr; identifier = results1[index].Identifier1}
                          //###### Sat Feb 28 18:28:20 CDT 2018  Only do this if the user has requested email or identifier fields
                          if (emailAdd == "YES"){detail=detail+emailField+","}
                          if (identifierFld == "YES"){detail=detail+identifier+","}
      
                          console.log('results of array search '+emailField+' '+identifier)
                          
                          //###### Sat Feb 28 18:28:20 CDT 2018  Add leading empty column.  Makes logic simpler for format the header line that way.
                          //wstream.write(results[i].LastName+','+ results[i].FirstName+','+results[i].EmpID+','+results[i].AttendDate+','+emailField+','+results[i].InTIme+','+results[i].OutTIme+','+results[i].iClassNumber+','+identifier+'\n');
                          detail=detail+'\n'
                         
                          //wstream.write(','+results[i].LastName+','+ results[i].FirstName+','+results[i].EmpID+','+results[i].AttendDate+','+emailField+','+results[i].InTIme+','+results[i].OutTIme+','+results[i].iClassNumber+','+identifier+'\n');
                          
                          wstream.write(detail);
                          
                        }
                        // end the report once the loop is done but still inside the PEOPLE i/o Async
                        wstream.write('\n');
                        wstream.end();
                        
                        });
                      
                      
                      sess.rptError =null;
                      sess.rptSuccess =  'Report has been generated'
      
                      // Used an fs.open so need to close the file,  other functions close after operation but 
                      // with fs.open, we have to tidy up.  NOTE, added file decriptor object to the fs.open callback, 
                      // before i just had err in the callback
                      fs.close(fd, function(err){         
                        if (err){            
                          console.log(err);
                        }
                          console.log("File closed successfully.");
                          callback(sess.rptError, sess.rptSuccess, title);
                          //###### Sat Feb 28 18:28:20 CDT 2018 Moved email processsing out to events 

                          // email the user support if there is a problem connecting to the database
                          // Get the user's email, using the session username from log-in and their 
                          // email from the USERS db table
                        //   var userName= JSON.stringify(sess.username)
      
                        //   var _sqlQ1 = 'SELECT UserEmail FROM Users WHERE UserName='+userName;
                        //   connection.query(_sqlQ1, function(err, resultU) {
                        //     if(err) { console.log('email query bad'+err); connection.end();}
                        //     else{
                        //       console.log('user mail'+resultU[0].UserEmail)
                              
                        //       if (resultU[0].UserEmail !=""){
                        //         var fullFileName = title+'.csv'  
                        //         //###### Sat Feb 28 18:28:20 CDT 2018 User config report name prefix 
                        //         //emailController.sendAttendanceEmail('Attendance Report -- '+eventName, 'Please find Attendance Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
                        //         emailController.sendAttendanceEmail(reportPrefix+' -- '+cleanName, 'Please find Attendance Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
                        //         if (err) {
                        //           console.log('a problem occurred, attempting to email customer support')
                        //           //###### Sat Feb 28 18:28:20 CDT Try inside the callback as report downloading with empty detail lines
                        //           callback(sess.rptError, sess.rptSuccess, title);
                        //         }
                        //           //###### Sat Feb 28 18:28:20 CDT 2018 Try inside the callback as report downloading with empty detail lines
                        //           callback(sess.rptError, sess.rptSuccess, title);
                              
                        //         });
                        //         }
                        //         connection.end()
                        //         //###### Sat Feb 25 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times for 
                        //         //an event.  Neeed to pass the name back through the callbacks
                        //         //callback(sess.rptError, sess.rptSuccess, title);
      
                        //     }
                        // });
      
                        }); 
      
                    
                    });  //END of fs open




                  }) // deviceheader END

                      //++++++++++++++++++++++++++++++++++++++++++++++

                        
                      //   //var title='Attendance Report -- '+cleanName;
                      //   var appPath = path.normalize(__dirname+'/..');
                      //   var rptPath = path.normalize(appPath+'/public/reports/');
                      //   //fs.open('./'+title+'.csv', 'wx', (err) => {
                      //   fs.open(rptPath+title+'.csv', 'wx', (err, fd) => {
                      //     if (err) {
                      //       if (err.code === "EEXIST") {
                      //         console.error('myfile already exists');
                      //         sess.rptSuccess = null;
                      //         //sess.rptError = "No report generated, file already exists in "+rptPath+".  To re-generate, delete the existing report first."
                      //         sess.rptError = "Report already exists";
                      //         connection.end();
                      //         //###### Sat Feb 25 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times 
                      //         callback(sess.rptError, sess.rptSuccess, title);
        
                      //         return;
                      //       } else {
                      //         throw err;
                      //       }
                      //     }
                      
                      //   var wstream = fs.createWriteStream(rptPath+title+'.csv');
                        
                      //   //###### Sat Feb 25 18:28:20 CDT 2018  Now doing this from the report format file above
                      //   //var header='Last Name'+','+ 'First Name'+','+'Employee ID'+','+'Attendance Date'+','+'Email'+','+'Time In'+','+'Time Out'+','+'Badge ID'+','+'Identifier'+','+'\n';
                      //   wstream.write(header);
                      //   wstream.write('\n');
                          
                      //   /**
                      //    * Add email to the report [plus identifier field], as per BCBS {for ACM} request.
                      //    * These fields are in the PEOPLE table, so i/o to the people table and then loop
                      //    * through the array to find the match on iClassNumber between the attendance table and
                      //    * the people tables results.
                      //    * 
                      //    */
               
                        
        
                      //   var _sqlQ1 = 'SELECT EmailAddr, Identifier1, iClassNumber FROM people';
                      //   connection.query(_sqlQ1, function(err, results1) {
                      //     if(err) { console.log('email query bad'+err);}
        
                      //     //loop through the attendance records, finding the Email and Identifier fields
                      //     //and then writing out the report line
                      //     for (i=0; i<results.length; i++) {  

                      //       var emailField=""
                      //       var identifier=""
  
                      //       //format the detail write line
                      //       detail =","
  
                      //       if (firstName == "YES"){detail=detail+results[i].FirstName+","}
                      //       if (lastName == "YES"){detail=detail+results[i].LastName+","}
                      //       if (inTIme == "YES"){detail=detail+results[i].InTIme+","}
                      //       if (outTIme == "YES"){detail=detail+results[i].OutTIme+","}
                      //       if (iClassNumber == "YES"){detail=detail+results[i].iClassNumber+","}
                      //       if (attendDate == "YES"){detail=detail+results[i].AttendDate+","}
                      //       if (inSeconds == "YES"){detail=detail+results[i].InSeconds+","}
                      //       if (outSeconds == "YES"){detail=detail+results[i].OutSeconds+","}
                      //       if (empID == "YES"){detail=detail+results[i].EmpID+","}
                      //       if (checkInType == "YES"){detail=detail+results[i].CheckInType+","}                            
                      //       if (mobSSOperator == "YES"){detail=detail+results[i].MobSSOperator+","}
                      //       if (devAuthCode == "YES"){detail=detail+results[i].DeviceAuthCode+","}
                      //       if (eventIdNum == "YES"){detail=detail+results[i].EventID+","}
        
                      //     // Populate the email and Identifier fields for the report output
                      //     // Initialize the index to null as comparison to "" below also caught 0
                      //         var index = null
                      //         for(var j = 0; j < results1.length; j++) {
                      //              if(results1[j].iClassNumber === results[i].iClassNumber) {
                      //                index = j;
                      //              }
                      //           }
                      //       //populate the email and identifier fields if found, otherwise leave them blank
                            
                      //       //###### Sat Feb 28 18:28:20 CDT 2018  use null not "", as latter captures 0 too
                      //       //if (index != null){emailField = results1[index].EmailAddr; identifier = results1[index].Identifier1}
                      //       //if (index != ""){emailField = results1[index].EmailAddr; identifier = results1[index].Identifier1}
                      //       //###### Sat Apr 28 18:17:55 CDT 2018 Print blanks on the report for null emails in the db
                      //       if (index != null){
                      //         if(results1[index].EmailAddr != null){emailField = results1[index].EmailAddr;}
                      //         if(results1[index].Identifier1 != null){ identifier = results1[index].Identifier1}
                      //       }
                      //       //###### Sat Feb 28 18:28:20 CDT 2018  Only do this if the user has requested email or identifier fields
                      //       if (emailAdd == "YES"){detail=detail+emailField+","}
                      //       if (identifierFld == "YES"){detail=detail+identifier+","}
        
                      //       console.log('results of array search '+emailField+' '+identifier)
                            
                      //       //###### Sat Feb 28 18:28:20 CDT 2018  Add leading empty column.  Makes logic simpler for format the header line that way.
                      //       //wstream.write(results[i].LastName+','+ results[i].FirstName+','+results[i].EmpID+','+results[i].AttendDate+','+emailField+','+results[i].InTIme+','+results[i].OutTIme+','+results[i].iClassNumber+','+identifier+'\n');
                      //       detail=detail+'\n'
                           
                      //       //wstream.write(','+results[i].LastName+','+ results[i].FirstName+','+results[i].EmpID+','+results[i].AttendDate+','+emailField+','+results[i].InTIme+','+results[i].OutTIme+','+results[i].iClassNumber+','+identifier+'\n');
                            
                      //       wstream.write(detail);
                            
                      //     }
                      //     // end the report once the loop is done but still inside the PEOPLE i/o Async
                      //     wstream.write('\n');
                      //     wstream.end();
                          
                      //     });
                        
                        
                      //   sess.rptError =null;
                      //   sess.rptSuccess =  'Report has been generated'
        
                      //   // Used an fs.open so need to close the file,  other functions close after operation but 
                      //   // with fs.open, we have to tidy up.  NOTE, added file decriptor object to the fs.open callback, 
                      //   // before i just had err in the callback
                      //   fs.close(fd, function(err){         
                      //     if (err){            
                      //       console.log(err);
                      //     }
                      //       console.log("File closed successfully.");
                      //       callback(sess.rptError, sess.rptSuccess, title);
                      //       //###### Sat Feb 28 18:28:20 CDT 2018 Moved email processsing out to events 
  
                      //       // email the user support if there is a problem connecting to the database
                      //       // Get the user's email, using the session username from log-in and their 
                      //       // email from the USERS db table
                      //     //   var userName= JSON.stringify(sess.username)
        
                      //     //   var _sqlQ1 = 'SELECT UserEmail FROM Users WHERE UserName='+userName;
                      //     //   connection.query(_sqlQ1, function(err, resultU) {
                      //     //     if(err) { console.log('email query bad'+err); connection.end();}
                      //     //     else{
                      //     //       console.log('user mail'+resultU[0].UserEmail)
                                
                      //     //       if (resultU[0].UserEmail !=""){
                      //     //         var fullFileName = title+'.csv'  
                      //     //         //###### Sat Feb 28 18:28:20 CDT 2018 User config report name prefix 
                      //     //         //emailController.sendAttendanceEmail('Attendance Report -- '+eventName, 'Please find Attendance Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
                      //     //         emailController.sendAttendanceEmail(reportPrefix+' -- '+cleanName, 'Please find Attendance Report attached.', resultU[0].UserEmail, fullFileName, function(err,reslt){
                      //     //         if (err) {
                      //     //           console.log('a problem occurred, attempting to email customer support')
                      //     //           //###### Sat Feb 28 18:28:20 CDT Try inside the callback as report downloading with empty detail lines
                      //     //           callback(sess.rptError, sess.rptSuccess, title);
                      //     //         }
                      //     //           //###### Sat Feb 28 18:28:20 CDT 2018 Try inside the callback as report downloading with empty detail lines
                      //     //           callback(sess.rptError, sess.rptSuccess, title);
                                
                      //     //         });
                      //     //         }
                      //     //         connection.end()
                      //     //         //###### Sat Feb 25 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times for 
                      //     //         //an event.  Neeed to pass the name back through the callbacks
                      //     //         //callback(sess.rptError, sess.rptSuccess, title);
        
                      //     //     }
                      //     // });
        
                      //     }); 
        
                      
                      // });  //END of fs open
        
                      }else {
                        sess.rptSuccess = null;
                        sess.rptError = "No report generated."
                        connection.end();
                         //###### Sat Feb 25 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times
                        callback(sess.rptError, sess.rptSuccess, null);
                        return;
                        //res.render('eventAttendance', { title: 'Command Center - Attendance', results : results, eventID : eventID, eventName : eventName, rptSuccess : sess.rptSuccess, rptError : sess.rptError});
                      };
                    });
             
   }; //feb--end of else in csvParser
  }); //feb--end of csvParser 
  
  });
    
    
    
      
  };


 
///////////////////////////////////////////////////
// Report of all activity for a muster or meeting//
//////////////////////////////////////////////////
//###### Sat Oct 28 18:31:35 CDT 2017 Added a parm and processing for attendance from device generated events
//###### Sat Feb 28 18:31:35 CDT 2018 Report format is pulled from user config (csv file) -- significant refactoring of code
//###### Sat Apr 17 18:31:35 CDT 2018 Process new field for Device Auth Code
//###### Sat Apr 28 18:31:35 CDT 2018 Common module for mustering (basic report) and attendance report
//###### Sat May 02 18:31:35 CDT 2018 Added EventID to Unaccounted GET and removed extraneous var eventID 
//###### ... (was being hoisted and overwriting the main eventID param)
//###### Sun Jun 10 13:23:05 PDT 2018 Added a caller variable to distiniguish whether this is being called from the screen
//... or from the sweep.


//###### Module uses a configuration file (one each for attendance and mustering)
module.exports.writeActivityReport = function(caller, type, connection, eventID, eventTempID, callback) {
  
  //--  
  //Read the report configuration file, which is in the root directory
  //and then parse it.
  //Get the file based on the report type
    
  if (type=="Mustering"){var configFile='./mstRpt.csv'}   
  if (type=="Attendance"){var configFile='./attRpt.csv'}  
  console.log  ("TYPE IS "+configFile)
  
  fs.readFile(configFile, {
        encoding: 'utf-8'
      }, function(err, csvData) {
            if (err) {
            sess.rptError = 'File not found.  Please check directory and file name.';
            return callback(err, null); // have to use a return with the calllback or another callback maybe triggered later
            }
  
        csvParser(csvData, {
          delimiter: ',',
          escape: "'"
          //columns: true
          }, function(err, data) {
            if (err) {
              console.log(err);
              sess.rptError = 'csv file problem -- '+err;
              callback(err, null);
          } else {
              
            // Initialize the fields for retrieval to just the mandatory ones
            var _sql3 = "EventName"
  
            //Initialise the header string
            //###### Sat Feb 28 18:28:20 CDT 2018  Add leading empty column.  Makes logic simpler for format the header line that way.
            var header=''+','
            var detail=''+','
            
            
            // This is what the attendance table looks like -- used by both attendance and mustering modules
            // +---------------+-------------+------+-----+---------+-------+
            // | Field         | Type        | Null | Key | Default | Extra |
            // +---------------+-------------+------+-----+---------+-------+
            // | MobSSID       | int(11)     | YES  |     | NULL    |       |
            // | FirstName     | varchar(25) | YES  | MUL | NULL    |       |
            // | LastName      | varchar(25) | YES  | MUL | NULL    |       |
            // | InTIme        | varchar(20) | YES  |     | NULL    |       |
            // | OutTIme       | varchar(20) | YES  |     | NULL    |       |
            // | EventID       | varchar(25) | YES  |     | NULL    |       |
            // | EventName     | varchar(40) | YES  |     | NULL    |       |
            // | iClassNumber  | bigint(20)  | YES  | MUL | NULL    |       |
            // | AttendDate    | varchar(20) | YES  |     | NULL    |       |
            // | InSeconds     | varchar(20) | YES  |     | NULL    |       |
            // | OutSeconds    | varchar(20) | YES  |     | NULL    |       |
            // | EmpID         | varchar(40) | YES  |     | NULL    |       |
            // | RecordStatus  | varchar(10) | YES  |     | NULL    |       |
            // | MobSSOperator | varchar(40) | YES  |     | NULL    |       |
            // | DeviceAuthCode| varchar(40) | YES  |     | NULL    |       |
            // | CheckInType   | varchar(4)  | YES  |     | NULL    |       |
            // +---------------+-------------+------+-----+---------+-------+
           
            //--
            //read the fields from the report format file
            var firstNameKey = data[0][0];
            var firstName = data[0][1];
            var lastNameKey = data[1][0];
            var lastName = data[1][1];
            var inTImeKey = data[2][0];
            var inTIme = data[2][1];
            var outTImeKey = data[3][0];
            var outTIme = data[3][1];
            var iClassNumberKey = data[4][0];
            var iClassNumber = data[4][1];
            var attendDateKey = data[5][0];
            var attendDate = data[5][1];
            var inSecondsKey = data[6][0];
            var inSeconds = data[6][1];
            var outSecondsKey = data[7][0];
            var outSeconds = data[7][1];
            var empIDKey = data[8][0];
            var empID = data[8][1];
            var mobSSOperatorKey = data[9][0];
            var mobSSOperator = data[9][1];
            var eventIdNumKey = data[10][0];
            var eventIdNum = data[10][1];
            var emailAddKey = data[11][0];
            var emailAdd = data[11][1];
            var identifierFldKey = data[12][0];
            var identifierFld = data[12][1];
            var reportPrefix = data[13][1];
            var devAuthCodeKey = data[14][0];
            var devAuthCode = data[14][1];
            var checkInTypeKey = data[15][0];
            var checkInType = data[15][1];
            if (type=="Mustering"){var orderBy = data[16][1];}else{var orderBy=""}
            if (type=="Mustering"){var musterPointKey = data[17][0]; var musterPoint = data[17][1]}else{musterPoint=""}
            
            
            //--
            //Create the rest of the SQL statement field list based on the 
            //the report format file
            if (firstName == "YES"){_sql3=_sql3+","+firstNameKey}
            if (lastName == "YES"){_sql3=_sql3+","+lastNameKey}
            if (inTIme == "YES"){_sql3=_sql3+","+inTImeKey}
            if (outTIme == "YES"){_sql3=_sql3+","+outTImeKey}
            if (iClassNumber == "YES"){_sql3=_sql3+","+iClassNumberKey}
            if (attendDate == "YES"){_sql3=_sql3+","+attendDateKey}
            if (inSeconds == "YES"){_sql3=_sql3+","+inSecondsKey}
            if (outSeconds == "YES"){_sql3=_sql3+","+outSecondsKey}
            if (empID == "YES"){_sql3=_sql3+","+empIDKey}
            if (checkInType == "YES"){_sql3=_sql3+","+checkInTypeKey}
            if (mobSSOperator == "YES"){_sql3=_sql3+","+mobSSOperatorKey}
            if (devAuthCode == "YES"){_sql3=_sql3+","+devAuthCodeKey}
            if (eventIdNum == "YES"){_sql3=_sql3+","+eventIdNumKey}
           
  
            //Format the rest of the SQl statement based on whether there there is a 
            //tempId (device created event) associated with the event
            if (eventTempID =="") {
              var _sqlQ = 'SELECT '+_sql3+' FROM attendance WHERE EventID='+eventID;
                  
            }else{
              var _sqlQ = 'SELECT '+_sql3+' FROM attendance WHERE EventID='+eventID+' or EventID="'+eventTempID+'"'  
            } 


            //--
            connection.query(_sqlQ, function(err, results) {
              //connection.release();
              if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
              
              var eventName = "";
              
              if(results.length > 0){
                
                var eventName = results[0].EventName;
                //pb 2017.09.15 remove slashes as they can be added to event name on the device (although not on command center) 
                //###### Tue Dec 5 09:36:46 PST 2017 - Crashes if the name is blank
                var cleanName = eventName.replace(/\//g, "-");
                //###### Tue Feb 23 09:36:46 PST 2018 - Use time stamp so many copies of same report can be run

                var _d = new Date();
                var _u = _d.getTime();
                //###### Tue Feb 28 09:36:46 PST 2018 - Use the user configured prefix
                var title=reportPrefix+' -- '+cleanName+"--"+_u;

    
                //--
                //###### Sat Apr 28 18:17:55 CDT 2018 Give a descriptive name to the checkintype
                if (checkInType =="YES"){
                  for (var j=0; j < results.length; j++) {                        
                    
                      if (results[j].CheckInType=="1") {
                        //Append the Results JSON array with the musterpointID                           
                          results[j].CheckInType = "Credential"
                          
                      } else if (results[j].CheckInType=="2") {
                        results[j].CheckInType = "Manual"

                      } else if (results[j].CheckInType=="3") {
                        results[j].CheckInType = "SMS"
                      
                      } else{
                        results[j].CheckInType = ""
                      }
                  }
                }


                //--
                //###### Sat Apr 27 18:17:55 CDT 2018 Get the date into sortable format from the h:mm am/pm format             
                results = ioResultFormatting.reformatTimes(results)   


                //--
                // Get the musterpoints and add to the Results array
                var _sqlQ2 = 'SELECT * from musterpoint';
                connection.query(_sqlQ2, function(err, results2) {
                  if(err) { console.log('musterpoint qry bad'+err);}
                  
                  //Loop through the MusterPoints and if there is a match on the results (attendance records)
                  //on deviceAuthCode, then append the muster point ID to the results array
                 
                  if (type=="Mustering"){
                    for (var k=0; k < results2.length; k++) {
                      
                      for (var j=0; j < results.length; j++) {
                        
                          if (results2[k].DeviceAuthCode==results[j].DeviceAuthCode) {
                            //Append the Results JSON array with the musterpointID                              
                            results[j].MusterPoint = results2[k].PointID
                              
                          } 
                        }
                      }
                  }


                  //--
                  //###### Sat Apr 28 18:17:55 CDT 2018 Get the descriptive name for the device
                  var _sqlQ1d = 'SELECT * from DeviceHeader';
                  connection.query(_sqlQ1d, function(err, resultsD) {

                    if (err){
                      //just log the error display the results we have
                      console.log("device name get error "+err)
                      connection.end();                      
                      
                    }else{

                      for (var i=0; i < results.length; i++) {
                        
                        for (var j=0; j < resultsD.length; j++) {
              
                          if (results[i].DeviceAuthCode==resultsD[j].AuthCode) {
                            //Append the Results JSON array    
                            if (resultsD[j].name=="" || resultsD[j].name==null ){
                              results[i].DeviceAuthCode = results[i].DeviceAuthCode
                              
                            }else{
                              results[i].DeviceAuthCode = resultsD[j].name
                              
                            }                       
                              
                          }
                          
                      }
                    }

                  }


                  //--
                  // DO THE REST OF REPORT PROCESSING ONCE THE DEVICE HEADER QRY RETURNS
                  var appPath = path.normalize(__dirname+'/..');
                  var rptPath = path.normalize(appPath+'/public/reports/');
                  //fs.open('./'+title+'.csv', 'wx', (err) => {
                  fs.open(rptPath+title+'.csv', 'wx', (err, fd) => {
                    if (err) {
                      if (err.code === "EEXIST") {
                        console.error('myfile already exists');
                        sess.rptSuccess = null;
                        //sess.rptError = "No report generated, file already exists in "+rptPath+".  To re-generate, delete the existing report first."
                        sess.rptError = "Report already exists";
                        connection.end();
                        //###### Sat Feb 25 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times 
                        callback(sess.rptError, sess.rptSuccess, title);
  
                        return;
                      } else {
                        throw err;
                      }
                    }
                    

                    //--
                    // Format the header line
                    header =","
                    
                    if (type=="Mustering"){
                      // Format for mustering report user-config order by
                      switch (orderBy){
                        
                        case "Point":

                            // Sort by Device ID TODO -- getting two abbouds and losing doreen 17:25
                            results = ioResultFormatting.resortByPoint(results)
                            header=header+musterPointKey+","
                            
                          
                            break;
                        
                        case "Device":

                            // Sort by Device ID TODO -- getting two abbouds and losing doreen 17:25
                            results = ioResultFormatting.resortByDevice(results)
                            header=header+"Device Name"+","
                            
                            
                            break;
                        
                        case "Operator":
                          
                            // Sort by MobssOperator TODO -- getting two abbouds and losing doreen 17:25
                            results = ioResultFormatting.resortByOperator(results)
                            header=header+mobSSOperatorKey+","
                            
                            
                            break;
                        
                        case "Name":

                            // Sort by Last Name TODO -- getting two abbouds and losing doreen 17:25
                            results = ioResultFormatting.resortByName(results)
                            header=header+lastNameKey+","
                            
                            
                            break;
    
                        case "Time":

                            // Sort by time TODO -- getting two abbouds and losing doreen 17:25
                            results = ioResultFormatting.resortByTime(results)
                            header=header+inTImeKey+","
                            
                           
                            break;
    
                        default:
          
                       }
                     

                     }


                    //--
                    // Format the header line
                    if (firstName == "YES"){header=header+firstNameKey+","}
                    if(orderBy !="Name"){if (lastName == "YES"){header=header+lastNameKey+","}}
                    if(orderBy !="Time"){if (inTIme == "YES"){header=header+inTImeKey+","}}
                    if (outTIme == "YES"){header=header+outTImeKey+","}
                    if (iClassNumber == "YES"){header=header+"CredentialNumber"+","}
                    if (attendDate == "YES"){header=header+attendDateKey+","}
                    if (inSeconds == "YES"){header=header+inSecondsKey+","}
                    if (outSeconds == "YES"){header=header+outSecondsKey+","}
                    if (empID == "YES"){header=header+empIDKey+","}
                    if (checkInType == "YES"){header=header+checkInTypeKey+","}
                    if(orderBy !="Operator"){if (mobSSOperator == "YES"){header=header+mobSSOperatorKey+","}}
                    if(orderBy !="Device"){if (devAuthCode == "YES"){header=header+"Device Name"+","}}
                    if (eventIdNum == "YES"){header=header+eventIdNumKey+","}
                    if (emailAdd == "YES"){header=header+emailAddKey+","}
                    if (identifierFld == "YES"){header=header+identifierFldKey+","}
                    if(orderBy !="Point"){if (musterPoint == "YES"){header=header+musterPointKey+","}}


                    //--
                    // Open the write stream
                    var wstream = fs.createWriteStream(rptPath+title+'.csv');


                    //--
                    /**
                     * Add email to the report [plus identifier field], as per BCBS {for ACM} request.
                     * These fields are in the PEOPLE table, so i/o to the people table and then loop
                     * through the array to find the match on iClassNumber between the attendance table and
                     * the people tables results.
                     */
                    var _sqlQ1 = 'SELECT EmailAddr, Identifier1, iClassNumber FROM people';
                    connection.query(_sqlQ1, function(err, results1) {
                      if(err) { console.log('people email query bad'+err);}
    

                          //--
                          //loop through the attendance records, writing out the report line
                          for (i=0; i<results.length; i++) { 
                         
                            //--
                            // Get the email and identifier fields
                            //###### Sat Apr 28 18:17:55 CDT 2018 Initialize email and identifier fields here, not before loop
                            var emailField=""
                            var identifier=""

                            // Populate the email and Identifier fields for the report output
                            // Initialize the index to null as comparison to "" below also caught 0
                            var index = null
                            for(var j = 0; j < results1.length; j++) {
                                  if(results1[j].iClassNumber === results[i].iClassNumber) {
                                    index = j;
                                  }
                              }

                            // Populate the email and identifier fields if found, otherwise leave them blank   
                            //###### Sat Feb 28 18:28:20 CDT 2018  use null not "", as latter captures 0 too
                            //###### Sat Apr 28 18:17:55 CDT 2018 Print blanks on the report for null emails in the db
                            if (index != null){
                              if(results1[index].EmailAddr != null){emailField = results1[index].EmailAddr;}
                              if(results1[index].Identifier1 != null){ identifier = results1[index].Identifier1}
                            }


                          


                            //--
                            // Format the detail write lines
                            detail =","
                            
                            // If mustering, order by the user configured choice
                            if (type=="Mustering"){
                              // Format for mustering report user-config order by
                              switch (orderBy){
                            
                                case "Point":

                                  // Set the first col on the report output
                                  detail=detail+results[i].MusterPoint+","

                                  // Set the rest of the col order using common function
                                  colOrder = formatMstRptFields(orderBy, detail, header)
                                
                                  break;
                              
                                case "Device":

                                  // Set the first col on the report output
                                  detail=detail+results[i].DeviceAuthCode+","
                                
                                  // Set the rest of the col order using common function
                                  colOrder = formatMstRptFields(orderBy, detail, header)
                                
                                  
                                  break;
                              
                                case "Operator":
                                
                                  // Set the first col on the report output
                                  detail=detail+results[i].MobSSOperator+","

                                  // Set the rest of the col order using common function
                                  colOrder = formatMstRptFields(orderBy, detail, header)
                                
                                
                                  break;
                              
                                case "Name":
        
                                  // Set the first col on the report output
                                  detail=detail+results[i].LastName+","
                                
                                  // Set the rest of the col order using common function
                                  colOrder = formatMstRptFields(orderBy, detail, header)
                              
                                  break;
          
                                case "Time":

                                  // Set the first col on the report output
                                  detail=detail+results[i].InTIme+","

                                  // Set the rest of the col order using common function
                                  colOrder = formatMstRptFields(orderBy, detail, header)
                                
                                
                                  break;
          
                                default:
              
                              }
                         
 
                            }else{

                              // Format for attendance report
                              colOrder = formatMstRptFields("", detail, header)

                            }
     

                            //%%%%%%%%%%%%%%%%%%
                            // Common function for formatting the column order
                            //%%%%%%%%%%%%%%%%%%
                            function formatMstRptFields(orderBy, detail, header){

                                if (firstName == "YES"){detail=detail+results[i].FirstName+","}
                                if(orderBy !="Name"){if (lastName == "YES"){detail=detail+results[i].LastName+","}}
                                if(orderBy !="Time"){if (inTIme == "YES"){detail=detail+results[i].InTIme+","}}
                                if (outTIme == "YES"){detail=detail+results[i].OutTIme+","}
                                if (iClassNumber == "YES"){detail=detail+results[i].iClassNumber+","}
                                if (attendDate == "YES"){detail=detail+results[i].AttendDate+","}
                                if (inSeconds == "YES"){detail=detail+results[i].InSeconds+","}
                                if (outSeconds == "YES"){detail=detail+results[i].OutSeconds+","}
                                if (empID == "YES"){detail=detail+results[i].EmpID+","}
                                if (checkInType == "YES"){detail=detail+results[i].CheckInType+","}
                                if(orderBy !="Operator"){if (mobSSOperator == "YES"){detail=detail+results[i].MobSSOperator+","}}
                                if(orderBy !="Device"){if (devAuthCode == "YES"){detail=detail+results[i].DeviceAuthCode+","}}
                                if (eventIdNum == "YES"){detail=detail+results[i].EventID+","}
                                if (emailAdd == "YES"){detail=detail+emailField+","}
                                if (identifierFld == "YES"){detail=detail+identifier+","}
                                if(orderBy !="Point"){if (musterPoint == "YES"){detail=detail+results[i].MusterPoint+","}}
                                
                                
                                return [detail, header]
    
                            }


                            detail=colOrder[0]
                            header=colOrder[1]


                            //--
                            //write the header if this is the first line
                            if (i==0){
                                wstream.write(header);
                                wstream.write('\n');
                                wstream.write("Accounted For: "+results.length);     
                                wstream.write('\n');
                                
                                
                            }


                            //--
                            //write the detail for this line
                            detail=detail+'\n'          
                            wstream.write(detail);
                            
                          }

                          //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                          //--
                          // Get the unaccounted list for this muster
                          if (type=="Mustering"){                           

                            evacuation.getUnaccounted("All", eventID, function(err,results3){
                              if (err) {
                                console.log("Could not retrieve unaccounted records.");
                                endReportProcessing()
                                
                              }else{

                                wstream.write('\n'); // TODO
                                wstream.write("Unaccounted For: "+results3.length);     
                                wstream.write('\n');
                                
                                for(var m = 0; m < results3.length; m++) {

                                  //Order the Uanaccounted by name

                                  // Print a new header
                                  header= ","

                                  // Sort by Last Name ONLY for the Unaccounted
                                  results3 = ioResultFormatting.resortByName(results3)
                                  header=header+"LastName"+","
                                  
                                  //--
                                  //Now format the rest of the header
                                  header=header+"FirstName"+","
                                  header=header+"CredentialNumber"+","
                                  header=header+"Email"+","
                                  header=header+"PhoneNumber"+","
                                  header=header+"EmergencyContact"+","
                                

                                  //--
                                  //Now format the detail line (above, we have sorted the results by last name)
                                  detail = ','
                                  // Set the first col on the report output to LastName
                                  detail=detail+results3[m].LastName+","

                                  detail=detail+results3[m].FirstName+","
                                  detail=detail+results3[m].iClassNumber+","
                                  detail=detail+results3[m].EmailAddress+","
                                  detail=detail+results3[m].NotificationNumber+","
                                  detail=detail+results3[m].EmergContactNumber+","
                                  

                                  //--
                                  //write the header if this is the first line
                                  if (m==0){
                                    wstream.write(header);
                                    wstream.write('\n');
                                  }

                                  //--
                                  //write the detail for this line
                                  detail=detail+'\n'          
                                  wstream.write(detail);

                                  
                                }
                                endReportProcessing()
                               

                              }
                            })
                          }else{
                            endReportProcessing()
                          }
                          

                          //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
                          //--
                          // end the report once the loop is done but still inside the PEOPLE i/o Async
                           //%%%%%%%%%%%%%%%%%%
                            // Common function for End Processing
                            //%%%%%%%%%%%%%%%%%%
                           // function formatMstRptFields(orderBy, detail, header){
                          // wstream.write('\n');
                          // wstream.end();

                       // }); // End of muster point qry
                      
                      }); // End of the people i/o qry
                      
                            //%%%%%%%%%%%%%%%%%%
                            // Common function for End Processing
                            //%%%%%%%%%%%%%%%%%%
                           function endReportProcessing(){
                              wstream.write('\n');
                              wstream.end();  

                               //###### Sun Jun 10 13:33:47 PDT 2018 Distinguish the caller types
                              if (caller == "screen"){
                                sess.rptError =null;
                                sess.rptSuccess =  'Report has been generated'
                              }
              
                              //--
                              // Used an fs.open so need to close the file,  other functions close after operation but 
                              // with fs.open, we have to tidy up.  NOTE, added file decriptor object to the fs.open callback, 
                              // before i just had err in the callback
                              fs.close(fd, function(err){         
                                if (err){            
                                  console.log(err);
                                }
                                  console.log("File closed successfully.");
                                  
                                  //###### Sun Jun 10 13:33:47 PDT 2018 Distinguish the caller types
                                  if (caller == "screen"){
                                    callback(sess.rptError, sess.rptSuccess, title);
                                  }else{
                                    callback(null,  'Report has been generated', title);

                                  }
                              }); 
                            }
                  
      
                    
                  });  //END of fs open

                }) // deviceheader END
              }) // MusterPoint END
              
    
              }else {

                //###### Sun Jun 10 13:33:47 PDT 2018 Distinguish the caller types
                if (caller == "screen"){
                  sess.rptSuccess = null;
                  sess.rptError = "No report generated."
                  connection.end();
                    //###### Sat Feb 25 18:28:20 CDT 2018  Added a timestamp to report so that it can be run multiple times
                  callback(sess.rptError, sess.rptSuccess, null);
                  return;

                }else{
                  callback("No report generated.", null , null);

              }



              };
            }); //End of the Attendance table QRY
             
   }; //feb--end of else in csvParser
  }); //feb--end of csvParser 
  
  });

};


////////////////////////////////////////////////////////////////////
//  Display the report confirm page
/////////////////////////////////////////////////////////////////////
exports.reportConfirm = function(req, res) {
  sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {
    
    var eventID = req.params.eventID
    var rptFullName = req.params.rptFullName
    var title = req.params.title
    
    res.render('reportConfirm', { title: 'Command Center', eventID:eventID, rptFullName:rptFullName, title:title});
 };
};


////////////////////////////////////////////////////////////////////
//  Display the report confirm page
/////////////////////////////////////////////////////////////////////
exports.reportDownload = function(req, res) {
  sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {
    
    var eventID = req.params.eventID
    var rptFullName = req.params.rptFullName
    var title = req.params.title
    
    

    res.download(rptFullName, title+'.csv');
    
    
 };
};