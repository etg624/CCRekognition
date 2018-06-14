//###### Wed Dec 27 11:22:21 PST 2017 new module for processing AMAG files/
//Zero padding for credentials and REPLACE dups

var mysql    = require('mysql');
var fs  = require('fs');
var clearTables = require('../models/clearTables');
var db = require('../models/db');
var crlf = require('crlf-helper');
var padZerosToAMAG =require('./padZerosToAMAG');
var path = require( 'path' );


//////////////////////////////////////////////////////
//  Handler for importing the cardholder file       //
//////////////////////////////////////////////////////
exports.inFile = function(csvFileName, caller, lineEnding, callback) {
  
  if (caller == 'manual'){sess.success = null; sess.error = null;}
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
              if (caller == 'manual'){ sess.error = 'There was a problem clearing the table';}
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
                  var onlyPath = path.dirname(csvFileName);
                  console.log('ONLY PATH '+onlyPath)
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
                  
                
                  //Call module to pad one of the credenital fields in the AMAG export
                  //This REWRITES the export file to the same directory as the esport file, with the file name
                  //pre-pended with a timestamp
                  padZerosToAMAG.padAndRewrite(csvFileName, function(err, res2){ 
                      if (err) {console.log('Error while performing AMAG rewrite: ' +err);}
                      //Use REPLACE rather than IGNORE to counter the duplicate records produced in error
                      //by AMAG.  the last occurring record in the export file will be the last record for update.
                      csvFileNameAmended = res2;
                      console.log ("ONE   csvFileNameAmended is "+csvFileNameAmended)

                       
                      //var appPath = path.normalize(onlyPath+'/');                      
                      //csvFileNameAmended = appPath+csvFileNameAmended
                      //csvFileNameAmended = appPath+csvFileNameAmended
                      
                      //console.log ("TWO   POST csvFileNameAmended is "+csvFileNameAmended)

                       /**
                       * Convert the filename to forward slash formats. 
                       * chrome and firefox Browsers  will only return the filename and not the path.   this is a 
                       * security policy by the major browsers.   IE returns path/filename. 
                       * 
                       */
                      console.log('filenameAmended BEFORE replace'+csvFileNameAmended);
                      csvFileNameAmended = csvFileNameAmended.replace(/\\/g, "/");
                      console.log('filenameAmended AFTER replace'+csvFileNameAmended);
                      
                      
                      var text = fs.readFileSync(csvFileNameAmended,'utf8')
    
                      var lineEnding = crlf.getLineEnding(text);
                      console.log("This is the CR?LF? for this file -- "+lineEnding);
                      if (lineEnding=="CRLF") {
                        termBy = '\r\n'
                        } else if (lineEnding=="LF"){
                          termBy = '\n'
                          } else if (lineEnding=="CR"){
                            termBy = '\r'
                              }else{
                              console.log("The file does not have supported line endings.  Detected line ending is: " +lineEnding)
                              }

                      //csvFileNameAmended = "C:/Users/bligh/Dropbox/CC550_10302017-master/AMAGPaddedCopy.txt"

                      //termBy = '\r\n'
                      console.log ('here is termBy'+termBy)
                      //strSQL = strPrepend+"'"+csvFileNameAmended+"'"+" REPLACE INTO TABLE people FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (LastName, FirstName, @var1, @dummy, @dummy, @var2, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy,@dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy, imageName ) SET iClassNumber = CONCAT(@var2, @var1), EmpID = CONCAT(@var2, @var1), updateTime ="+_updateTime;                 
                      strSQL = strPrepend+"'"+csvFileNameAmended+"'"+" REPLACE INTO TABLE people FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (LastName, FirstName, @var1, @dummy, @dummy, @var2, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy,@dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy, imageName ) SET iClassNumber = CONCAT(@var2, @var1), EmpID = CONCAT(@var2, @var1), updateTime ="+_updateTime;                 
                      
                      // going to have to put this into its own call back and do all the AMAG stuff here
                    
                      console.log ("QUERY FOR NEW INFILE "+strSQL)
                      query = connection.query(strSQL, function(err, result) {
                        console.log ("DONE WITH NEW INFILE")

                        //Now do the empbadge table


                        if (err) {
                          console.log(err)
                          if (caller == 'manual'){sess.error = 'There was a problem importing AMAG file to the people table';}
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
                             */
                           
                            strSQL =  strPrepend+"'"+csvFileNameAmended+"'"+" REPLACE INTO TABLE empbadge FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@dummy, @dummy, @var1, @dummy, @dummy, @var2, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy, UpdateTime) SET iClassNumber = CONCAT(@var2, @var1), EmpID = CONCAT(@var2, @var1), StatusID ='1', StatusName = 'Active'";
        
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
                                     * 
                                     * ###### Mon Oct 2 12:47:48 PDT 2017
                                     * Cr, LF, and CRLF, which are are all valid line endings based on the OS (Win v Unix) and the specific package used
                                     * to save the file.  hence, we now detect the line ending and adjust the INFILE TERMINATED BY syntax accordingly
                                     */
                                    
                                      strSQL =  strPrepend+"'"+csvFileNameAmended+"'"+" INTO TABLE accesslevels FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@dummy, @dummy, @var1, @dummy, @dummy, @var2) SET BadgeID = CONCAT(@var2, @var1), EmpID = CONCAT(@var2, @var1), AccsLvlID = '1', AccsLvlName = 'Main', updateTime ="+_updateTime;
          
                                      query = connection.query(strSQL, function(err, result) {
            
            
                                        if (err) {
                                            console.log(err)
                                            if (caller == 'manual'){sess.error = 'There was a problem importing the csv file to the accesslevels table';}
                                            callback(err, 'failed');
                                            connection.end();
                                            
                                          } else {  
                                            if (caller == 'manual'){sess.success ='Update was successful.'; console.log('sess.success= '+sess.success);}
                                            // ###### Mon Jan 24 12:47:48 PDT 2018
                                            fs.unlinkSync(csvFileNameAmended)
                                            callback(null, 'success');
                                            connection.end();
            
                                          }
                                      });
                            
                              }
                            }); // END EMPBADGE query
                  
                        }; // END People if/else
                      }) //END people query
             
                  }); // END padZerosToAMAG
  
                
                } // FIRST of the clear tables closures
              });

            }
          });

         }
        }); // END of clear table closures
          
       
      } //END of db connect if/else
  }); // END of db
  

}; //END of module



