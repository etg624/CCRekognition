
//*
//* Setup file for the base application (5.0.0)
//* Creates .env file, which should then be edited at install
//* Also creates the appropriate navbar for the version
//*
//###### Sat Feb 27 2018 13:58:50 Attendance report table

var db = require('../models/db');
var csvParser = require('csv-parse');


'use strict';
var fs = require('fs');

var i = 0
var array = fs.readFileSync('./.env').toString().split("\n");
for(i in array) {
    console.log(array[i]);
}


////////////////////////////////////////////
// display the home page for the settings //
////////////////////////////////////////////
exports.settingsHome = function(req, res) {
    sess=req.session;
    sess.success=null;
    sess.error=null;
    var name = req.query.name;

    if (typeof sess.username == 'undefined') {
      res.redirect('/');
    }else{
 

 /**
  * Get the contents of the .env file and display on settings screen
  */
    var version = process.env.VERSION;
    var env = process.env.NODE_ENV;

    var dbHost = process.env.DB_HOST;

    var dbName = process.env.DB_NAME;
    var dbUser = process.env.DB_USER;
    var dbPass = process.env.DB_PASS;
   
    var ccSSL = process.env.CC_SSL;
    var infileDis = process.env.INFILE_DISABLED;
    var infileLocal = process.env.LOCAL_INFILE;
    var port = process.env.PORT;
    
    var exportSource = process.env.EXPORT_SOURCE;
    
    var sweep = process.env.SWEEP_SCHED;
    var sweepDir = process.env.SWEEP_FILE;

    //###### Tue Jan 31 09:37:23 PDT 2018 Parms for PACS connection
    var pacsHost = process.env.PACS_HOST;
    var pacsUser = process.env.PACS_USER;
    var pacsPassword = process.env.PACS_PASSWORD;

    //###### Tue Oct 3 09:37:23 PDT 2017 allow for sweep of photos with data only (no photos)
    var sweepScope = process.env.SWEEP_SCOPE;
    
    var pictureDir = process.env.PICTURE_DIR;
    
    //###### Tue Oct 24 09:37:23 PDT 2017 user configuration of sweep schedule
    var sweepTime = process.env.SWEEP_TIME;
    
    var muster = process.env.MUSTER;
    var latitude = process.env.LAT;
    var longitude = process.env.LNG;

    //###### Sat Dec 9 13:53:28 PST 2017  event type is enabled or hidden
    var eventTypeEnabled = process.env.EVENTTYPE_ENABLED;

    var certName = process.env.CERT_NAME;
    var certPass = process.env.CERT_PASSPHRASE;

    var emailHost = process.env.EMAIL_HOST;  
    var emailPort = process.env.EMAIL_PORT; 
    var emailSecure = process.env.EMAIL_SECURE;  
    var emailUser = process.env.EMAIL_USER; 
    var emailPass = process.env.EMAIL_PASS; 
    var emailFrom = process.env.EMAIL_FROMADDR; 

     //###### Sat Jan 01 13:53:28 PST 2018  Support for command center to command center relay
     var relayHost = process.env.RELAY_HOST;

     //###### Fri Feb 9 17:08:57 PST 2018 Limit to initial disply of card scan records
     var scanLimit = process.env.CARDSCAN_RECS_LIMIT;

    //###### Sat May 02 2018 13:58:50 PST Title and message for emails to Unaccounted during muster
    var emergencyTitle = process.env.EMERGENCY_TITLE;
    var emergencyMessage = process.env.EMERGENCY_MESSAGE;

     //###### Sat Jun 06 2018 13:58:50 SMS related variables
     var twilioSID = process.env.TWILIO_SID;
     var twilioToken = process.env.TWILIO_TOKEN;
     var serverAddress = process.env.SERVER_ADDRESS;
    
     
   
 /**
  * Ensure only authorised viewers can see the settings screen
  */
console.log('sess.userType = '+sess.userType);

 if (sess.userType == '2'){
    res.render('settings', { title: 'Command Center' + name, username: sess.username, version, env, dbHost, dbName, dbUser, dbPass, ccSSL, port, infileDis, infileLocal, exportSource, pacsHost, pacsUser, pacsPassword, certName, certPass, sweep, sweepDir, sweepScope, pictureDir, sweepTime, muster, eventTypeEnabled, scanLimit, relayHost, latitude, longitude, emailHost, emailPort, emailSecure, emailUser, emailPass, emailFrom, emergencyTitle, emergencyMessage, twilioSID, twilioToken, serverAddress });
    } else {
    res.render('Unauthorized', { title: 'Command Center'});
    }

}
};

