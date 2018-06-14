///////////////////////////////////////////////////////////////
// MODEL FOR DEVICE RELATED I/O TO DEVICEHEADER & DEVICEHISTORY
///////////////////////////////////////////////////////////////
// getBadDevices -- returns devices with currentStatus NE 1
// getBadConnections -- returns connections with Result = 2 or 3
// getDeviceName -- returns the user-defined name of the device
// getDeviceForAuthCode -- returns whether device exists and its status
// createDeviceHeaderRecord -- creates a new device record with 0 (activation) status
// createDeviceHistoryRecord -- creates a new device history record
// createConnnectionsRecord -- creates a new connections record

//




var datetime = require('../controllers/datetime');
var mysql = require('mysql');
var db = require('./db');


//////////////////////////////////////////////////////////
// Gets the list of devices from the DeviceHeader table //
//////////////////////////////////////////////////////////

module.exports.getBadDevices = function(callback){
    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var strSQL =  'SELECT * FROM DeviceHeader WHERE CurrentStatus="0" or CurrentStatus="2" or CurrentStatus="3";'
          connection.query(strSQL, function(err, rows, fields) {
             if (!err) {
              //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
               
              //Extract the devices that require activation so they can be listed separately
              //Create an array for devices requesting activation and bad devices 
                var BadArr = rows;
                var ActivateDevices = []
                var BadDevices = []

                for (var i = BadArr.length - 1; i >= 0; i--) {
                  if (BadArr[i].CurrentStatus == "0"){ActivateDevices.push(BadArr[i])}
                  else { BadDevices.push(BadArr[i])}  
                }
                connection.end();
                callback(null, BadDevices, ActivateDevices);

              }else{

                connection.end();
                callback(err, rows, null);
            }
        });
     }   
   });
};

/////////////////////////////////////////////////////////////////
// Gets the list of bad connections from the Connections table //
////////////////////////////////////////////////////////////////

module.exports.getBadConnections = function(callback){
    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,resltBC){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback from db common module
          var connection = resltBC;

          //var strSQL =  'SELECT * FROM Connections WHERE Result="2" or Result="3";'
          var strSQL = 'select * from connections WHERE Result="2" or Result="3" ORDER BY connections.ConnectionAttemptTime DESC;'
          connection.query(strSQL, function(err, rows, fields) {
             if (!err) {
              //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
               
                connection.end();
                callback(null, rows);

              }else{

                connection.end();
                callback(err, rows);
            }
        });
     }   
   });
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Following code is not currently used.  was used to extract list of active readers before the device management functionality //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports.getGeneralReaders = function(callback){
    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);


          var strSQL =  'SELECT * FROM (SELECT * FROM verifyrecords ORDER BY scanDateTime DESC) tmp GROUP BY clientSWID;'
          connection.query(strSQL, function(err, rows, fields) {
             if (!err) {
              //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
               
                console.log('results of join'+JSON.stringify(rows));
                connection.end();
                callback(null, rows);

              }else{
                console.log('error with the max query');
                connection.end();
                callback(err, rows);
            }
        });
     }   
   });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Following code is not currently used.  was used to extract list of active readers before the device management functionality //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getAttendanceReaders = function(callback){

  db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);
          var strSQL =  'SELECT * FROM (SELECT * FROM attendance ORDER BY AttendDate DESC) tmp GROUP BY ReaderID;'
          connection.query(strSQL, function(err, rows, fields) {
               if (!err) {
                  console.log('results of attend join'+JSON.stringify(rows));
                  connection.end();
                  callback(null, rows);

                }else{
                  console.log('error with the attend reader query');
                  connection.end();
                  callback(err, rows);
                  }
                });
        }
  });
        
};


//###### Mon Dec 11 2017 07:47:12 PST 2017  This is for user-naming of devices.  
//###### Mon Apr 17 2017 07:47:12 PST 2017  Auth Code in quotes.  

/////////////////////////////////////////////////////////////////
// Gets the uer-defined name of the device                     //
/////////////////////////////////////////////////////////////////

exports.getDeviceName = function(authCode, callback){
  //get a connection using the common handler in models/db.js
   
  db.createConnection(function(err,resltDN){  
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        callback(err, null, null);
      }else{
        //process the i/o after successful connect.  Connection object returned in callback from db common module
        var connection = resltDN;

        //var strSQL =  'SELECT * FROM Connections WHERE Result="2" or Result="3";'
        var strSQL = 'select Name from deviceheader WHERE AuthCode="'+authCode+'"'
        connection.query(strSQL, function(err, rows) {
           if (!err) {
            //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
             
              connection.end();
              callback(null, rows);

            }else{

              connection.end();
              callback(err, rows);
          }
      });
   }   
 });
};

//###### Mon Mar 06 2018 07:47:12 PST 2017. Part of the migration from scripts to API  
/////////////////////////////////////////////////////////////////
// checks whether a device exists for an authcode
////////////////////////////////////////////////////////////////

