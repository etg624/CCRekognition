
var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var csvImport = require('./csvImport');
var db = require('../models/db');
//###### Tue Oct 3 06:38:06 PDT 2017 detect line endings
var crlf = require('crlf-helper');




////////////////////////////////////////////////////////////////////////////////////                                                           
// handler for displaying all invite lists
////////////////////////////////////////////////////////////////////////////////////
exports.inviteLists = function(req, res) {

	sess=req.session;
  sess.rptError =null;
  sess.rptSuccess =null;
    console.log('OR OR am i getting to IL '+req.eventID);

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


          var _sqlQ = "SELECT * FROM InviteList";
          connection.query(_sqlQ, function(err, results) {
            //connection.release();
            if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
          
	          connection.end();
	          console.log('here are the invite lists '+JSON.stringify(results));
            var eventRelatedListing  = 0;
	          res.render('inviteLists', { title: 'Command Center - Invite lists', username: req.session.username, results, eventRelatedListing : eventRelatedListing });
          });
        } 
      });

        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};


////////////////////////////////////////////////////////////////////////////////////                                                           
// handler for displaying invite lists
////////////////////////////////////////////////////////////////////////////////////
exports.inviteListsforEvent = function(req, res) {

  sess=req.session;
  sess.rptError =null;
  sess.rptSuccess =null;
  console.log('am i getting to ILFE '+req.params.eventID);
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


          var _sqlQ = "SELECT * FROM InviteList";
          connection.query(_sqlQ, function(err, results) {
            //connection.release();
            if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
          
	          connection.end();
            var eventRelatedListing  = 1;
	          res.render('inviteLists', { title: 'Command Center', username: req.session.username, eventID : req.params.eventID, results, eventRelatedListing });
          });
        } 
      });

        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
}


////////////////////////////////////////////////////////////////////////////////////                                                           
// handler for displaying invite lists so that change can be made
////////////////////////////////////////////////////////////////////////////////////
exports.inviteListsChangeforEvent = function(req, res) {

  sess=req.session;
  sess.rptError =null;
  sess.rptSuccess =null;
  console.log('am i getting to ILFE '+req.params.eventID);
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


          var _sqlQ = "SELECT * FROM InviteList";
          connection.query(_sqlQ, function(err, results) {
            //connection.release();
            if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
          
            connection.end();
            res.render('inviteListsChange', { title: 'Command Center - Invite lists Change', username: req.session.username, eventID : req.params.eventID, invitationListID : req.params.invitationListID, eventName : req.params.eventName, results });
          });
        } 
      });

        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};


////////////////////////////////////////////////////////////////////////////////////                                                           
// handler for  processing csv file ingest submit request
////////////////////////////////////////////////////////////////////////////////////
exports.inviteListsAddforEvent = function(req, res) {

  sess=req.session;
  sess.rptError =null;
  sess.rptSuccess =null;
  console.log('am i getting to ILFE '+req.params.eventID);
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


          var _sqlQ = "SELECT * FROM InviteList";
          connection.query(_sqlQ, function(err, results) {
            //connection.release();
            if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
          
            connection.end();
            res.render('inviteListsAdd', { title: 'Command Center', username: req.session.username, eventID : req.params.eventID, invitationListID : req.params.invitationListID, eventName : req.params.eventName, results });
          });
        } 
      });

        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};


////////////////////////////////////////////////////////////////////////////////////                                                           
// handler for showing the invite add form
////////////////////////////////////////////////////////////////////////////////////
exports.inviteAdd = function(req, res) {
  sess=req.session;
  sess.error =null;
  sess.success =null;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

    var name = req.query.name;
    
    res.render('inviteAdd', { title: 'Command Center - Add Invite'});
 };
};


