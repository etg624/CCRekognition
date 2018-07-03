//###### Sat Mar 10 11:36:54 EST 2018 - New handler to support API
//Attendance records were previously posted from the app through mobss_scripts.lc from syncToServer 
//###### Sat Apr 17 11:36:54 EST 2018 - Process the New field -- DeviceAuthCode [previously auth code was in mobssoperator]



var datetime = require('fs');
var mysql    = require('mysql');
var db = require('./db');



//###### Sat Mar 10 11:36:54 EST 2018 - New handler to support API
/////////////////////////////////////////
// Creates an Attendance Record for PRIVATE callers 
/////////////////////////////////////////
//###### Sat Apr 26 11:36:54 EST 2018 - Added check in type (1=credential, 2=manual, 3=SMS)
//###### Sat Apr 26 11:36:54 EST 2018 - Pad InTime with a 0 for times, enabling proper sort

exports.createAttendanceRecord = function(connection, data, callback) {

//  +---------------+-------------+------+-----+---------+-------+
//  | Field         | Type        | Null | Key | Default | Extra |
//  +---------------+-------------+------+-----+---------+-------+
//  | MobSSID       | int(11)     | YES  |     | NULL    |       |
//  | FirstName     | varchar(25) | YES  | MUL | NULL    |       |
//  | LastName      | varchar(25) | YES  | MUL | NULL    |       |
//  | InTIme        | varchar(20) | YES  |     | NULL    |       |
//  | OutTIme       | varchar(20) | YES  |     | NULL    |       |
//  | EventID       | varchar(25) | YES  |     | NULL    |       |
//  | EventName     | varchar(40) | YES  |     | NULL    |       |
//  | iClassNumber  | bigint(20)  | YES  | MUL | NULL    |       |
//  | AttendDate    | varchar(20) | YES  |     | NULL    |       |
//  | InSeconds     | varchar(20) | YES  |     | NULL    |       |
//  | OutSeconds    | varchar(20) | YES  |     | NULL    |       |
//  | EmpID         | varchar(40) | YES  |     | NULL    |       |
//  | RecordStatus  | varchar(10) | YES  |     | NULL    |       |
//  | MobSSOperator | varchar(40) | YES  |     | NULL    |       |
//  | DeviceAuthCode| varchar(40) | YES  |     | NULL    |       |
//  | CheckInType   | varchar(4)  | YES  |     | NULL    |       |
//  +---------------+-------------+------+-----+---------+-------+

// creates both Attendance and AttendanceShadow records (back up attendance records)

var buildAttendanceRecordQuery = (function() {

          var insertAttendanceRecord = function(fields, table) {
                        
            var _MobSSID =fields.MobSSID            
            var _FirstName = fields.FirstName
            var _LastName = fields.LastName
            var _InTIme = fields.InTIme
            
            var _OutTIme = fields.OutTIme
            var _EventID = fields.EventID
            var _EventName = fields.EventName
            var _iClassNumber = fields.iClassNumber
            var _AttendDate = fields.AttendDate
            var _InSeconds = fields.InSeconds
            var _OutSeconds = fields.OutSeconds
            var _EmpID = fields.EmpID
            var _RecordStatus = fields.RecordStatus
            var _MobSSOperator = fields.MobSSOperator
            var _DeviceAuthCode = fields.DeviceAuthCode
            var _CheckInType = fields.CheckInType
            
            
            
          
            let _qFields =
            `(MobSSID,
              FirstName,
              LastName,
              InTIme,
              OutTIme,
              EventID,
              EventName,
              iClassNumber,
              AttendDate,
              InSeconds,
              OutSeconds,
              EmpID,
              RecordStatus,
              MobSSOperator,
              DeviceAuthCode,
              CheckInType)`

            let _qValues =
            `("`+_MobSSID+`",
            "`+_FirstName+`",
            "`+_LastName+`",
            "`+_InTIme+`",
            "`+_OutTIme+`",
            "`+_EventID+`",
            "`+_EventName+`",
            "`+_iClassNumber+`",
            "`+_AttendDate+`",
            "`+_InSeconds+`",
            "`+_OutSeconds+`",
            "`+_EmpID+`",
            "`+_RecordStatus+`",
            "`+_MobSSOperator+`",
            "`+_DeviceAuthCode+`",
            "`+_CheckInType+`")`
            
            let parmQuery =
            `INSERT INTO `+ table +
              ` `+_qFields+
              ` VALUES ` +_qValues

            return parmQuery;
      };
      return {insertAttendanceRecord : insertAttendanceRecord};
    })();//end of revealing module


    //Create AttendanceShadow record
    var strSQL = buildAttendanceRecordQuery.insertAttendanceRecord(data, "AttendanceShadow");
    //console.log("insert verify record "+strSQL);
  
    var query = connection.query(strSQL, function(err, result) {              
      if (err) {
        console.log("AttendanceSadow record create error"+err)
        
      } else {    
        //Do nothing

      }
      
      //Create Attendance record, regardless of what happened to AttendanceShadow
      var strSQL1 = buildAttendanceRecordQuery.insertAttendanceRecord(data, "Attendance");
      //console.log("insert verify record "+strSQL);
    
      var query = connection.query(strSQL1, function(err, result) {              
        if (err) {
          console.log(err)
          //immediate exit with error
          callback(err, null);
        } else {    
          console.log("Insert successful for ONE record")
          callback(null, result);
          
        }
      });//end of connection.query

    });//end of connection.query  


}; //end of handler



/**
  ================================================================================================
                                        Common functions
  ================================================================================================ 
*/
function appendAttendanceToEventArray ( eventArray, attendanceArray ) {  

  for (i=0 ; i < eventArray.length  ; i++){
    for (j=0 ; j < attendanceArray.length  ; j++){
      if (attendanceArray[j].eventID == eventArray[i].EventID){
        eventArray[i].count = attendanceArray[j].count
      }
    }
  }
  var eventArrayWithAttendance = eventArray
  return eventArrayWithAttendance
};

/**
================================================================================================ 
*/ 

exports.addAttendanceCountToEventList = function(connection, arrayOfEvents, callback) {

  var strSQL = "select count(*) as count, eventID from attendance group by eventID;";

  var query = connection.query(strSQL, function(err, arrayOfAttendanceCounts) {              
    if (err) {
      console.log("addAttendanceCountToEventList: count query error."+err)
      callback(err, null)

      
    } else {    
      
      var eventsWithAttendanceCounts =[]  
      eventsWithAttendanceCounts = appendAttendanceToEventArray (arrayOfEvents, arrayOfAttendanceCounts)
      callback(null, eventsWithAttendanceCounts)

    }
  })

}