////////////////////////////////////////////////////////////////////////////////////////
//* Make a change to the settings, update the .env file                               //
////////////////////////////////////////////////////////////////////////////////////////
exports.settingsUpdate = function(req, res) {
    sess=req.session;

    /**
     * Create an array from the display fields so we can write the .env file
     */
    //###### Tue Oct 3 09:48:09 PDT 2017  Added sweep scope parm to allow sweep without photos
    //###### Tue Oct 24 09:48:09 PDT 2017  User config of sweep time
    //###### Sat Dec 9 13:58:50 PST 2017 EventType Enabled flag
    //###### Sat Jan 01 13:58:50 PST 2018 Source host address for the command center to command center Relay
    //###### Sat Jan 31 13:58:50 PST 2018 PACS connection details
    //###### Sat Feb 05 2018 13:58:50 PST alternative default file
    //###### Sat May 02 2018 13:58:50 PST Title and message for emails to Unaccounted during muster
    //###### Sat Jun 06 2018 13:58:50 SMS related variables


    
    var param_array = [{
        value: 'VERSION='+process.env.VERSION
        },
        {
        value: 'DB_HOST='+req.body.dbHost
        },
        {
        value: 'DB_NAME='+req.body.dbName
        },
        {
        value: 'DB_USER='+req.body.dbUser
        },
        {
        value: 'DB_PASS='+req.body.dbPass
        },
        {
        value: 'NODE_ENV='+process.env.NODE_ENV
        },
        {
        value: 'CC_SSL='+req.body.sslRadios
        },
        {
        value: 'PORT='+req.body.port
        },
        {
        value: 'INFILE_DISABLED='+req.body.infileRadioDisabled
        },
        {
        value: 'LOCAL_INFILE='+req.body.infileRadioLocal
        },
        {
        value: 'EXPORT_SOURCE='+req.body.exportRadios
        },
        {
        value: 'PACS_HOST='+req.body.pacsHost
        },
        {
        value: 'PACS_USER='+req.body.pacsUser
        },
        {
        value: 'PACS_PASSWORD='+req.body.pacsPassword
        },
        {
        value: 'SWEEP_FILE='+req.body.sweepFile
        },
        {
        value: 'PICTURE_DIR='+req.body.picDir
        },
        {
        value: 'RELAY_HOST='+req.body.relayHost
        },
        {
        value: 'SWEEP_SCHED='+req.body.sweepRadios
        },
        {
        value: 'SWEEP_SCOPE='+req.body.sweepRadioScope
        },
        {
        value: 'SWEEP_TIME='+req.body.swpTime
        },
        {
        value: 'MUSTER='+req.body.musterRadios
        },
        {
        value: 'EMERGENCY_TITLE='+req.body.emergencyTitle
        },
        {
        value: 'EMERGENCY_MESSAGE='+req.body.emergencyMessage
        },
        {
        value: 'LAT='+req.body.latitude
        },
        {
        value: 'LNG='+req.body.longitude
        },
        {
        value: 'EVENTTYPE_ENABLED='+req.body.eventTypeRadios
        },
        {
        value: 'CARDSCAN_RECS_LIMIT='+req.body.scanLimit
        },
        {
        value: 'CERT_NAME='+req.body.certNameSet
        },
        {
        value: 'CERT_PASSPHRASE="'+req.body.certPassSet+'"'
        },
        {
        value: 'EMAIL_HOST='+req.body.emailHost
        },
        {
        value: 'EMAIL_PORT='+req.body.emailPort
        },
        {
        value: 'EMAIL_SECURE='+req.body.emailSecure
        },
        {
        value: 'EMAIL_USER='+req.body.emailUser
        },
        {
        value: 'EMAIL_PASS='+req.body.emailPass
        },
        {
        value: 'TWILIO_SID='+req.body.twilioSID
        },
        {
        value: 'TWILIO_TOKEN='+req.body.twilioToken
        },
        {
        value: 'SERVER_ADDRESS='+req.body.serverAddress
        }];


  /**
   * function deletes the current .env file and writes a new one
   * 
   */
  function processInput ( param_array ) { 
  //This deletes the .env file before doing the copy.
   fs.unlinkSync('.env');     
   fs.open('.env', 'a', 666, function( e, id ) {
    //in some cases appends to the end of the last line rather than on a new line,
    //so write a blank line first
    //fs.appendFileSync(id, "" + "\r\n", null, 'utf8')

    for (var i=0; i<param_array.length; i++){
        fs.appendFileSync(id, param_array[i].value + "\r\n", null, 'utf8')
    }
    fs.close(id, function(){});
    process.exit(1)
    });
    sess.success='Settings have been changed'
    

    //res.status(301).redirect('/dashboard');
    };


    processInput(param_array);
};