exports.getDeviceForAuthCode = function(authCode, callback){
  
  //get a connection using the common handler in models/db.js 
  db.createConnection(function(err,result){  
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        callback(err, null, null);
      }else{
        //process the i/o after successful connect.  Connection object returned in callback from db common module
        var connection = result;

        var strSQL = 'SELECT CurrentStatus FROM deviceheader WHERE AuthCode="'+authCode+'"'
        connection.query(strSQL, function(err, rows) {
          if (!err) {
            //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
             
            if (rows.length > 0){
              //found a device, return the status
              connection.end();
              callback(null, rows[0].CurrentStatus);

            }else{
              // didnt find a device
              connection.end();
              callback(null, "4"); // "4" is unknown

            }
              

          }else{
              //error doing the db query
              connection.end();
              callback(err, null);
          }
      });
   }   
 });
};

//###### Mon Mar 06 2018 07:47:12 PST 2017. Part of the migration from scripts to API  
////////////////////////////////////////////////////////////
//  Handler for inserting a record to the deviceHeader table 
////////////////////////////////////////////////////////////
module.exports.createDeviceHeaderRecord = function(authCode, currentStatus, statusDate, callback) 
{

//  +------------------------+--------------+------+-----+---------+-------+
//  | Field                  | Type         | Null | Key | Default | Extra |
//  +------------------------+--------------+------+-----+---------+-------+
//  | AuthCode               | varchar(40)  | YES  | UNI | NULL    |       |
//  | DateIssued             | varchar(40)  | YES  |     | NULL    |       |
//  | ConnectionAttemptCount | int(8)       | YES  |     | NULL    |       |
//  | LastConnect            | varchar(40)  | YES  |     | NULL    |       |
//  | CurrentStatus          | varchar(5)   | YES  |     | NULL    |       |
//  | DeviceType             | varchar(5)   | YES  |     | NULL    |       |
//  | MobssOperator          | varchar(20)  | YES  |     | NULL    |       |
//  | name                   | varchar(100) | YES  |     | NULL    |       |
//  +------------------------+--------------+------+-----+---------+-------+

  db.createConnection(function(err,result){  
    if (err) {
      console.log('Error while performing common connect query: ' + err);
      callback(err, null);
    }else{

      var connection = result
      var buildDeviceHeaderQuery = (function() {
        var insertDeviceHeader = function(field1, field2, field3) {
         
          var _authCode = field1;
          var _connectionAttemptCount = 1
          var _currentStatus = field2;
          var _deviceType = "OB1";
          var _mobssOperator = "001";
          var _name = "";
          
          var _lastConnect = field3;
          var _dateIssued = field3;
          
          
          var _qFields = '(AuthCode, DateIssued, ConnectionAttemptCount, LastConnect, CurrentStatus, DeviceType, MobssOperator, name)';
          var _qValues = '("'+_authCode+'", "'+_dateIssued+'", '+_connectionAttemptCount+', "'+_lastConnect+'", "'+_currentStatus+'", "'+_deviceType+'", "'+_mobssOperator+'", "'+_name+'")';                                                      

          /**
           * Assemble the components into the query string
           */
          var parmQuery = 'INSERT INTO deviceheader '+_qFields+' VALUES ' +_qValues;
          
          return parmQuery;
      };
      return {insertDeviceHeader : insertDeviceHeader};
    })();//feb--end of revealing module

  var strSQL = buildDeviceHeaderQuery.insertDeviceHeader(authCode, currentStatus, statusDate);
                
  var query = connection.query(strSQL, function(err, result) {

                 if (err) {
        
                    console.log('problem with the insert deviceHeader query '+err);
                    connection.destroy();
                  } 
                  connection.end();     //###### Mon May 30 2018 07:47:12 PST 2017       
                  callback(err, null);
                  
      });//feb--end of connection.query for insert deviceheader record
   }
  })
}; //feb--end of post handler






