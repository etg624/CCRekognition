///////////////////////////////////////////////////////
//  Common module for all csv file import processing //
///////////////////////////////////////////////////////

var mysql    = require('mysql');
var fs  = require('fs');
var clearTables = require('../models/clearTables');
var db = require('../models/db');
var inviteList = require('../models/inviteList');
var csvImportInsert = require('./csvImportInsert');
var csvImportInsertS2 = require('./csvImportInsertS2');
//PB 2017.09.28 detect line endings and adjust infile syntax accordingly
var crlf = require('crlf-helper');
//###### Thu Dec 19 05:55:01 PDT 2017 Call New module to pad one of the credenital fields in the AMAG export
var padZerosToAMAG =require('./padZerosToAMAG');
var path = require( 'path' );


//////////////////////////////////////////////////////
//  Handler for importing the cardholder csv file   //
//////////////////////////////////////////////////////
exports.inFile = function(csvFileName, caller, fileExtension, lineEnding, callback) {
  if (caller == 'manual'){sess.success = null;sess.error = null;}
  var strSQL = "";
  var query = null;

  /**
   * set the case for the wether the MYSQL db is local or remote from the app .env file.
   * if remote, use LOAD LOCAL for the INFILE, as RDS (and perhaps other remote instances)
   * can't be configured to use regular INFILE.  Dong this largely because RDS is 
   * not set up to allow regular INFILE but DOES allow LOAD LOCAL, and at least one customer
   * has a localhost MySQL which does not allow LOCAL.
   * So we will configure the front part of the INFILE SQL statement based on our .env variable.
   */

  var dbLoc = process.env.LOCAL_INFILE;
  var strPrepend = "";

  switch (dbLoc)
  {
     case "OFF":
        strPrepend = 'LOAD DATA INFILE '
        break;

    default: 
      strPrepend = 'LOAD DATA LOCAL INFILE '
  }
   
  db.createConnection(function(err,reslt){  
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        callback(err, null);
      }else{
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;
        console.log('here is the csvImport connnection '+reslt.threadId);

        //###### Tue Nov 14 07:15:18 PST 2017 Need to put these into temp tables and then restore
        //if there is any errors in the inporting process
        //First clear existing records from the 3 tables
        clearTables.clearAllFromTable(connection, 'people', function(err,rslt){
          if (err) {
            console.log('Error while performing people table clear: ' + err);
            if (caller == 'manual'){sess.error = 'There was a problem clearing the table';}
            connection.end();
            callback(err, null);
          }else{
          clearTables.clearAllFromTable(connection, 'accesslevels', function(err,rslt){
            if (err) {
              console.log('Error while performing accesslevels table clear: ' + err);
              if (caller == 'manual'){sess.error = 'There was a problem clearing the table';}
              connection.end();
              callback(err, null);
            }else{
              clearTables.clearAllFromTable(connection, 'empbadge', function(err,rslt){
                if (err) {
                  console.log('Error while performing empbadge table clear: ' + err);
                  if (caller == 'manual'){sess.error = 'There was a problem clearing the table';}
                  connection.end();
                  callback(err, null);
                }else{  

                  //Upon successful delete of all three tables Use MySQL INFILE function
                  //to directly load people, empbadge and accesslevels tables from the csv file
                  //this is considered up to 20 times faster than INSERT
                  //file to table mapping can be controlled the @variables (see @dummy below)
                  
                  /**
                   * Convert the filename to forward slash formats. 
                   * chrome and firefox Browsers  will only return the filename and not the path.   this is a 
                   * security policy by the major browsers.   IE returns path/filename. 
                   * 
                   */
                  console.log('filename BEFORE replace'+csvFileName);
                  csvFileName = csvFileName.replace(/\\/g, "/");
                  console.log('filename AFTER replace'+csvFileName);
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
                    

                  //###### Mon Oct 2 14:03:20 PDT 2017
                  //Set the line terminator for the INFILE statement based on the lineEnding parameter
                  var termBy = '\r\n'
                  if (lineEnding=="CRLF") {
                    termBy = '\r\n'
                    } else if (lineEnding=="LF"){
                      termBy = '\n'
                      } else if (lineEnding=="CR"){
                        termBy = '\r'
                          }else{
                          console.log("The file does not have supported line endings.  Detected line ending is: " +lineEnding)
                          }
                  
                  /**
                   * Condition INFILE statement based on incoming file format.
                   * Currently choices are AMAG(comma delim, encosed quote) or 
                   * regular CSV (commma delim)... [S2 requires INSERT processing]
                   * Quote in enclosure must be escaped
                   * Also added ImageName to people query and EXPIRY DATE processing to Empbadge table
                   */
                  //###### Wed Dec 27 12:44:07 PST 2017   AMAG is removed as an option as it now has a dedicated controller which is
                  //called from "import junction"[ csv.csvIngest]
                    var exSrc = process.env.EXPORT_SOURCE;

                    switch (exSrc)
                    {
                      
                      case "ACM":
                        strSQL = strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE people FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@var1, @var2, @dummy, @dummy, @dummy, @dummy, @dummy, FirstName, LastName, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, EmailAddr, Title, @dummy, Division, SiteLocation, Building, @dummy, @dummy, iClassNumber ) SET imageName=@var1, EmpID= @var2, Identifier1=@var2, updateTime ="+_updateTime;
                        
                        break;

                      //###### Mon Nov 13 17:10:56 PST 2017 Support for AccessNSite
                      case "ACCESSNSITE":
                        strSQL = strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE people FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (iClassNumber, LastName ) SET updateTime ="+_updateTime;
                                           
                        break;
                      
                      //###### Mon Feb 05 2018 17:10:56 PST 2017 Support for Alternative Defulat format, requested by AQR (simplified export from S2)
                      case "DEFAULT_B":
                        //Process for export source DEFAULT mobss file format B
                        // person_ID, LastName, FirstName, EmployeeId, cardNumber
                        strSQL = strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE people FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@dummy, LastName, FirstName, EmpID, iClassNumber) SET  updateTime ="+_updateTime;
                       
                        break;

                      default: 
                      /**
                     * \r\n doesnt work for certain files, possibly files opened, saved or created in notepad.
                     * Change to \n, which seems to wor for all file types tested
                     * This change was percolated 6/20/17 into the other two tables below and Beckenbauer
                     * REVERSED this 7/9/17 -- \n alone wasnt working properly.  There seems to be some inconsistency here.
                     * Needs to be MONITORED.  Possible that git changes line endings on .csv files?  it certianly sends warnings that
                     * it is checking line endings.  Notes on this can be found in Evernote.
                     * LATEST 2017.09.05 -- row delimiters vary based on machien file was generated on:
                     * windows machine \r\n
                     * Linux \n  (appears to be the LLU problem)
                     * Apple \r  (e.g. csv macintosh filetype option when saving in Excel)
                     * Wordpad (possibly also \r)
                     * There may be a way to prgrammatically autodetect this
                     * ACM (BCBS) export file seems to produce \n only
                     * 
                     * ###### Mon Oct 2 12:47:48 PDT 2017
                     * Cr, LF, and CRLF, which are are all valid csv line endings based on the OS (Win v Unix) and the specific package used
                     * to save the file.  hence, we now detect the line ending and adjust the INFILE TERMINATED BY syntax accordingly
                     */
                    
                      //Process for export source DEFAULT mobss file format
                      strSQL = strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE people FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (empID, LastName, FirstName, title, iClassNumber, imageName) SET  updateTime ="+_updateTime;
                      
                  } //end of switch
  
                        
                  console.log('People INFILE query'+strSQL);
                  query = connection.query(strSQL, function(err, result) {
              
                   if (err) {
                      console.log(err)
                      if (caller == 'manual'){sess.error = 'There was a problem importing csv file to the people table';}
                      callback(err, 'failed');
                      connection.end();
                      
                    } else {
                      ////////////////////////////////////////////////////////////////
                      // Remove any imported .jpg extension from the ImageName      //
                      ////////////////////////////////////////////////////////////////
                      /**
                       * Need to do this for .jpg and .JPG and .jpeg and .JPEG
                       */
                      
                      var jpgSQL = "update people set imageName = replace(replace(replace(replace(imageName,'.jpg',''),'.JPG',''), '.jpeg', ''), '.JPEG', '')"
                      //var jpgSQL = "UPDATE people SET imageName = REPLACE(imageName, '.JPG', '')"
                      query = connection.query(jpgSQL, function(err, result) {

                        if (err) { console.log('couldnt remove the .jpg extensions '+err);}
                         
                      });

                      //###### Mon Nov 13 18:31:17 PST 2017
                      //AccessNSite names come through in export concatenated like "Allen, Chris"
                      //So parse and split and arrange string into FirstName and LastName for our table
                      if (exSrc == "ACCESSNSITE"){
                        var parseNameSQL = "select LastName from people"
                        queryName = connection.query(parseNameSQL, function(err, resultN) {if (err) {console.log('people name parse didnt work --')}
                    
                          /**
                           * Loop through all the name records and parse them
                           */
                          for (var i=0 ; i <resultN.length; i++){ 
                           
                            var splitName = resultN[i].LastName,
                            fullName = splitName.split(','),
                            lastName = fullName[0],
                            firstName = fullName[fullName.length - 1];
                            //remove the leading space from the first name
                            firstName = firstName.trim(); 
                     
                            var firstLastSQL = "update people set LastName='"+lastName+"' ,FirstName='"+firstName+"' where LastName='"+splitName+"'"
                              queryName = connection.query(firstLastSQL, function(err, resultN) {if (err) {console.log('people name parse didnt work --')}
                                
                              })
                          
                          };
                        });
                      }
                        
                      ///////////////////////////////
                      // Create the EMPBADGE table //
                      ///////////////////////////////
                        /**
                         * Condition INFILE statement based on incoming file format.
                         * Currently eith AMAG(comma delim, encosed quote) or 
                         * CSV (commman delim)
                         * Quote in enclosure must be escaped
                         * Added processing for AMAG EXPIRY Date -- Currently using the updateTime field to
                         * Store the expiry date from the AMAG/Symmetry txt export file
                         * EMPBADGE TABLE FORMAT:
                         * EmpID
                         * iClassNumber
                         * StatusID
                         * StatusName
                         * updateTime
                         */
                        //###### Mon Oct 2 14:17:44 PDT 2017 use termBy to condition the line ending
                        
                         switch (exSrc)
                        {
                          case "AMAG":
                              strSQL =  strPrepend+"'"+csvFileName+"'"+" INTO TABLE empbadge FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' (@dummy, @dummy, @var1, @dummy, @dummy, @var2, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy, UpdateTime) SET iClassNumber = CONCAT(@var2, @var1), EmpID = CONCAT(@var2, @var1), StatusID ='1', StatusName = 'Active'";

                              break;
                          case "ACM":
                              strSQL =  strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE empbadge FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@dummy, @var2, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @var1, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy,@dummy, @dummy, iClassNumber) SET EmpID = @var2, StatusID ='1', StatusName = 'Active', updateTime ="+_updateTime;
                              break;
                          //###### Mon Nov 13 20:36:26 PST 2017 Support for AccessNSite
                          //export file format:    CardNum, Name, Validity, Expires, Site, BadgeFormat, AccessLevels 
                          case "ACCESSNSITE":
                              strSQL =  strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE empbadge FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (iClassNumber, @var1, StatusName, @var2) SET EmpID = @var1, StatusID ='1', updateTime = @var2";   
                              break;
                          
                          //###### Mon Feb 05 2018 17:10:56 PST 2017 Support for DEAFULT_B
                          // person_ID, LastName, FirstName, EmployeeId, cardNumber

                          case "DEFAULT_B":
                              strSQL =  strPrepend+"'"+csvFileName+"'"+" INTO TABLE empbadge FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@dummy, @dummy, @dummy, EmpID, iClassNumber) SET StatusID ='1', StatusName = 'Active', updateTime ="+_updateTime;
                              break;
                          
                          default: 
                          /**
                         * \r\n doesnt work for certain files, possibly files opened, saved or created in notepad.
                         * Change to \n, which seems to wor for all file types tested
                         * This change was percolated 6/20/17 into the other two tables below and Beckenbauer
                         * REVERSED this 7/9/17 -- \n alone wasnt working properly.  There seems to be some inconsistency here.
                         * Needs to be MONITORED.  Possible that git changes line endings on .csv files?  it certianly sends warnings that
                         * it is checking line endings.  Notes on this can be found in Evernote.
                         * 
                         * ###### Mon Oct 2 12:47:48 PDT 2017
                         * Cr, LF, and CRLF, which are are all valid line endings based on the OS (Win v Unix) and the specific package used
                         * to save the file.  hence, we now detect the line ending and adjust the INFILE TERMINATED BY syntax accordingly
                         */
                            //Process for export source OTHER (default mobss)
                            
                            strSQL =  strPrepend+"'"+csvFileName+"'"+" INTO TABLE empbadge FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (EmpID, @dummy, @dummy, @dummy, iClassNumber) SET StatusID ='1', StatusName = 'Active', updateTime ="+_updateTime;
                             
                        }


                       
                      query = connection.query(strSQL, function(err, result) {


                       if (err) {
                          console.log(err)
                          if (caller == 'manual'){sess.error = 'There was a problem importing the csv file to the empbadge table';}
                          callback(err, 'failed');
                          connection.end();
                          
                        } else {  

                          /**
                           * Set the empbadge records to INACTIVE for those records with EXPIRY DATE and time less than now
                           * Only do this for .txt files -- AMAG format.  Need to generalize this case later.
                           */
                          //###### Tue Nov 14 07:18:50 PST 2017 Do this for ACCESSNSITE records too
                          
                          if (exSrc=='AMAG' || exSrc=='ACCESSNSITE'){       
                          /**
                           * The AMAG and ACCESSNSITE dates come with slashes.  the str_to_date allows us to compare to the SQL operator CURDATE()
                           * Expiry dates are one minute before midnight on a particular day.  if we run the sweep after midnight
                           * we can simply ask if dat is before today and today is included as valid.
                           * Change all expired records to Inactive.  The reader understands this and Denies the badge
                           */
                              var activeSQL = "select * from empbadge where STR_TO_DATE(updateTime,'%m/%d/%Y')<CURDATE()"
                              query1 = connection.query(activeSQL, function(err, result2) {if (err) {console.log('empbadge INACTIVE didnt work --')}
                          
                              console.log('the str to date query '+JSON.stringify(result2))
                              /**
                               * Loop through all the "expired records" and change them to Inactive
                               */
                              for (var i=0 ; i <result2.length; i++){
                                var inactiveSQL = 'update empbadge set StatusID=2, StatusName="Inactive" where iClassNumber='+result2[i].iClassNumber 
                                console.log('inactive query '+inactiveSQL)
                                query2 = connection.query(inactiveSQL, function(err, result) {if (err) {console.log('empbadge INACTIVE didnt work --')}

                                });

                              };
                              });
                           } // End of the special processing for AMAG around expiry date

                           
                          //////////////////////////////////////////////////
                          // create ACCESSLEVELS records for each import  //
                          //////////////////////////////////////////////////
                           
                       /**
                         * Condition INFILE statement based on incoming file format.
                         * Currently eith AMAG(comma delim, encosed quote) or 
                         * CSV (commman delim)
                         * Quote in enclosure must be escaped
                         * AMAG does not come with a title line, so no IGNORE 1 LINES for that option
                         * 
                         * ACCESSLEVELS TABLE FORMAT
                         * BadgeID
                         * AccessLvlID
                         * AccessLvlName
                         * EmpID
                         * updateTime
                         * 
                         * ###### Mon Oct 2 12:47:48 PDT 2017
                         * Cr, LF, and CRLF, which are are all valid line endings based on the OS (Win v Unix) and the specific package used
                         * to save the file.  hence, we now detect the line ending and adjust the INFILE TERMINATED BY syntax accordingly
                         */
                          
                        switch (exSrc)
                        {
                          case "AMAG":
                              strSQL =  strPrepend+"'"+csvFileName+"'"+" INTO TABLE accesslevels FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' (@dummy, @dummy, @var1, @dummy, @dummy, @var2) SET BadgeID = CONCAT(@var2, @var1), EmpID = CONCAT(@var2, @var1), AccsLvlID = '1', AccsLvlName = 'Main', updateTime ="+_updateTime;

                              break;
                          case "ACM": 
                              strSQL =  strPrepend+"'"+csvFileName+"'"+" INTO TABLE accesslevels FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@dummy, @var2, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @var1, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, BadgeID) SET EmpID = @var2, AccsLvlID = '1', AccsLvlName = 'Main', updateTime ="+_updateTime;
                              
                          break;
                          //###### Tue Nov 14 07:24:59 PST 2017 Support for ACCESSNSITE
                          //export file format:    CardNum, Name, Validity, Expires, Site, BadgeFormat, AccessLevels 
                          //ACCESSNSITE comes with accessLevels and so need to account for that in the logic here.
                          case "ACCESSNSITE":
                              strSQL =  strPrepend+"'"+csvFileName+"'"+" INTO TABLE accesslevels FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@var1) SET BadgeID = @var1, EmpID = @var1, AccsLvlID = '1', AccsLvlName = 'Main', updateTime ="+_updateTime;
                          break;

                          //###### Mon Feb 05 2018 17:10:56 PST 2017 Support for DEFAULT_B
                          // person_ID, LastName, FirstName, EmployeeId, cardNumber

                          case "DEFAULT_B":
                            strSQL =  strPrepend+"'"+csvFileName+"'"+" INTO TABLE accesslevels FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@dummy, @dummy, @dummy, EmpID, BadgeID) SET AccsLvlID ='1', AccsLvlName = 'Main', updateTime ="+_updateTime;
                            break;

                          default: 
                          /**
                         * \r\n doesnt work for certain files, possibly files opened, saved or created in notepad.
                         * Change to \n, which seems to wor for all file types tested
                         * This change was percolated 6/20/17 into the other two tables below and Beckenbauer
                         * REVERSED this 7/9/17 -- \n alone wasnt working properly.  There seems to be some inconsistency here.
                         * Needs to be MONITORED.  Possible that git changes line endings on .csv files?  it certianly sends warnings that
                         * it is checning line endings.  Notes on this can be found in Evernote.
                         */
                            //Process for export source OTHER (default mobss)

                            strSQL =  strPrepend+"'"+csvFileName+"'"+" INTO TABLE accesslevels FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (EmpID, @dummy, @dummy, @dummy, BadgeID) SET AccsLvlID = '1', AccsLvlName = 'Main', updateTime ="+_updateTime;
                            
                        }
                          
                          query = connection.query(strSQL, function(err, result) {


                             if (err) {
                                console.log(err)
                                if (caller == 'manual'){sess.error = 'There was a problem importing the csv file to the accesslevels table';}
                                callback(err, 'failed');
                                connection.end();
                                
                              } else {  
                                if (caller == 'manual'){sess.success ='Update was successful.';}
                                callback(null, 'success');
                                connection.end();

                              }
                          });
                        }
                      });
                
                    };
                  }); // END of the infile processing
                }
              });

            }
          });

         }
        }); // END of clear table processing
          
       
      } //END of db connect if/else
    });
  
};