//////////////////////////////////////////////////////////////
// Restart the application after settings have been changed //
//////////////////////////////////////////////////////////////
exports.settingsRestart = function(req, res) {
  
 sess.success=null;
 process.exit(1)
};


//###### Sat Feb 27 2018 13:58:50 PST Attendance Report format
//###### Sat Apr 17 2018 13:58:50 PST Incorporate new DeviceAuthCode field
//###### Sat Apr 27 2018 13:58:50 PST Incorporate new checkInType field

////////////////////////////////////////////
// display the home page for the attendance config 
////////////////////////////////////////////
exports.attReportHome = function(req, res) {
    sess=req.session;
    sess.success=null;
    sess.error=null;
    var name = req.query.name;

    if (typeof sess.username == 'undefined') {
      res.redirect('/');
    }else{
 

fs.readFile('./attRpt.csv', {
    //fs.readFile(req.body.fileName, {
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
            
            var rowsToInsert = data.length-1
            var _firstName = ""
            var _lastName = ""
            var _badgeNumber = ""
            var _title = ""
            var _empID = 0
            var _imageName = ""
            var counter = 0;
            var errInsert =null;
            var _sql3 = "EventID"

           
            var firstName = data[0][1];
            var lastName = data[1][1];
            var inTIme = data[2][1];
            var outTIme = data[3][1];
            var iClassNumber = data[4][1];
            var attendDate = data[5][1];
            var inSeconds = data[6][1];
            var outSeconds = data[7][1];
            var empID = data[8][1];
            var mobSSOperator = data[9][1];
            var eventID = data[10][1];
            var email = data[11][1];
            var identifier = data[12][1];
            var reportPrefix = data[13][1];
            var deviceAuthCode = data[14][1];
            var checkInType = data[15][1];
            
              
              if (sess.userType == '2'){
                    res.render('attReportFormat', { title: 'Command Center', lastName: lastName, firstName: firstName, inTIme:inTIme, outTIme:outTIme, iClassNumber:iClassNumber,attendDate:attendDate, inSeconds:inSeconds, outSeconds:outSeconds, empID:empID, mobSSOperator:mobSSOperator, deviceAuthCode:deviceAuthCode, eventID:eventID, email:email, identifier:identifier, reportPrefix:reportPrefix, checkInType:checkInType   });
                } else {
                    res.render('Unauthorized', { title: 'Command Center'});
                }
           
              
            //} // end of for loop through the csv file     
        }; //feb--end of else in csvParser
    }); //feb--end of csvParser 

    });

    }
}