////////////////////////////////////////////////////////////////////////////////////                                                           
// handler for processing csv file through INFILE MySQL functionality             //
////////////////////////////////////////////////////////////////////////////////////
exports.inviteIngest = function(req, res) {
  sess = req.session;
  sess.error = null;
  sess.success=null;
  var csvFileName = '';
  
  console.log (JSON.stringify(req.body.directorySource));
  //Ensure a file name is entered and determine which entry field was used
  console.log('filenames '+  JSON.stringify(req.body.fileNameEntered))

  /**
   * Ensure a filename is entered, either through the browse button, or manually.
   * Maual option was added for the beta customer who appeared to be getting 
   * an odd network type path back from the browse input
   */

   // make sure at least one of the two is entered
   if (req.body.fileName == '' && req.body.fileNameEntered == '') {
      sess.error = 'Either browse for OR enter a file name';
      res.render('inviteAdd', { title: 'Command Center - Add Invite', username: sess.username, success: sess.success});
      return;
    }else{

      // use the manual entry if no browse input
      if (req.body.fileName ==undefined || req.body.fileName =='' ){
        console.log("ENTERED "+JSON.stringify(req.body.fileNameEntered))
        csvFileName = req.body.fileNameEntered;
      }else{
        csvFileName = req.body.fileName;
      }
  } 

  /**
   * Use the directory path, if entered
   *             
   */
  if (req.body.directorySource == undefined ) {
    csvFileName = csvFileName;

  } else{
    var csvFileName = req.body.directorySource + csvFileName;
    console.log('csvFileName '+csvFileName)

  }
  var listName = req.body.listName;
  var listComment = req.body.listComment;
  // Ensure file extension is valid.  Catches user entry of valid directory and file name but invalid file extension
  var fileExtension = path.extname(csvFileName);
  console.log("the file extension is "+fileExtension);
  //if (fileExtension =='.csv') {
  if (fileExtension == '.csv' || fileExtension == '.CSV'){
	//First check that this is a valid directory and filename
  //addded this line to see what stats can be attained ftom the fs module
  fs.stat(csvFileName, function(error, stats) { console.log(stats); });
  fs.readFile(csvFileName, {
  //fs.readFile(req.body.fileName, {
      encoding: 'utf-8'
    }, function(err, csvData) {
          if (err) {
          sess.error = 'File not found -- "'+csvFileName+'" -- Please check directory and file name.';
         
          res.render('inviteAdd', { title: 'Command Center - Add Invite', username: sess.username, success: sess.success});
          } else {
  
            //###### Tue Oct 3 06:33:50 PDT 2017
            //PB 2017.09.28 detect line endings and adjust infile syntax accordingly
            // Need to change this read to just get the first line of the file if possible
            var text = fs.readFileSync(csvFileName,'utf8')
            var lineEnding = crlf.getLineEnding(text);
            console.log("This is the CR?LF? for this INVITE file -- "+lineEnding);
            // CRLF line ending detection

            // passing as variable the screen inputted directory and filename for the csv
            // NOTE: res2 so that this subbordinate function can access the original http res variable

            //###### Tue Oct 3 06:29:16 PDT 2017 Add the lineEnding parameter
            csvImport.importInvite(csvFileName, listName, listComment, lineEnding, function(err, res2){ 
                    if (err) {
                      console.log('Error while performing INFILE proessing: ' + err);
                      res.render('inviteAdd', { title: 'Command Center', username: sess.username, success: sess.success });
                    } else {
                      res.render('inviteAdd', { title: 'Command Center', username: sess.username, success: sess.success });
                    }
            });
          }   
  });  

}else{
  console.log ("wrong file type")
  sess.error = 'Invalid file type -- "'+csvFileName+'" -- Import files should be  .csv file types.';
  res.render('inviteAdd', { title: 'Command Center', username: sess.username, success: sess.success });
}
              
}; //feb--end of exports.csvIngest


////////////////////////////////////////////////////////////////////////////////
//  Handler for displaying the list of invitees for a particular InvistListID //
////////////////////////////////////////////////////////////////////////////////
exports.invitees = function(req, res) {

  sess=req.session;
  sess.rptError =null;
  sess.rptSuccess =null;
    

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
          var listName ='';
          console.log('here is the connnection '+reslt.threadId);


          var _sqlQ = "SELECT * FROM Invitees where InvitationListID="+req.params.invitationListID;
          connection.query(_sqlQ, function(err, results) {
            //connection.release();
            console.log('RESULTS>>> '+JSON.stringify(results));
            if(err) { console.log('invitee query bad'+err); callback(true); connection.end(); return; }
          
            var _sqlQ1 = "SELECT ListName FROM InviteList where InvitationListID="+req.params.invitationListID;
            connection.query(_sqlQ1, function(err, results2) {
            //connection.release();
            if(err) { console.log('invite list query bad'+err); callback(true); connection.end(); return; }


                      connection.end();
                      if (results2.length > 0) {listName=results2[0].ListName};
                      res.render('invitees', { title: 'Command Center - Invitees', username: req.session.username, invitationListID : req.params.invitationListID, results, listName : listName });
            });
          });
        } 
      });

        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};

