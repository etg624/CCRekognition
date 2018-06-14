//###### Sun Jun 10 08:28:19 PDT 2018 New Modul
/** Auto-sweep checks for events that have ended so that the attendance report can
 * be automatically run and the administrator emailed.
 */

var fs = require('fs');
var path = require ('path')
var db = require('../models/db');
var mysql = require('mysql');
var fs  = require('fs');
var clearTables = require('../models/clearTables');
var emailController = require('./emailController');
var sweepInsert = require('./sweepInsert');
var sweepPhotos = require('./sweepPhotos');
var csvImport = require('./csvImport');
var csvImportInsert = require('./csvImportInsert');
var fileImportAMAG = require('./fileImportAMAG');
var sweepRelay = require('./sweepRelay');


var sharp = require('sharp');
var crlf = require('crlf-helper');



//////////////////////////////////////////////////////////////////////////////
//  Check for event end
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


	/**
   ================================================================================================
                                          Revealing Modules
   ================================================================================================ 
   */
   function createLogEntry ( param ) {  
	   fs.open('./public/reports/eventEndMonitor.log', 'a', 666, function( e, id ) {
	    //in some cases appends to the end of the last line rather than on a new line,
	    //so write a blank line first
	    //fs.appendFileSync(id, "" + "\r\n", null, 'utf8')
	    fs.appendFileSync(id, param + "\r\n", null, 'utf8')
	    fs.close(id, function(){});
	    });
	};
 
    
    //Don't do anything if INFILE is disabled and the source is not S2 
	switch (exportSource)
	{
	   case "S2-1":
	   case "S2-2":
		  insertFork = 'YES'
		  break;

	  default: 
		if (process.env.INFILE_DISABLED == "YES"){
			if (process.env.EXPORT_SOURCE != "S2-1" && process.env.EXPORT_SOURCE != "S2-2" ){
				abortSweep = "YES"}else{insertFork="YES"}	
		}else{
			insertFork = 'NO'
		}
	}

	//Process the sweep of we are not aborting        	
	if (abortSweep != "YES"){
		
		if (exportSource == "RELAY"){
			//This is no export file with an export type of RELAY.  We are simply importing
			//data from another command center instance using commandCenter's API
			sweepRelay.relayJunction(function(err, res2){ 
				if (err) {
					processLog(sweepTime+" -- FAIL : "+err)
					callback(err, null);                   
				} else {
					processLog(sweepTime+" -- OK.")
					callback(null, "success")
				}
			});
		
		}else{

		//For other export types, look for the export file and Don't do anything if the file is not in 
		//the designated directory 
			fs.readFile(csvFileName, {
				encoding: 'utf-8'
				}, function(err, csvData) {
					if (err) {
						processLog(sweepTime+" -- FAIL : "+err)
						callback("cronjob did not run - no file found in directory", null)
					} else {

						// Detect line endings and adjust infile syntax accordingly
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
			
						//Process the sweep for the various sources.  Reuses the same controllers as the manually triggered Import.
						//###### Thu Jan 01 09:50:36 PST 2018 Added the relay source type

						switch (exportSource)
						{
							case "S2-1":
							case "S2-2":
			
								sweepInsert.sweepInsert(csvFileName, function(err,rslt){
									if (err) {
										console.log('Error while performing sweepInsert call : ' + err);
										processLog(sweepTime+" -- FAIL : "+err)
										callback(err, null);
									}else{
										processLog(sweepTime+" -- OK.")
										callback(null, "success")

									}
								});
							
								break;
						
							case "AMAG":
							
								fileImportAMAG.inFile(csvFileName, "sweep", lineEnding, function(err, res2){ 
									if (err) {
										processLog(sweepTime+" -- FAIL : "+err)
										callback(err, null);                   
									} else {
										processLog(sweepTime+" -- OK.")
										callback(null, "success")
									}
								});
								
								break;

											
						
							default: 

								csvImport.inFile(csvFileName, "sweep", fileExtension, lineEnding, function(err, res2){ 
									if (err) {
										processLog(sweepTime+" -- FAIL : "+err)
										callback(err, null);      
									}else{
										processLog(sweepTime+" -- OK.")
										callback(null, "success")
									}
								});
						}
				

		//******************** */



					} // if/else err fs
 			}); // end fs callback
		}
	}else{processLog(sweepTime+" -- FAIL : INFILE and source conflict"); callback("cronjob did not run - INFILE and source conflict", null)} // end check for abort sweep
     	

/////////////////////////////////////////////////////
//Also process the photos, using the common handler 
/////////////////////////////////////////////////////
//###### Tue Oct 3 07:21:42 PDT 2017  only sweep photos if the env flag is set to YES (full scope sweep)
if (sweepDataAndPhotos == 'YES') {
	sweepPhotos.photoSweep (function( err, result ) {
			if( err ) {
				processLog(sweepTime+" -- PHOTO FAIL : "+err)
				console.error( "Could not sweep the photos.", err );
				callback(err, 'failed');
			}
	});
}


        
}; //End module




