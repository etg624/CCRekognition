//////////////////////////////////////////////////////////////////////////////////////////////
//  Common handler for reading through a CSV file and inserting those records into the      //
//  evacuation table.                                                                       //
//////////////////////////////////////////////////////////////////////////////////////////////
//###### Sun Apr 22 15:04:12 PDT 2018 Cler tables first and only process INFILE for OTHER file format for now

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var db = require('../models/db');
var csvProcess = require('./csvProcess');
var clearTables = require('../models/clearTables');


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Display page for evactuation list import                                                                     //  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//###### Sat Apr 21 09:56:35 PDT 2018 Initialize the error/success messages
exports.evacuationHome = function(req, res) {
  sess=req.session;
  sess.error = null;
  sess.success=null;

  var name = req.query.name;
  if (typeof sess.username == 'undefined'){
    res.render('home', { title: 'Command Center'});
    // if user is logged in already, take them straight to the dashboard list
    }else{

    res.render('evacuationHome', { title: 'Command Center'});
};
};


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  Display page for evactuation list import                                                                     //  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// handler for form submitted from homepage
exports.evacuationCSV_OLD = function(req, res) {
   
  
		
  if (req.body.directorySource == undefined) {
    var csvFileName = req.body.fileName;

  } else{
    var csvFileName = req.body.directorySource + req.body.fileName;
  }
 console.log("getting this far"+ JSON.stringify(csvFileName))
  csvProcess.csvIngest(csvFileName, 'evacuation', function(err, result){ 
      if (err) {
        console.log('Error while performing evacuation: ' + err);
        sess.error = 'Error while performing evacuation list creation';
        sess.success = null;
        res.render('evacuationHome', { title: 'Command Center'});

      } else {
        console.log('successful ingestion CSV to evacuation: ' + err);
        sess.error = null;
        sess.success = 'successfully created evacuation list';
        res.render('evacuationHome', { title: 'Command Center'});
      }
    });

};