//###### Mon Mar 06 2018 07:47:12 PST 2017. Part of the migration from scripts to API  
////////////////////////////////////////////////////////////
//  Handler for inserting a record to the deviceHistory table 
////////////////////////////////////////////////////////////
module.exports.createDeviceHistoryRecord = function(authCode, currentStatus, statusDate, statusChangeComment, callback) 
{

// +---------------------+--------------+------+-----+---------+-------+
//| Field               | Type         | Null | Key | Default | Extra |
//+---------------------+--------------+------+-----+---------+-------+
//| AuthCode            | varchar(40)  | YES  |     | NULL    |       |
//| Status              | varchar(5)   | YES  |     | NULL    |       |
//| StatusDate          | varchar(40)  | YES  |     | NULL    |       |
//| StatusChangeComment | varchar(100) | YES  |     | NULL    |       |
//+---------------------+--------------+------+-----+---------+-------+

  db.createConnection(function(err,result){  
    if (err) {
      console.log('Error while performing common connect query: ' + err);
      callback(err, null);
    }else{

      var connection = result
      var buildDeviceHistoryQuery = (function() {
        var insertDeviceHistory = function(field1, field2, field3, field4) {
         
          var _authCode = field1;
          var _status = field2;
          var _statusDate = field3
          var _statusChangeComment = field4;
          
          var _qFields = '(AuthCode, Status, StatusDate, StatusChangeComment)';
          var _qValues = '("'+_authCode+'", "'+_status+'", "'+_statusDate+'", "'+_statusChangeComment+'")';                                                      

          /**
           * Assemble the components into the query string
           */
          var parmQuery = 'INSERT INTO devicehistory '+_qFields+' VALUES ' +_qValues;
          
          return parmQuery;
      };
      return {insertDeviceHistory : insertDeviceHistory};
    })();//feb--end of revealing module

  var strSQL = buildDeviceHistoryQuery.insertDeviceHistory(authCode, currentStatus, statusDate, statusChangeComment);
                
  var query = connection.query(strSQL, function(err, result) {

      if (err) {

        console.log('problem with the insert deviceHistory query '+err);
        connection.destroy();
      } 
      connection.end();     //###### Mon May 30 2018 07:47:12 PST 2017             
      callback(err, null);
                  
      });//feb--end of connection.query for insert deviceheader record
   }
  })
}; //feb--end of post handler




//###### Mon Mar 06 2018 07:47:12 PST 2017. Part of the migration from scripts to API  
////////////////////////////////////////////////////////////
//  Handler for inserting a record to the connections table 
////////////////////////////////////////////////////////////
module.exports.createConnectionsRecord = function(authCode, connectionAttemptTime, currentStatus, callback) 
{

///+-----------------------+-------------+------+-----+---------+-------+
//| Field                 | Type        | Null | Key | Default | Extra |
//+-----------------------+-------------+------+-----+---------+-------+
//| AuthCode              | varchar(40) | YES  |     | NULL    |       |
//| ConnectionAttemptTime | varchar(40) | YES  |     | NULL    |       |
//| Result                | varchar(5)  | YES  |     | NULL    |       |
//| Lat                   | float(10,6) | YES  |     | NULL    |       |
//| Lng                   | float(10,6) | YES  |     | NULL    |       |
//+-----------------------+-------------+------+-----+---------+-------+

  db.createConnection(function(err,result){  
    if (err) {
      console.log('Error while performing common connect query: ' + err);
      callback(err, null);
    }else{

      var connection = result
      var buildConnectionsQuery = (function() {
        var insertConnections = function(field1, field2, field3) {
         
          var _authCode = field1;
          var _connectionAttemptTime = field2;
          var _result = field3;
          
          
          var _qFields = '(AuthCode, ConnectionAttemptTime, Result)';
          var _qValues = '("'+_authCode+'", "'+_connectionAttemptTime+'", "'+_result+'")';                                                      

          /**
           * Assemble the components into the query string
           */
          var parmQuery = 'INSERT INTO Connections '+_qFields+' VALUES ' +_qValues;
          
          return parmQuery;
      };
      return {insertConnections : insertConnections};
    })();//feb--end of revealing module

  var strSQL = buildConnectionsQuery.insertConnections(authCode, connectionAttemptTime, currentStatus);
                
  var query = connection.query(strSQL, function(err, result) {

      if (err) {

        console.log('problem with the insert connections query '+err);
        connection.destroy();
      } 
      connection.end();     //###### Mon May 30 2018 07:47:12 PST 2017             
      callback(err, null);
                  
      });//feb--end of connection.query for insert deviceheader record
   }
  })
}; //feb--end of post handler


//###### Mon Mar 10 2018 07:47:12 PST 2017. Part of the migration from scripts to API  
/////////////////////////////////////////////////////////////////
// Updates deviceheader based on connections 
////////////////////////////////////////////////////////////////

exports.updateDeviceHeaderWithConnection = function(authCode, lastConnect, callback){

  // LastConnect -- format is 2018-02-01 15:46:41

  //get a connection using the common handler in models/db.js
  db.createConnection(function(err,result){  
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        callback(err, null);
      }else{
        //process the i/o after successful connect.  Connection object returned in callback from db common module
        var connection = result;
        

        var strSQL = 'UPDATE DeviceHeader SET LastConnect="'+lastConnect+'", ConnectionAttemptCount=ConnectionAttemptCount+1 WHERE AuthCode="'+authCode+'"'
        console.log('lastConnect: ' + lastConnect);
        console.log('sql string ' + strSQL);
        
        connection.query(strSQL, function(err, reslt) {
          if (!err) {
             
              //update ok, return the status
              connection.end();
              callback(null, true);

            }else{
              // error with the update
              connection.end();
              callback(err, false);

            }
          })      

  
      }
  })
    
}