//###### Sat Feb 26 2018 13:58:50 PST Attendance Report format
//###### Sat Apr 17 2018 13:58:50 PST Process device authcode field
//###### Sat Apr 27 2018 13:58:50 PST Process CheckInType

////////////////////////////////////////////////////////////////////////////////////////
//* Make a change to the .env file with attendance report format                         
////////////////////////////////////////////////////////////////////////////////////////
exports.attReportUpdate = function(req, res) {
    sess=req.session;

/**
  * Prepare the user entries to write to the format csv file
  */

  if (req.body.firstName == "YES"){var firstNameInsert="YES"}else{var firstNameInsert="NO"}
  if (req.body.lastName == "YES"){var lastNameInsert="YES"}else{var lastNameInsert="NO"}
  if (req.body.inTIme == "YES"){var inTImeInsert="YES"}else{var inTImeInsert="NO"}
  if (req.body.outTIme == "YES"){var outTImeInsert="YES"}else{var outTImeInsert="NO"}
  if (req.body.iClassNumber == "YES"){var iClassNumberInsert="YES"}else{var iClassNumberInsert="NO"}
  if (req.body.attendDate == "YES"){var attendDateInsert="YES"}else{var attendDateInsert="NO"}
  if (req.body.inSeconds == "YES"){var inSecondsInsert="YES"}else{var inSecondsInsert="NO"}
  if (req.body.outSeconds == "YES"){var outSecondsInsert="YES"}else{var outSecondsInsert="NO"}
  if (req.body.empID == "YES"){var empIDInsert="YES"}else{var empIDInsert="NO"}
  if (req.body.mobSSOperator == "YES"){var mobssOperatorInsert="YES"}else{var mobssOperatorInsert="NO"}
  if (req.body.deviceAuthCode == "YES"){var deviceAuthCodeInsert="YES"}else{var deviceAuthCodeInsert="NO"}
  if (req.body.eventID == "YES"){var eventIDInsert="YES"}else{var eventIDInsert="NO"}
  if (req.body.email == "YES"){var emailInsert="YES"}else{var emailInsert="NO"}
  if (req.body.identifier == "YES"){var identifierInsert="YES"}else{var identifierInsert="NO"}
  if (req.body.checkInType == "YES"){var checkInTypeInsert="YES"}else{var checkInTypeInsert="NO"}  
  var reportPrefixInsert = req.body.reportPrefix
  
  
  
    var param_array = [
    {
    value: 'FirstName,'+firstNameInsert
    },
    {
    value: 'LastName,'+lastNameInsert
    },
    {
    value: 'InTIme,'+inTImeInsert
    },
    {
    value: 'OutTIme,'+outTImeInsert
    },
    {
    value: 'iClassNumber,'+iClassNumberInsert
    },
    {
    value: 'AttendDate,'+attendDateInsert
    },
    {
    value: 'InSeconds,'+inSecondsInsert
    },
    {
    value: 'OutSeconds,'+outSecondsInsert
    },
    {
    value: 'EmpID,'+empIDInsert
    },
    {
    value: 'MobSSOperator,'+mobssOperatorInsert
    },
    {
    value: 'EventID,'+eventIDInsert
    },
    {
    value: 'Email,'+emailInsert
    },
    {
    value: 'Identifier1,'+identifierInsert
    },
    {
    value: 'ReportPrefix,'+reportPrefixInsert
    },
    {
    value: 'DeviceAuthCode,'+deviceAuthCodeInsert
    },
    {
    value: 'CheckInType,'+checkInTypeInsert
    }];




    fs.unlinkSync('./attRpt.csv');     
    fs.open('./attRpt.csv', 'a', 666, function( e, id ) {
    //in some cases appends to the end of the last line rather than on a new line,
    //so write a blank line first
    //fs.appendFileSync(id, "" + "\r\n", null, 'utf8')






    for (var i=0; i<param_array.length; i++){
        fs.appendFileSync(id, param_array[i].value + "\r\n", null, 'utf8')
    }
    fs.close(id, function(){});

    })   

 
   

res.status(301).redirect('/dashboard');
}


