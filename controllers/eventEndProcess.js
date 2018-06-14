//###### Sun Jun 10 08:28:19 PDT 2018 New Module

/** Auto-sweep checks for events that have ended so that the attendance report can
 * be automatically run and the administrator emailed.
 */

var path = require ('path')
var db = require('../models/db');
var mysql = require('mysql');
var fs  = require('fs');
var events = require('../models/events');
var writeReport = require('./writeReport');
var emailController = require('./emailController');


//////////////////////////////////////////////////////////////////////////////
//  Processes Events that have ended
//////////////////////////////////////////////////////////////////////////////
module.exports.eventEndProcess = function(connection, allEventsSinceLastSweep, callback){
		            
	var eventAdminsEmailAddr =  process.env.EVENTADMIN_EMAIL;
    var strSQL = "";
	var sweepTime = new Date()
	var i=0;

	// counters to keep track of each callback in the loop, so that we know when we are fully done 
	var reportToBeSentCounter = 0;
	var noReportToBeSentCounter = 0;
	var endProcessingCounter = 0;
	var reportsProcessedCounter = 0;
	//
	var eventsForWhichReportsWereSent = []
	

	/**
   ================================================================================================
                                          Common functions
   ================================================================================================ 
   */
   	function createLogEntry ( param ) {  
		fs.open('./public/reports/eventEndMonitor.log', 'a', 666, function( e, id ) {
		fs.appendFileSync(id, param + "\r\n", null, 'utf8')
		fs.close(id, function(){});
		return
	});
	};
 
   /**
   ================================================================================================ 
   */ 


	if (allEventsSinceLastSweep.length > 0) {

		

				for (var i=0 ; i < allEventsSinceLastSweep.length; i++){ 

					writeReport.writeActivityReport ('eventEndSweep','Attendance', connection, allEventsSinceLastSweep[i].EventID, allEventsSinceLastSweep[i].TempID, function(err, result, fileNameofReport, eventID){  

						reportsProcessedCounter++

						if (fileNameofReport != null){

							
							var title=fileNameofReport;
							var appPath = path.normalize(__dirname+'/..');
							var rptPath = path.normalize(appPath+'/public/reports/');
							var rptFullName = rptPath+title+'.csv';
							var fullFileName = title+'.csv'  


							emailController.sendAttendanceEmail(fileNameofReport, 'Please find Attendance Report attached.', eventAdminsEmailAddr, fullFileName, function(err,reslt){
								
								reportToBeSentCounter++	
								eventsForWhichReportsWereSent.push(eventID)
								
								
								if (err) {
									createLogEntry(sweepTime+" -- FAILED TO SEND REPORT: "+fileNameofReport+" -- "+err);
									
								} else {
									
									createLogEntry(sweepTime+" -- REPORT SENT: "+fileNameofReport);
									
									endProcessingCounter = reportToBeSentCounter + noReportToBeSentCounter
									//console.log("END counter= "+endProcessingCounter);
									
									
									if (endProcessingCounter == allEventsSinceLastSweep.length){
										//console.log("REACHED EMAIL END counter= "+endProcessingCounter);
										callback(null,null, eventsForWhichReportsWereSent)
									}
															
									
								}

							});	

							
							
						} else{
							noReportToBeSentCounter++;
							
						}
						
						// Done with the calls to write report, so release connection
						if (reportsProcessedCounter == allEventsSinceLastSweep.length){

							// And deal with the case where none of the events had attendance so no reports generated
							if (noReportToBeSentCounter == reportsProcessedCounter){
								//console.log("CONNECT END - NO REPORTS END "+noReportToBeSentCounter);
								connection.end()
								callback(null,null, eventsForWhichReportsWereSent) // this will be an empty array

							}else{
								// no need to callback here as this will happen when the email processing completes
								//console.log("REACHED connect end counter= "+reportsProcessedCounter);
								connection.end()

							}

						}

	
					})

				}						
	}
}
