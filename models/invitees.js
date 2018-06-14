var datetime = require('fs');
var mysql    = require('mysql');


//////////////////////////////////////////////////////////
// Adds invitees to the invitees table
//////////////////////////////////////////////////////////

exports.addInvitee = function(connection, listID, badgeNumber, lastName, firstName, emailAddress, notificationNumber, numberFormat , callback) {


var buildInviteeQuery = (function() {
                    var insertInvitee = function(field1, field2, field3, field4, field5, field6, field7) {
    
                      var _ListID = field1;
                      var _badgeNumber = field2;
                      var _lastName = field3
                      var _firstName = field4
                      var _emailAddress = field5
                      if (field6 == "") { _notificationNumber = 0} else {var _notificationNumber = field6}
                      var _notificationFormat = field7
                      
                      var _d = new Date();
                      var _t = _d.getTime(); 
                      var _updateTime = _t;
                      var _qFields = '(InvitationListID, BadgeNumber, LastName, FirstName, EmailAddress, NotificationNumber,NumberFormat, updateTime)';
                      var _qValues = '("'+_ListID+'", "'+_badgeNumber+'", "'+_lastName+'", "'+_firstName+'", "'+_emailAddress+'", '+_notificationNumber+', "'+_notificationFormat+'", "'+_updateTime+'")';                                                      
                      var parmQuery = 'INSERT INTO Invitees '+_qFields+' VALUES ' +_qValues;
                      return parmQuery;
               };
               return {insertInvitee : insertInvitee};
              })();//feb--end of revealing module

  var strSQL = buildInviteeQuery.insertInvitee(listID, badgeNumber, lastName, firstName, emailAddress, notificationNumber, numberFormat);
  console.log("insert invitee "+strSQL);
  var query = connection.query(strSQL, function(err, result) {

                  
                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    callback(err, null);
                  } else {
                    //console.log(err);
                    callback(null, result);
                };
                });//feb--end of connection.query
}; //feb--end of post handler




/////////////////////////////////////////
// Creates the actual list of INVITEES //
/////////////////////////////////////////
exports.createInvitees = function(connection, ListName, ListComment, callback) {


var buildInviteesQuery = (function() {
                    var insertInvitees = function(field1, field2) {
    
                      var _ListName = field1;
                      var _ListComment = field2;
                      
                      
                      var _d = new Date();
                      var _t = _d.getTime(); 
                      var _updateTime = _t;
                      var _qFields = '(ListName, ListComment, updateTime)';
                      var _qValues = '("'+_ListName+'", "'+_ListComment+'", "'+_updateTime+'")';                                                      
                      var _qUpdates = 'ListName="'+_ListName+'", ListComment="'+_ListComment+'"'+', updateTime="'+_updateTime+'"';
                      var parmQuery = 'INSERT INTO Invitees'+_qFields+' VALUES ' +_qValues+ ' ON DUPLICATE KEY UPDATE '+_qUpdates;
                      var invSQL = "INSERT into Invitees (InvitationListID, BadgeNumber, LastName, FirstName, EmailAddress, NotificationNumber, NumberFormat, UpdateTime) VALUES (LAST_INSERT_ID(),"+"'"+data[i][4]+"', "+ escapeName+", "+ escapeFirstName+", '', 0,'',"+_updateTime+")";

                      return parmQuery;
               };
               return {insertInvitees : insertInvitees};
              })();//feb--end of revealing module

  var strSQL = buildInviteesQuery.insertInvitees(ListName, ListComment);
  console.log("insert invite list "+strSQL);
  var query = connection.query(strSQL, function(err, result) {

                  
                 if (err) {
                    console.log(err)
                    sess.error = 'There was a problem updating the mobss database: '+err;
                    connection.end();
                    callback(err, null);
                  } else {
                    //console.log(err);
                    callback(null, result);
                };
                });//feb--end of connection.query
}; //feb--end of post handler