////////////////////////////////////////////////////////
//  Load the csv evac file into the evacuation table  //
////////////////////////////////////////////////////////
//###### Sun Apr 22 14:54:49 PDT 2018 Assume Default OTHER format for now
exports.evacuationCSV = function(req, res) {
  sess.success = null;
  sess.error = null;
  var strSQL = "";
  var query = null;

  /**
   * Ensure a filename is entered, either through the browse button, or manually.
   * Manual option was added for the beta customer who appeared to be getting 
   * an odd network type path back from the browse input
   */

   // make sure at least one of the two is entered
   if (req.body.fileName == '' && req.body.fileNameEntered == '') {
      sess.error = 'Either browse for OR enter a file name';
      res.render('evacuationHome', { title: 'Command Center'});
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


  // Ensure file extension is valid.  Catches user entry of valid directory and file name but invalid file extension
  var fileExtension = path.extname(csvFileName);
  console.log("the file extension is "+fileExtension);
  console.log("the filename BEFORE the INFILE "+csvFileName);
 
  /**
   * set the case for the whether the MYSQL db is local or remote from the app .env file.
   * if remote, use LOAD LOCAL for the INFILE, as RDS (and perhaps other remote instances)
   * can't be configured to use regular INFILE.  Dong this largely because RDS is 
   * not set up to allow regular INFILE but DOES allow LOAD LOCAL, and at least one customer
   * has a localhost MySQL which does not allow LOCAL.
   * So we will configure the front part of the INFILE SQL statement based on our .env variable.
   */
  

  var dbLoc = process.env.LOCAL_INFILE;
  var strPrepend = "";

  //switch (dbLoc)
  //{
  //   case "OFF":
  //      strPrepend = 'LOAD DATA INFILE '
  //      break;

  //  default: 
      strPrepend = 'LOAD DATA LOCAL INFILE '
  //}

  db.createConnection(function(err,reslt)
  {  
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        callback(err, null);
      }else{
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;
        console.log('here is the csvImport connnection '+reslt.threadId);
        
        
        /**
         *
         * Default to use MySQL INFILE function
         * to directly load people, empbadge and accesslevels tables from the csv file
         * this is considered up to 20 times faster than INSERT
         * file to table mapping can be controlled through @variables and @dummy
         *
         * Create the InviteList first, and then if successful, 
         * INFILE the csv into the invitees table
         * 
         */
        console.log('process env '+process.env.INFILE_DISABLED);
        if (process.env.INFILE_DISABLED == 'YES') {
          console.log('Evac requires INFILE enabled: ' + err);
          callback(err, 'failed');
          

          // switch (process.env.EXPORT_SOURCE)
          //  {
          //    case 'OTHER':
          //     csvImportInsert.insertInvite(connection, csvFileName, listName, listComment, function(err, res2){ 
          //           if (err) {
          //             console.log('Error while performing Invite insert proessing: ' + err);
          //             sess.error = 'There was a problem importing csv file to the people table';
          //             callback(err, 'failed');
          //             connection.end();
          //           } else {        
          //             sess.success ='Update was successful.';
          //             callback(null, 'success');
          //           }
          //     });
          //        break;
            
          //     case 'S2':   
          //     csvImportInsertS2.insertInvite(connection, csvFileName, listName, listComment, function(err, res2){ 
          //           if (err) {
          //             console.log('Error while performing S2 INSERT proessing: ' + err);
          //             sess.error = 'There was a problem importing csv file to the INVITEES table';
          //             callback(err, 'failed');
          //             connection.end();
          //           } else {        
          //             sess.success ='Update was successful.';
          //             callback(null, 'success');
          //           }
          //     });   
          //        break;

          //     default: 
          //       sess.error = 'Cannot create invitation lists with INFILE disabled and source data = '+process.env.EXPORT_SOURCE; 
          //       callback(err, 'failed'); 
          //       connection.end(); 
          //   }

          //INFILE is enabled
          }else{

            //###### Sun Apr 22 15:02:27 PDT 2018 First clear tables
            clearTables.clearAllFromTable(connection, 'evacuation', function(err,rslt){
              if (err) {
                console.log('Error while performing evac table clear: ' + err);
               // if (caller == 'manual'){sess.error = 'There was a problem clearing the table';}
                connection.end();
                callback(err, null);
              }else{


          //Some export sources require INSERT processing, despite INFILE being available 
        // if (process.env.EXPORT_SOURCE=="S2"){
          //  console.log('Evac requires INFILE enabled: ' + err);
          //  callback(err, 'failed');
            // csvImportInsertS2.insertInvite(connection, csvFileName, listName, listComment, function(err, res2){ 
            //     if (err) {
            //       console.log('Error while performing INFILE proessing: ' + err);
            //       sess.error = 'There was a problem importing csv file to the INVITEES table';
            //       callback(err, 'failed');
            //       connection.end();
            //     } else {        
            //       sess.success ='Update was successful.';
            //       callback(null, 'success');
            //     }
            //   });
         // }else{

          //Use INFILE to import the lists  
         
            /**
             * Format the date.  Timestamp for the db and then late needs to be converted to display
             * format whenever needed for screen display.
             * Was previously using CURRENT_TIMESTAMP in the INFILE SQL statement but this produces a long
             * spelled out date and time
             */
            //var _updateTime = new Date();  // this one produces a very long string, too long for legacy installs
              var _d = new Date();
              var _t = _d.getTime(); 
              var _updateTime = _t;
            /**
             * Ensure the filename is in forward slash formats. 
             * return the full path from the form input file-type AND with back slashes
             * Browsers  will only return the filename and not the path.   this is a 
             * security policy by the major browsers.   There doesnt seem to be a way
             * for the user to select a path/filename and have the path come back from 
             * the browser.  The actual path is not returned by the browser
             */
            csvFileName = csvFileName.replace(/\\/g, "/");

            /////////////////////////////////////////////////////////////////////////////
            //  This format is for a simple csv that comports with the table structure //
            /////////////////////////////////////////////////////////////////////////////
            // strSQL = "LOAD DATA LOCAL INFILE "+ "'"+csvFileName+"'"+" INTO TABLE Invitees FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (BadgeNumber, LastName, FirstName,  EmailAddress, NotificationNumber, NumberFormat) SET  UpdateTime = CURRENT_TIMESTAMP, InvitationListID = LAST_INSERT_ID()";


            ///////////////////////////////////////////////////////////////////////////////////////////////
            //  Whereas this format is for the beta customer who sent csv files in the cardholder format //
            ///////////////////////////////////////////////////////////////////////////////////////////////
            //strSQL = "LOAD DATA LOCAL INFILE "+ "'"+csvFileName+"'"+" INTO TABLE Invitees FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (@dummy, LastName, FirstName, @dummy, BadgeNumber) SET  UpdateTime = CURRENT_TIMESTAMP, InvitationListID = LAST_INSERT_ID()";
           
            /**
             * Two Source formats currently distinguished -- regular and ACM 
             * 
             */
            //if (process.env.EXPORT_SOURCE == "ACM"){
             
               // strSQL = strPrepend+ "'"+csvFileName+"'"+" INTO TABLE Invitees FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (@dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy,  FirstName, LastName, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, EmailAddress, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy,BadgeNumber) SET InvitationListID = LAST_INSERT_ID(), UpdateTime ="+_updateTime;

             // }else{
                  //Process for export source OTHER
                  strSQL = strPrepend+"'"+csvFileName+"'"+" INTO TABLE evacuation FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (empID, LastName, FirstName, title, iClassNumber, imageName) SET  updateTime ="+_updateTime;

             // }    

              
            query = connection.query(strSQL, function(err, result) {

          
             if (err) {
                console.log(err)
                sess.error = 'There was a problem importing csv file to the evacuation table';
                connection.end();
                res.render('evacuationHome', { title: 'Command Center'});   

                
              } else {
                sess.success ='Update was successful.';
                console.log('sess.success= '+sess.success);
                connection.end();
                res.render('evacuationHome', { title: 'Command Center'});   

              }

            });
          }
        });
                
         // }//else on the S2 if

         } 

        }
    });
};

