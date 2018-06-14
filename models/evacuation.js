var datetime = require('fs');
var mysql    = require('mysql');
var db = require('./db');


///////////////////////////////////////////////////////////////
// create the evacuation list table                          //
///////////////////////////////////////////////////////////////
module.exports.createEvacuationList = function(field1, field2, field3, field4, field5, field6, callback){

  
  db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);


          var buildEvacuationQuery = (function() {
            var createEvacuationList = function(field1, field2, field3, field4, field5,field6) {

              var _FirstName = field1;
              var _LastName = field2;
              var _iClassNumber = field3;
              var _updateTime = new Date();
              var _empID = field4;
              var _Status = null;
              var _UserName = null;
              var _image = field6;
              var _title = field5;
              var _imageName = field6;
              var _hasImage = "Yes";
              var _qFields = '(FirstName, LastName, iClassNumber, updateTime, empID, Status, UserName, image, title, imageName, hasImage)';
              var _qValues = '("'+_FirstName+'", "'+_LastName+'", "'+_iClassNumber+'", "'+_updateTime+'", "'+_empID+'", "'+_Status+'", "'+_UserName+'", "'+_image+'", "'+_title+'", "'+_imageName+'", "'+_hasImage+'")';                                                      
              var _qUpdates = 'FirstName="'+_FirstName+'", LastName="'+_LastName+'"'+', iClassNumber="'+_iClassNumber+'"'+', updateTime="'+_updateTime+'"'+', empID="'+_empID+'"'+', Status="'+_Status+'"'+', UserName="'+_UserName+'"'+', image="'+_image+'"'+', title="'+_title+'"'+', imageName="'+_imageName+'"'+', hasImage="'+_hasImage+'"';
              var parmQuery2 = 'INSERT INTO peeps (Name, occupation) VALUES ("rooby", "tacintyre") ON DUPLICATE KEY UPDATE Name="rooby", occupation="tacintyre"';
              var parmQuery3 = 'INSERT INTO evacuation '+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
              //console.log('parmQuery3= '+parmQuery3);
              return parmQuery3;
            };
            return {createEvacuationList : createEvacuationList};
          })();//feb--end of revealing module

          var strSQL = buildEvacuationQuery.createEvacuationList(field1, field2, field3, field4, field5, field6);
     
              var query = connection.query(strSQL, function(err, result) {

               if (err) {
                  console.log(err)
                  sess.error = 'There was a problem creating the evacuation list: '+err;
                  callback(err, result);
                } else {
                  
                  console.log('all ok creating the evacuation list');
                  callback(null, result);

                };
              });//feb--end of connection.query
        }
  });             

};

///////////////////////////////////////////////////////////////
// get the evacuation list                                   //
///////////////////////////////////////////////////////////////
module.exports.getEvacuationList = function(callback){
  

  db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          var strSQL = 'SELECT * FROM evacuation';
              //console.log('strSQL= '+ strSQL);  
          var query = connection.query(strSQL, function(err, result) {
             
              //if (err) throw error;
               if (err) {
                  console.log(err)
                  connection.end();
                  sess.error = 'There was a problem creating the evacuation list: '+err;
                  callback(err, result);
                } else {
                  connection.end();
                  console.log('all ok creating the evacuation list');
                  callback(null, result);

                }
              });
        }
  });
};

///////////////////////////////////////////////////////////////
// Update the unaccounted table                              //
///////////////////////////////////////////////////////////////
//###### Wed May 02 18:27:05 PDT 2018 Update the unaccounted table during the live muster
module.exports.updateUnaccounted = function(musterID, resEvacDisplay, callback){
  
    db.createConnection(function(err,reslt){  
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        callback(err, null);
      }else{
        var connection = reslt
      //--
      // Delete all from the unaccounted table
      var _sqlQU = 'DELETE FROM unaccounted where MusterID='+musterID
      connection.query(_sqlQU, function(err) {
        if (err) throw err;

          //--
          // Insert the remaining evacuees back into the table

          // Get the timestamp
          var _d = new Date();          
          var _t = _d.getTime(); 
          var _updateTime = _t;

          // Prepare the array for a bulk insert
          var insertArray = []
          for (var n=0; n < resEvacDisplay.length; n++) {

            // Replace nulls with blanks
            if (resEvacDisplay[n].EmailAddress==null){
              resEvacDisplay[n].EmailAddress = ""
            }
            if (resEvacDisplay[n].NotificationNumber==null){
              resEvacDisplay[n].NotificationNumber = ""
            }
            if (resEvacDisplay[n].EmergContactNumber==null){
              resEvacDisplay[n].EmergContactNumber = ""
            }
            //###### Jun 5 2018
            if (resEvacDisplay[n].LastName=="Linklater"){
              console.log("HERE is the notification number for linklater "+JSON.stringify(resEvacDisplay[n].NotificationNumber))
             }
            
            insertArray.push([resEvacDisplay[n].iClassNumber, resEvacDisplay[n].LastName, resEvacDisplay[n].FirstName, _updateTime,"", "", "", "", resEvacDisplay[n].EmailAddress, resEvacDisplay[n].NotificationNumber,resEvacDisplay[n].EmergContactNumber,musterID])
          }
                
                //-- NOTE: this is the array format for bulk insert
                //   var values = [
                //       ['demian', 'demian@gmail.com', 1],
                //       ['john', 'john@gmail.com', 2],
                //       ['mark', 'mark@gmail.com', 3],
                //       ['pete', 'pete@gmail.com', 4]
                //   ];

          var sql = "INSERT IGNORE INTO unaccounted (iClassNumber, LastName, FirstName, updateTime, image, title, imageName, hasImage, EmailAddress, NotificationNumber, EmergContactNumber, MusterID) VALUES ?";
  
          connection.query(sql, [insertArray], function(err, result) {
              if (err) {
                console.log('Error while performing bulk Unaccounted insert: ' + err);
                callback(err, null);
              }else{
              
              connection.end();
              callback(null,result)
              }

          })
        })
      }
    })

}

///////////////////////////////////////////////////////////////
// get the unaccounted people                                //
///////////////////////////////////////////////////////////////
//###### Wed May 04 18:27:05 PDT 2018 Get only for the musterID concerned

module.exports.getUnaccounted = function(scope, musterID, callback){
  

  db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
         
          if(scope=="Email"){
            var strSQL = 'SELECT EmailAddress FROM unaccounted WHERE MusterID='+musterID;
          }else{
            var strSQL = 'SELECT * FROM unaccounted WHERE MusterID='+musterID;
          }

          var query = connection.query(strSQL, function(err, result) {
             
               if (err) {
                  console.log(err)
                  connection.end();
                  sess.error = 'There was a problem obtaining the list of unaccounted: '+err;
                  callback(err, null);
                
                } else {
                  connection.end();
                  console.log('all ok retrieving the unaccounted list');
                  callback(null, result);

                }
              });
        }
  });
};