////////////////////////////////////////////////////////
//  Load the csv invitee file into the invitees table //
////////////////////////////////////////////////////////
//###### Tue Oct 3 06:30:43 PDT 2017 Added lineEnding parm
exports.importInvite = function(csvFileName, listName, listComment, lineEnding, callback) {
  sess.success = null;
  sess.error = null;
  var strSQL = "";
  var query = null;
  
  
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

  switch (dbLoc)
  {
     case "OFF":
        strPrepend = 'LOAD DATA INFILE '
        break;

    default: 
      strPrepend = 'LOAD DATA LOCAL INFILE '
  }

  //###### Tue Oct 3 06:24:53 PDT 2017  Set the line terminator for the INFILE statement based on the lineEnding parameter
  var termBy = '\r\n'
  if (lineEnding=="CRLF") {
    termBy = '\r\n'
    } else if (lineEnding=="LF"){
      termBy = '\n'
      } else if (lineEnding=="CR"){
        termBy = '\r'
          }else{
          console.log("The file does not have supported line endings.  Detected line ending is: " +lineEnding)
          }

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

          switch (process.env.EXPORT_SOURCE)
           {
             case 'OTHER':
              csvImportInsert.insertInvite(connection, csvFileName, listName, listComment, function(err, res2){ 
                    if (err) {
                      console.log('Error while performing Invite insert proessing: ' + err);
                      sess.error = 'There was a problem importing csv file to the people table';
                      callback(err, 'failed');
                      connection.end();
                    } else {        
                      sess.success ='Update was successful.';
                      callback(null, 'success');
                    }
              });
                 break;
            
              //###### Wed Dec 13 09:02:38 PST 2017 Adjusted for alternate S2 format
              case "S2-1":
              case "S2-2":    
              csvImportInsertS2.insertInvite(connection, csvFileName, listName, listComment, function(err, res2){ 
                    if (err) {
                      console.log('Error while performing S2 INSERT proessing: ' + err);
                      sess.error = 'There was a problem importing csv file to the INVITEES table';
                      callback(err, 'failed');
                      connection.end();
                    } else {        
                      sess.success ='Update was successful.';
                      callback(null, 'success');
                    }
              });   
                 break;

              default: 
                sess.error = 'Cannot create invitation lists with INFILE disabled and source data = '+process.env.EXPORT_SOURCE; 
                callback(err, 'failed'); 
                connection.end(); 
            }


          }else{
          //Some export sources require INSERT processing, despite INFILE being available 
          //###### Wed Dec 13 09:03:35 PST 2017 Adjusted for alternate S2 format
          if (process.env.EXPORT_SOURCE=="S2-1" || process.env.EXPORT_SOURCE=="S2-2" ){
            csvImportInsertS2.insertInvite(connection, csvFileName, listName, listComment, function(err, res2){ 
                    if (err) {
                      console.log('Error while performing INFILE proessing: ' + err);
                      sess.error = 'There was a problem importing csv file to the INVITEES table';
                      callback(err, 'failed');
                      connection.end();
                    } else {        
                      sess.success ='Update was successful.';
                      callback(null, 'success');
                    }
              });
          }else{

          //Use INFILE to import the lists  
          inviteList.createInviteList(connection, listName, listComment, function(err,rslt){
            if (err) {
              console.log('Error while creating the invite list table: ' + err);
              sess.error = 'There was a problem creating the InviteList the table';
              connection.end();
              callback(err, null);
            }else{

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
                         * ###### Tue Oct 3 07:29:51 PDT 2017  parameterized the line endings
                         */
                        if (process.env.EXPORT_SOURCE == "ACM"){
                            strSQL = strPrepend+ "'"+csvFileName+"'"+" INTO TABLE Invitees FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy,  FirstName, LastName, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, EmailAddress, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy,BadgeNumber) SET InvitationListID = LAST_INSERT_ID(), UpdateTime ="+_updateTime;

                        }else{
                         // if (process.env.EXPORT_SOURCE == "DEFAULT_B"){
                           // strSQL = strPrepend+ "'"+csvFileName+"'"+" INTO TABLE Invitees FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@dummy, LastName, FirstName, @dummy, BadgeNumber) SET InvitationListID = LAST_INSERT_ID(), UpdateTime ="+_updateTime;
                          //}else{
                            strSQL = strPrepend+ "'"+csvFileName+"'"+" INTO TABLE Invitees FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@dummy, LastName, FirstName, @dummy, BadgeNumber) SET InvitationListID = LAST_INSERT_ID(), UpdateTime ="+_updateTime;
                        
                        // ###### Tue Oct 3 07:29:51 PDT 2017  parameterized the line endings
                          //}
                        }    
                        
                        query = connection.query(strSQL, function(err, result) {

                      
                         if (err) {
                            console.log(err)
                            sess.error = 'There was a problem importing csv file to the invitees table';
                            callback(err, 'failed');
                            connection.end();
                            
                          } else {
                            sess.success ='Update was successful.';
                            console.log('sess.success= '+sess.success);
                            callback(null, 'success');
                            connection.end();
                          }

                        });
                  }
            });
          }//else on the S2 if

         } 

        }
    });
};