////////////////////////////////////////////
// display the home page for the attendance config 
////////////////////////////////////////////
exports.mstReportHome = function(req, res) {
    sess=req.session;
    sess.success=null;
    sess.error=null;
    var name = req.query.name;

    if (typeof sess.username == 'undefined') {
      res.redirect('/');
    }else{
 

fs.readFile('./mstRpt.csv', {
    //fs.readFile(req.body.fileName, {
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
            

           
            var firstName = data[0][1];
            var lastName = data[1][1];
            var inTIme = data[2][1];
            var outTIme = data[3][1];
            var iClassNumber = data[4][1];
            var attendDate = data[5][1];
            var inSeconds = data[6][1];
            var outSeconds = data[7][1];
            var empID = data[8][1];
            var mobSSOperator = data[9][1];
            var eventID = data[10][1];
            var email = data[11][1];
            var identifier = data[12][1];
            var reportPrefix = data[13][1];
            var deviceAuthCode = data[14][1];
            var checkInType = data[15][1];
            var orderBy = data[16][1];
            var musterPoint = data[17][1];
            
            
              
              if (sess.userType == '2'){
                    res.render('mstReportFormat', { title: 'Command Center', lastName: lastName, firstName: firstName, inTIme:inTIme, outTIme:outTIme, iClassNumber:iClassNumber,attendDate:attendDate, inSeconds:inSeconds, outSeconds:outSeconds, empID:empID, mobSSOperator:mobSSOperator, deviceAuthCode:deviceAuthCode, eventID:eventID, email:email, identifier:identifier, reportPrefix:reportPrefix, checkInType:checkInType, orderBy:orderBy, musterPoint:musterPoint   });
                } else {
                    res.render('Unauthorized', { title: 'Command Center'});
                }
           
              
            //} // end of for loop through the csv file     
        }; //feb--end of else in csvParser
    }); //feb--end of csvParser 

    });

    }
}



