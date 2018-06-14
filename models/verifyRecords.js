//###### Sat Nov 11 11:36:54 EST 2017 - New handler to support API
//VerifyRecords were previously created in postverify.lc from syncToServer 
//in the App

var datetime = require('fs');
var mysql    = require('mysql');
var db = require('./db');




/////////////////////////////////////////
// Creates a VerifyRecord 
/////////////////////////////////////////
exports.createVerifyRecord = function(connection, data, callback) {

//  +---------------+-------------+------+-----+---------+-------+
//  | Field         | Type        | Null | Key | Default | Extra |
//  +---------------+-------------+------+-----+---------+-------+
//  | ScanDateTime  | varchar(30) | NO   |     | NULL    |       |
//  | ScanDate      | varchar(20) | NO   |     | NULL    |       |
//  | ScanTime      | varchar(15) | NO   |     | NULL    |       |
//  | ScanSeconds   | varchar(15) | NO   |     | NULL    |       |
//  | ClientSWID    | varchar(20) | NO   |     | NULL    |       |
//  | MobSSOperator | varchar(40) | YES  |     | NULL    |       |
//  | AcsLvlID      | int(11)     | NO   |     | NULL    |       |
//  | BadgeID       | bigint(20)  | NO   |     | NULL    |       |
//  | Result        | varchar(3)  | NO   |     | NULL    |       |
//  | BadgeStatusID | varchar(3)  | NO   |     | NULL    |       |
//  | EmpID         | varchar(40) | YES  |     | NULL    |       |
//  | RecordStatus  | varchar(10) | NO   |     | NULL    |       |
//  | InOutType     | varchar(10) | YES  |     | NULL    |       |
//  +---------------+-------------+------+-----+---------+-------+

var buildVerifyRecordQuery = (function() {

          var insertVerifyRecord = function(fields) {
            //console.log("can i access the JSON iside the revealing module" + JSON.stringify(fields))
            
            
            var _scanDateTime =fields.ScanDateTime
            var _scanDate = fields.ScanDate
            var _scanTime = fields.ScanTime
            var _scanSeconds = fields.ScanSeconds
            var _clientSWID = fields.ClientSWID
            var _mobssOperator = fields.MobssOperator
            var _acsLvlID = fields.AcsLvlID
            //###### Sat Apr 21 13:31:39 PDT 2018 Handle the case where the app sends a blank access level ID
            if (_acsLvlID == "") {_acsLvlID=1}
            
            var _badgeID = fields.BadgeID
            var _result = fields.Result
            ///var _badgeStatusID = fields.BadgeStatusID // ATTN:
            var _badgeStatusID = "1"
            
            var _empID = fields.EmpID
            var _recordStatus = fields.RecordStatus
            var _inOutType = fields.InOutType
          
            let _qFields =
            `(ScanDateTime,
            ScanDate,
            ScanTime,
            ScanSeconds,
            ClientSWID,
            MobssOperator,
            AcsLvlID,
            BadgeID,
            Result,
            BadgeStatusID,
            EmpID,
            RecordStatus,
            InOutType)`

            let _qValues =
            `("`+_scanDateTime+`",
            "`+_scanDate+`",
            "`+_scanTime+`",
            "`+_scanSeconds+`",
            "`+_clientSWID+`",
            "`+_mobssOperator+`",
            "`+_acsLvlID+`",
            "`+_badgeID+`",
            "`+_result+`",
            "`+_badgeStatusID+`",
            "`+_empID+`",
            "`+_recordStatus+`",
            "`+_inOutType+`")`
            
            let parmQuery =
            `INSERT INTO verifyrecords
              `+_qFields+
              ` VALUES ` +_qValues

            return parmQuery;
      };
      return {insertVerifyRecord : insertVerifyRecord};
    })();//end of revealing module

  

    var strSQL = buildVerifyRecordQuery.insertVerifyRecord(data);  
  
    var query = connection.query(strSQL, function(err, result) {              
      if (err) {
        console.log(err)
        //immediate exit with error
        callback(err, null);
      } else {    
        console.log("Insert successful for ONE record")
        callback(null, result);
        
      }
    });//end of connection.query


}; //end of post handler



//////////////////////////////////////////////////////////////////////////////////////////
// Updates verifyrecords to reflect the record was successfully sent to an external system 
//////////////////////////////////////////////////////////////////////////////////////////

exports.updateSentVerifyRecord = function(data, callback) {

  db.createConnection(function(err,reslt){  
    if (err) {
      console.log('Error while performing common connect query: ' + err);
      callback(err, null);
    }else{
      //process the i/o after successful connect.  Connection object returned in callback
      var connection = reslt;


          var strSQL = "UPDATE verifyrecords SET RecordStatus = 'MobSS' WHERE ScanDateTime ="+data.ScanDateTime+" AND BadgeID="+data.BadgeID;
           // console.log("Update sent verify record "+strSQL);
          
          
            var query = connection.query(strSQL, function(err, result) {              
              if (err) {
                console.log(err)
                //immediate exit with error
                callback(err, null);
              } else {    
                console.log("Update successful for ONE record")
                callback(null, result);
                
              }
            });//end of connection.query
    }
  })
}  