//###### Wed Nov 1 14:31:50 PDT 2017  New module to support the import of tickets
////////////////////////////////////////////////////////
//  Load the csv EventTickets table
////////////////////////////////////////////////////////
exports.importTickets = function(csvFileName, fileExtension, lineEnding, callback) {
  sess.success = null;
  sess.error = null;
  var strSQL = "";
  var query = null;
  
  console.log ("here is the csvfilename passed to importTickets "+ csvFileName)
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

  switch (dbLoc)
  {
     case "OFF":
        strPrepend = 'LOAD DATA INFILE '
        break;

    default: 
      strPrepend = 'LOAD DATA LOCAL INFILE '
  }

  /**
   * Convert the filename to forward slash formats. 
   * chrome and firefox Browsers  will only return the filename and not the path.   this is a 
   * security policy by the major browsers.   IE returns path/filename. 
   * 
   */
  console.log('filename BEFORE replace'+csvFileName);
  csvFileName = csvFileName.replace(/\\/g, "/");
  console.log('filename AFTER replace'+csvFileName);
  
  //Set the line terminator for the INFILE statement based on the lineEnding parameter
  var termBy = '\r\n'
  if (lineEnding=="CRLF") {
    termBy = '\r\n'
    } else if (lineEnding=="LF"){
      termBy = '\n'
      } else if (lineEnding=="CR"){
        termBy = '\r'
          }else{
          console.log("The file does not have supported line endings.  Detected line ending is: " +lineEnding)
          }

  db.createConnection(function(err,reslt)
  {  
      if (err) {
        console.log('Error while performing common connect query: ' + err);
        callback(err, null);
      }else{
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;        
        
        /**
         *
         * Default to use MySQL INFILE function
         * to directly load EventTickets table. 
         * this is considered up to 20 times faster than INSERT
         */
       
       
        strSQL = strPrepend+ "'"+csvFileName+"'"+" INTO TABLE EventTickets FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (EventID, LastName, FirstName, EmpID, NumberofTickets, TicketType, iClassNumber)";
                                
        query = connection.query(strSQL, function(err, result) {

      
          if (err) {
            console.log(err)
            sess.error = 'There was a problem importing csv file to the eventTickets table';
            callback(err, 'failed');
            connection.end();
            
          } else {
            sess.success ='Update was successful.';
            console.log('sess.success= '+sess.success);
            callback(null, 'success');
            connection.end();
          }

        });
       
      }
    }); 
       
};