//###### Sat Apr 30 2018 13:58:50 PST Processes the mustering config update
////////////////////////////////////////////////////////////////////////////////////////
//* Make a change to the .env file with mustering report format                         
////////////////////////////////////////////////////////////////////////////////////////
exports.mstReportUpdate = function(req, res) {
    sess=req.session;

/**
  * Prepare the user entries to write to the format csv file
  */

  if (req.body.firstName == "YES"){var firstNameInsert="YES"}else{var firstNameInsert="NO"}
  if (req.body.lastName == "YES"){var lastNameInsert="YES"}else{var lastNameInsert="NO"}
  if (req.body.inTIme == "YES"){var inTImeInsert="YES"}else{var inTImeInsert="NO"}
  if (req.body.outTIme == "YES"){var outTImeInsert="YES"}else{var outTImeInsert="NO"}
  if (req.body.iClassNumber == "YES"){var iClassNumberInsert="YES"}else{var iClassNumberInsert="NO"}
  if (req.body.attendDate == "YES"){var attendDateInsert="YES"}else{var attendDateInsert="NO"}
  if (req.body.inSeconds == "YES"){var inSecondsInsert="YES"}else{var inSecondsInsert="NO"}
  if (req.body.outSeconds == "YES"){var outSecondsInsert="YES"}else{var outSecondsInsert="NO"}
  if (req.body.empID == "YES"){var empIDInsert="YES"}else{var empIDInsert="NO"}
  if (req.body.mobSSOperator == "YES"){var mobssOperatorInsert="YES"}else{var mobssOperatorInsert="NO"}
  if (req.body.deviceAuthCode == "YES"){var deviceAuthCodeInsert="YES"}else{var deviceAuthCodeInsert="NO"}
  if (req.body.eventID == "YES"){var eventIDInsert="YES"}else{var eventIDInsert="NO"}
  if (req.body.email == "YES"){var emailInsert="YES"}else{var emailInsert="NO"}
  if (req.body.identifier == "YES"){var identifierInsert="YES"}else{var identifierInsert="NO"}
  if (req.body.checkInType == "YES"){var checkInTypeInsert="YES"}else{var checkInTypeInsert="NO"}  
  if (req.body.musterPoint == "YES"){var musterPointInsert="YES"}else{var musterPointInsert="NO"}  
  
  
  var reportPrefixInsert = req.body.reportPrefix

  var orderByInsert = '';
  if (req.body.orderBy == 'Muster Point'){
    orderByInsert = 'Point';
    }else if (req.body.orderBy == 'Device'){
        orderByInsert = 'Device';
        }else if (req.body.orderBy == 'Operator'){
            orderByInsert = 'Operator';
            }else if (req.body.orderBy == 'Last Name'){
                 orderByInsert = 'Name';
                      }else {orderByInsert = 'Time'}
  
  
  
  
    var param_array = [
    {
    value: 'FirstName,'+firstNameInsert
    },
    {
    value: 'LastName,'+lastNameInsert
    },
    {
    value: 'InTIme,'+inTImeInsert
    },
    {
    value: 'OutTIme,'+outTImeInsert
    },
    {
    value: 'iClassNumber,'+iClassNumberInsert
    },
    {
    value: 'AttendDate,'+attendDateInsert
    },
    {
    value: 'InSeconds,'+inSecondsInsert
    },
    {
    value: 'OutSeconds,'+outSecondsInsert
    },
    {
    value: 'EmpID,'+empIDInsert
    },
    {
    value: 'MobSSOperator,'+mobssOperatorInsert
    },
    {
    value: 'EventID,'+eventIDInsert
    },
    {
    value: 'Email,'+emailInsert
    },
    {
    value: 'Identifier1,'+identifierInsert
    },
    {
    value: 'ReportPrefix,'+reportPrefixInsert
    },
    {
    value: 'DeviceAuthCode,'+deviceAuthCodeInsert
    },
    {
    value: 'CheckInType,'+checkInTypeInsert
    },
    {
    value: 'OrderBy,'+orderByInsert
    },
    {
    value: 'MusterPoint,'+musterPointInsert
    }];




    fs.unlinkSync('./mstRpt.csv');     
    fs.open('./mstRpt.csv', 'a', 666, function( e, id ) {
    //in some cases appends to the end of the last line rather than on a new line,
    //so write a blank line first
    //fs.appendFileSync(id, "" + "\r\n", null, 'utf8')






    for (var i=0; i<param_array.length; i++){
        fs.appendFileSync(id, param_array[i].value + "\r\n", null, 'utf8')
    }
    fs.close(id, function(){});

    })   

 
   

res.status(301).redirect('/dashboard');
}










