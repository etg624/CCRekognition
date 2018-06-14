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
module.exports.eventEndMonitor = function(callback){
		            
	var eventAdminsEmailAddr =  process.env.EVENTADMIN_EMAIL;
    var strSQL = "";
	var sweepTime = new Date()
	var i=0;



	/**
   ================================================================================================
                                          Revealing Modules
   ================================================================================================ 
   */
   	function createLogEntry ( param ) {  
		fs.open('./public/reports/eventEndMonitor.log', 'a', 666, function( e, id ) {
		fs.appendFileSync(id, param + "\r\n", null, 'utf8')
		fs.close(id, function(){});
	});
	};
 
   /**
   ================================================================================================ 
   */ 
	db.createConnection(function(err,reslt){ 
			
		if (err) {
			createLogEntry(sweepTime+" -- FAIL : "+err);
			callback(err, null);

		}else{	
			var connection = reslt;
			events.getAllEventsEndedSinceLastSweep(connection, function (err, allEventsSinceLastSweep) {
				
				if (err) {

					console.log(err);
					createLogEntry(sweepTime+" -- FAIL : "+err);
					callback (err, null)

				} else {

					console.log(allEventsSinceLastSweep);


					if (allEventsSinceLastSweep.length > 0) {

						

								for (var i=0 ; i < allEventsSinceLastSweep.length; i++){ 

									writeReport.writeActivityReport ('Attendance', connection, allEventsSinceLastSweep[i].EventID, allEventsSinceLastSweep[i].TempID, function(err, result, fileNameofReport){  
										console.log(fileNameofReport);

										if(fileNameofReport != null){
											
											var title=fileNameofReport;
											var appPath = path.normalize(__dirname+'/..');
											var rptPath = path.normalize(appPath+'/public/reports/');
											var rptFullName = rptPath+title+'.csv';
											var fullFileName = title+'.csv'  

											emailController.sendAttendanceEmail(fileNameofReport, 'Please find Attendance Report attached.', eventAdminsEmailAddr, fullFileName, function(err,reslt){
												if (err) {
													createLogEntry(sweepTime+" -- FAIL : "+err);
													callback (err, null)

												} else {
													createLogEntry(sweepTime+" -- OK.");
												}

											});					
										
										}
					
									})

								}
							
								connection.end()
						
					}
				}
			});
		}//
	}); //
}
