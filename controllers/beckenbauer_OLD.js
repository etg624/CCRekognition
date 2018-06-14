/** Auto-sweep module auto-imports text files using environmental variable for the application
 to locate the file and process according to file format.  Currently supports csv and a 
 quote enclosed .txt file format (AMAG).
 Certain export sources (eg S2) are too complex for INFILE and so must use insert processing.  
 Similarly, if the database on the instance has INFILE disabled (i.e.  .env variable INFILE_DISABLED=YES),
 this will fork to inserts as well.
 */


var fs = require('fs');
var path = require ('path')
var db = require('../models/db');
var mysql = require('mysql');
var fs  = require('fs');
var clearTables = require('../models/clearTables');
var emailController = require('./emailController');
var beckInsert = require('./beckInsert');
var beckPhotos = require('./beckPhotos');

var sharp = require('sharp');
//###### Tue Oct 3 07:00:00 PDT 2017
var crlf = require('crlf-helper');



//////////////////////////////////////////////////////////////////////////////
//  Auto ingest the csv files
//////////////////////////////////////////////////////////////////////////////
module.exports.sweeper = function(sweepDataAndPhotos, callback){
	
    /**
     * Get the batch file directory from the environmental variables
     */
		            
	var dbLoc =  process.env.LOCAL_INFILE;
    var sweepFile =  process.env.SWEEP_FILE;
    var fileExtension = path.extname(process.env.SWEEP_FILE);
    var exportSource = process.env.EXPORT_SOURCE;
	var csvFileName = sweepFile;
    var strPrepend = "";
    var expFork = "";
    var strSQL = "";
    var abortSweep = "NO"
    var sweepTime = new Date()

   //Set up the logging
   function processLog ( param ) {  
	   fs.open('./public/reports/sweep.log', 'a', 666, function( e, id ) {
	    //in some cases appends to the end of the last line rather than on a new line,
	    //so write a blank line first
	    //fs.appendFileSync(id, "" + "\r\n", null, 'utf8')
	    fs.appendFileSync(id, param + "\r\n", null, 'utf8')
	    fs.close(id, function(){});
	    
	    });
	    
	    };
 
    
    /**
     * Don't do anything if INFILE is disabled and the source is not S2 or OTHER
     */
    //###### Tue Dec 3 06:33:50 PDT 2017 -- support fro alternate S2 format
    //Also pretty sure this original logic (commented out below) is faulty.
    //Should be != S2 AND OTHER.  Corrected block below with alt-S2 format support.


	//if (process.env.INFILE_DISABLED == "YES"){
	//	if (process.env.EXPORT_SOURCE != "S2" ){abortSweep = "YES"};
	//	if (process.env.EXPORT_SOURCE != "OTHER"){abortSweep = "YES"};
	//}

	if (process.env.INFILE_DISABLED == "YES"){
		if (process.env.EXPORT_SOURCE != "S2-1" && process.env.EXPORT_SOURCE != "S2-2" && process.env.EXPORT_SOURCE != "OTHER" ){
			abortSweep = "YES"};
	}
	        	
	if (abortSweep != "YES"){
	/**
	 * Dont do anything if the file is not in the directory
	 */
	 fs.readFile(csvFileName, {
      	encoding: 'utf-8'
    	}, function(err, csvData) {
          if (err) {
          	processLog(sweepTime+" -- FAIL : "+err)
          	callback("cronjob did not run - no file found in directory", null)
          } else {

			//###### Tue Oct 3 06:33:50 PDT 2017
            //PB 2017.09.28 detect line endings and adjust infile syntax accordingly
            // Need to change this read to just get the first line of the file if possible
            var text = fs.readFileSync(csvFileName,'utf8')
            var lineEnding = crlf.getLineEnding(text);
            console.log("This is the CR?LF? for this file -- "+lineEnding);
			// CRLF line ending detection
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
			//###### Tue Oct 3 07:05:54 PDT 2017  END LINEENDING FUNCTIONALITY


			/**
			 * Use the common db module to get a connection
			 */
			db.createConnection(function(err,reslt){  
		        if (err) {
		          	console.log('No database connection, the batch csv job did not run... ' + err);
		          	processLog(sweepTime+" -- FAIL : "+err)
		          	callback(err, null);
		        }else{
		        	/**
		        	 * Process i/o after successfull connect
		        	 */
			        
		        	var connection =reslt;
				    /**
				     * Use regular INFILE or LOAD LOCAL depending on where db is located
				     * Not all datasources case use INFILE
				     */
				    switch (dbLoc)
				    {
				       case "OFF":
				        strPrepend = 'LOAD DATA INFILE '
				        break;

				      default: 
				        strPrepend = 'LOAD DATA LOCAL INFILE '
				    }
				    /**
				     * Fork into INSERT processing if the export source requires, or Infile is
				     * diabled on the instance
				     */
				     //###### Tue Dec 3 07:05:54 PDT 2017  Support Alt-S2 formats
				    switch (exportSource)
				    {
				       case "S2-1":
				       case "S2-2":
				          insertFork = 'YES'
				          break;

				      default: 
				        if (process.env.INFILE_DISABLED == "YES"){
				        	insertFork="YES"
				        }else{
				        	insertFork = 'NO'
				        }
				    }

				     //First clear existing records from the 3 tables
			        clearTables.clearAllFromTable(connection, 'people', function(err,rslt){
			          if (err) {
			            console.log('Error while performing people table clear: ' + err);
			            connection.end();
			            processLog(sweepTime+" -- FAIL : "+err)
			            callback(err, null);
			          }else{
			          clearTables.clearAllFromTable(connection, 'accesslevels', function(err,rslt){
			            if (err) {
			              console.log('Error while performing accesslevels table clear: ' + err);
			              connection.end()
			              processLog(sweepTime+" -- FAIL : "+err)
			              callback(err, null);
			            }else{
			              clearTables.clearAllFromTable(connection, 'empbadge', function(err,rslt){
			                if (err) {
			                  console.log('Error while performing empbadge table clear: ' + err);
			                  connection.end();
			            	  processLog(sweepTime+" -- FAIL : "+err)
			                  callback(err, null);
			                }else{  

							  //Use MySQL INFILE function
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
			                  
			          
			           // carry out the insert fork      
			           if (insertFork == "YES"){
			           	beckInsert.sweepInsert(csvFileName, function(err,rslt){
					      if (err) {
					        console.log('Error while performing beckInsert call : ' + err);
					        connection.end();
				         	processLog(sweepTime+" -- FAIL : "+err)
					        callback(err, null);
					      }else{
					      	processLog(sweepTime+" -- OK.")
					      	connection.end()
					      	callback(null, "success")

					      }
					    });
					   }else{


			            /** 
                         * INFILE processing.  Condition INFILE statement based on incoming file format.
                         * Currently with AMAG(comma delim, encosed quote) or 
                         * CSV (commman delim)
                         * Quote in enclosure must be escaped
                         */
						//###### Tue Oct 3 07:03:24 PDT 2017 paramterize based on line endings
                          switch (exportSource)
						    {
						       	case "AMAG":
						        //strSQL = strPrepend+"'"+csvFileName+"'"+" INTO TABLE people FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (LastName, FirstName, iClassNumber, @dummy, @dummy,EmpID,@dummy, @dummy, imageName ) SET  updateTime ="+_updateTime;
								//###### Thu Dec 19 17:10:56 Use REPLACE rather than IGNORE to counter the duplicate records produced in error
                          		//by AMAG.  the last occurring record in the export file will be the last record for update.	  
								strSQL = strPrepend+"'"+csvFileName+"'"+" REPLACE INTO TABLE people FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' (LastName, FirstName, @var1, @dummy, @dummy, @var2, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy,@dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy, imageName ) SET iClassNumber = CONCAT(@var2, @var1), EmpID = CONCAT(@var2, @var1), updateTime ="+_updateTime;
						          break;
						       	case "ACM":
						        	strSQL = strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE people FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@var1, @var2, @dummy, @dummy, @dummy, @dummy, @dummy, FirstName, LastName, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, EmailAddr, Title, @dummy, Division, SiteLocation, Building, @dummy, @dummy, iClassNumber ) SET imageName=@var1, EmpID= @var2, Identifier1=@var2, updateTime ="+_updateTime;
						         break;
							  	//###### Mon Nov 13 17:10:56 PST 2017 Support for AccessNSite
							  	case "ACCESSNSITE":
							  		strSQL = strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE people FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (iClassNumber, LastName ) SET updateTime ="+_updateTime;
												
							   	break;
								
								default: 
						        	strSQL = strPrepend+"'"+csvFileName+"'"+" INTO TABLE people FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (empID, LastName, FirstName, title, iClassNumber, imageName) SET  updateTime ="+_updateTime;

						    }


		                  console.log('People INLINE Query '+strSQL);
		                  query = connection.query(strSQL, function(err, result) {

			                
			                   if (err) {
			                      console.log(err)
			                      processLog(sweepTime+" -- FAIL : "+err)
			                      connection.end();
			                      callback(err, 'failed');
			                      
			                    } else {
			                    ////////////////////////////////////////////////////////////////
			                    // Remove the .jpg extension from the imageName, if it exists //
			                    ////////////////////////////////////////////////////////////////
                     			/**
		                       * Need to do this for .jpg and .JPG and .jpeg and .JPEG
		                       */
		                      
		                        var sqlJPG = "update people set imageName = replace(replace(replace(replace(imageName,'.jpg',''),'.JPG',''), '.jpeg', ''), '.JPEG', '')"

                     			//var sqlJPG = "UPDATE people SET imageName = REPLACE(imageName, '.JPG', '')"
			                    query = connection.query(sqlJPG, function(err, result) {

			                   		if (err) { console.log('couldnt remove the .jpg extensions '+err);}
			                   		else{
			                   			var sqlJpg = "UPDATE people SET imageName = REPLACE(imageName, '.jpg', '')"
			                   			query = connection.query(sqlJpg, function(err, result) {

				                   		if (err) { console.log('couldnt remove the .jpg extensions '+err);}
				                   		
				                   		});

			                   		}
			                   	});
			                  
								//###### Mon Nov 13 18:31:17 PST 2017
								//AccessNSite names come through in export concatenated like "Allen, Chris"
								//So parse and split and arrange string into FirstName and LastName for our table
								if (exportSource == "ACCESSNSITE"){
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

			                     //////////////////////////////////////////////
			                     // create EMPBADGE records for each import  //
			                     //////////////////////////////////////////////
					             /**
		                         * Condition INFILE statement based on incoming file format.
		                         * Currently eith AMAG(comma delim, enclosed quote) OR 
		                         * CSV (commman delim)
		                         * Quote in enclosure must be escaped
		                         */
		                         switch (exportSource)
								    {
								       	case "AMAG":
											//###### Thu Dec 19 17:10:56 Use REPLACE rather than IGNORE to counter the duplicate records produced in error
											  //by AMAG.  the last occurring record in the export file will be the last record for update.
											  //this also requires adding iClassNumber UNI key to the empbadge table.  Added INGORE to the deafult export type.			
										   strSQL =  strPrepend+"'"+csvFileName+"'"+" REPLACE INTO TABLE empbadge FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' (@dummy, @dummy, @var1, @dummy, @dummy, @var2, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy, @dummy,@dummy, @dummy, UpdateTime) SET iClassNumber = CONCAT(@var2, @var1), EmpID = CONCAT(@var2, @var1), StatusID ='1', StatusName = 'Active'";
								          break;
								      	 case "ACM":
                          			  		strSQL =  strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE empbadge FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@dummy, @var2, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @var1, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy,@dummy, @dummy, @dummy,@dummy, @dummy, iClassNumber) SET EmpID = @var2, StatusID ='1', StatusName = 'Active', updateTime ="+_updateTime;
										  break;
									   //###### Mon Nov 13 20:36:26 PST 2017 Support for AccessNSite
										//export file format:    CardNum, Name, Validity, Expires, Site, BadgeFormat, AccessLevels 
										case "ACCESSNSITE":
											strSQL =  strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE empbadge FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (iClassNumber, @var1, StatusName, @var2) SET EmpID = @var1, StatusID ='1', updateTime = @var2";   
											break;
										
										  default: 
				                      	strSQL =  strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE empbadge FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (EmpID, @dummy, @dummy, @dummy, iClassNumber) SET StatusID ='1', StatusName = 'Active', updateTime ="+_updateTime;

								    }


			                      query = connection.query(strSQL, function(err, result) {


			                       if (err) {
			                          console.log(err)

			                          connection.end();
			                          processLog(sweepTime+" -- FAIL : "+err)
			                          callback(err, 'failed');
			                          
			                        } else {  
			                          /**
			                           * Set the empbadge records to INACTIVE for those records with EXPIRY DATE and time less than now
			                           * Only do this for .txt files -- AMAG format.  Need to generalize this case later.
			                           */
									//###### Tue Nov 14 07:18:50 PST 2017 Do this for ACCESSNSITE records too
									  if (exportSource=="AMAG" || exportSource=="ACCESSNSITE"){			                          
			                            var activeSQL = "select * from empbadge where STR_TO_DATE(updateTime,'%m/%d/%Y')<CURDATE()"
 										query1 = connection.query(activeSQL, function(err, result2) {if (err) {console.log('empbadge INACTIVE didnt work --')}
 										
 												console.log('the str to date query '+JSON.stringify(result2))
 												for (var i=0 ; i <result2.length; i++){
 													var inactiveSQL = 'update empbadge set StatusID=2, StatusName="Inactive" where iClassNumber='+result2[i].iClassNumber 
 													console.log('inactive query '+inactiveSQL)
 													query2 = connection.query(inactiveSQL, function(err, result) {if (err) {console.log('empbadge INACTIVE didnt work --')}

 													});

 												};
 										});
 									   } // End of the special processing for AMAG around expiry date
			                          
 									   /////////////////////////////////////////////////
					                   // create ACCESSLEVELS records for each import //
					                   /////////////////////////////////////////////////	

			                          /**
				                         * Condition INFILE statement based on incoming file format.
				                         * Currently eith AMAG(comma delim, encosed quote) or 
				                         * CSV (commman delim)
				                         * Quote in enclosure must be escaped
				                         */
				                          switch (exportSource)
										    {
										       case "AMAG":
											//###### Thu Dec 19 17:10:56 Use REPLACE rather than IGNORE to counter the duplicate records produced in error
											  //by AMAG.  the last occurring record in the export file will be the last record for update.	
											  //Also requires adding BadgeID UNI key to the accesslevels table.
											  //Requires adding ignore for the other export types 	  
											   strSQL =  strPrepend+"'"+csvFileName+"'"+" REPLACE INTO TABLE accesslevels FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' (@dummy, @dummy, @var1, @dummy, @dummy, @var2) SET BadgeID = CONCAT(@var2, @var1), EmpID = CONCAT(@var2, @var1), AccsLvlID = '1', AccsLvlName = 'Main', updateTime ="+_updateTime;
										          break;
										       case "ACM":
                          						strSQL =  strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE accesslevels FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@dummy, @var2, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @var1, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, @dummy, BadgeID) SET EmpID = @var2, AccsLvlID = '1', AccsLvlName = 'Main', updateTime ="+_updateTime;
 												  break;
											 	//###### Tue Nov 14 07:24:59 PST 2017 Support for ACCESSNSITE
												//export file format:    CardNum, Name, Validity, Expires, Site, BadgeFormat, AccessLevels 
												//ACCESSNSITE comes with accessLevels and so need to account for that in the logic here.
												case "ACCESSNSITE":
													strSQL =  strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE accesslevels FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (@var1) SET BadgeID = @var1, EmpID = @var1, AccsLvlID = '1', AccsLvlName = 'Main', updateTime ="+_updateTime;
														break;
												
												
												default: 
			                          	  		strSQL =  strPrepend+"'"+csvFileName+"'"+" IGNORE INTO TABLE accesslevels FIELDS TERMINATED BY ',' ENCLOSED BY '' LINES TERMINATED BY '"+termBy+"' IGNORE 1 LINES (EmpID, @dummy, @dummy, @dummy, BadgeID) SET AccsLvlID = '1', AccsLvlName = 'Main', updateTime ="+_updateTime;

										    }


			                          	query = connection.query(strSQL, function(err, result) {


			                             if (err) {
			                                console.log(err)
			                                
			                                processLog(sweepTime+" -- FAIL : "+err)
			                                callback(err, 'failed');
			                                connection.end();
			                                
			                              } else { 

			                              	processLog(sweepTime+" -- OK.")
			                                callback(null, 'success');
			                                connection.end();

			                              }
			                          });
			                        } // end of if/else on empbadge infile i/o
			                      }); // end of empbadge i/o
			                
			                    }; // end of if/else on people infile i/o
			                  }); // END of the infile processing   GOOG HERE
		           
                   } //if/else on insert fork

               }  //cleartables start 
              });
           }
          });
		 }
		});  //cleartables end

         } // if/else create connection
        }); // end create connection callback
     } // if/else err fs
 }); // end fs callback

}else{processLog(sweepTime+" -- FAIL : "+err); callback("cronjob did not run - INFILE and source conflict", null)} // end check for abort sweep
     	

/////////////////////////////////////////////////////
//Now process the photos, using the common handler //
/////////////////////////////////////////////////////
//###### Tue Oct 3 07:21:42 PDT 2017  only sweep photos if the env flag is set to YES (full scope sweep)
if (sweepDataAndPhotos == 'YES') {
	beckPhotos.photoSweep (function( err, result ) {
			if( err ) {
				processLog(sweepTime+" -- PHOTO FAIL : "+err)
				console.error( "Could not sweep the photos.", err );
				callback(err, 'failed');
			}
	});
}


        
}; //End module