//###### Sat Feb 27 2018 13:58:50 PST Attendance Report format
////////////////////////////////////////////
// display the home page for the settings //
////////////////////////////////////////////
exports.attReportHomeDBVER = function(req, res) {
    sess=req.session;
    sess.success=null;
    sess.error=null;
    var name = req.query.name;

    if (typeof sess.username == 'undefined') {
      res.redirect('/');
    }else{
 

 /**
  * Get the record from the AttendanceReport table
  */
//| ReportNamePrefix | varchar(40) | YES  |     | NULL    |       |
//| FirstName        | varchar(4)  | YES  |     | NULL    |       |
//| LastName         | varchar(4)  | YES  |     | NULL    |       |
//| InTIme           | varchar(4)  | YES  |     | NULL    |       |
//| OutTIme          | varchar(4)  | YES  |     | NULL    |       |
//| EventID          | varchar(4)  | YES  |     | NULL    |       |
//| EventName        | varchar(4)  | YES  |     | NULL    |       |
//| BadgeNumber      | varchar(4)  | YES  | MUL | NULL    |       |
//| AttendDate       | varchar(4)  | YES  |     | NULL    |       |
//| InSeconds        | varchar(4)  | YES  |     | NULL    |       |
//| OutSeconds       | varchar(4)  | YES  |     | NULL    |       |
//| EmpID            | varchar(4)  | YES  |     | NULL    |       |
//| RecordStatus     | varchar(4)  | YES  |     | NULL    |       |
//| MobSSOperator    | varchar(4)  | YES  |     | NULL    |       |
//| email            | varchar(4)  | YES  |     | NULL    |       |
//| Identifier       | varchar(4)  | YES  |     | NULL    |       |
//+------------------+-------------+------+-----+---------+-------+
  
    db.createConnection(function(err,resltt){  
        if (err) {
            console.error( "Error connecting to DB : ", err );
        }else{
        //process the i/o after successful connect.  Connection object returned in callback
            var connection = resltt;
            var _sqlQ1 = "SELECT * FROM attendanceReport";
            var firstName = ""
            var lastName = ""
        
                connection.query(_sqlQ1, function(err, reslt) {
                //connection.release();
                if(err) { 
                    console.error( "Error reading attendance report format : ", err );
                    
                }else{

                    // Format the screen from the database contents
                    console.log("result length "+reslt.length)
                    if (reslt.length == 0){
                        firstName = "YES"
                    
                    
                    }else{
                        var blobby = "FirstName"
                        var dobby = "reslt[0]."
                        var robby =dobby+blobby
                        //var resltP =JSON.parse(reslt)
                        //console.log("object keys "+Object.keys(resltP));
                        console.log("result[0] "+robby)
                        
                        if (reslt[0].FirstName != null){firstName = reslt[0].FirstName}else{firstName = "NO"}
                    }

                    
                    var checked1 = "NO";
            
                    if (sess.userType == '2'){
                        res.render('attReportFormat', { title: 'Command Center', checked1: checked1, firstName: firstName });
                    } else {
                        res.render('Unauthorized', { title: 'Command Center'});
                    }


                }

            })
        }
    })
    }
};




//###### Sat Feb 26 2018 13:58:50 PST Attendance Report format
////////////////////////////////////////////////////////////////////////////////////////
//* Make a change to the .env file with attendance report format                         
////////////////////////////////////////////////////////////////////////////////////////
exports.attReportUpdateDBVER = function(req, res) {
    sess=req.session;

         /**
  * Update the record from the AttendanceReport table
  */

    db.createConnection(function(err,resltt){  
        if (err) {
            console.error( "Error connecting to DB : ", err );
        }else{
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = resltt;

        var _sqlQ1 = "DELETE FROM attendanceReport";
        
                connection.query(_sqlQ1, function(err, reslt) {
                //connection.release();
                if(err) { 
                    console.error( "Error deleting attendance report format : ", err );
                    
                }else{

                    if (req.body.firstName == "YES"){var firstNameInsert="YES"}else{var firstNameInsert="NO"}
        
                    var _sqlQ1 = "INSERT INTO attendanceReport (FirstName) VALUES ('"+firstNameInsert+"')";
                    console.log(_sqlQ1)
            
                    connection.query(_sqlQ1, function(err, reslt) {
                    //connection.release();
                    if(err) { 
                        console.error( "Error updating attendance report format : ", err );
                        
                    }else{

                
                        connection.end();
                        res.status(301).redirect('/dashboard');


                    }

            })



        }
    })







        }
    })
   

};

