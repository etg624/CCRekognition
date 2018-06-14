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
var eventEndProcess = require('./eventEndProcess');



//////////////////////////////////////////////////////////////////////////////
//  Processes Events that have ended
//////////////////////////////////////////////////////////////////////////////
module.exports.eventEndMonitor = function(callback){
		            
	var eventAdminsEmailAddr =  process.env.EVENTADMIN_EMAIL;
    var strSQL = "";
	var sweepTime = new Date()
	var i=0;
	var counter = 0;
	var errorFlag = "N";
	



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
	db.createConnection(function(err,reslt){ 
			
		if (err) {
			createLogEntry(sweepTime+" -- FAIL : "+err);
			callback(err, null);

		}else{	
			var connection = reslt;
			events.getAllEventsEndedSinceLastSweep(connection, function (err, allEventsSinceLastSweep) {
				
				if (err) {

					console.log(err);
					callback(err, null)

				} else {

					console.log(allEventsSinceLastSweep);

					if (allEventsSinceLastSweep.length > 0){

						eventEndProcess.eventEndProcess(connection, allEventsSinceLastSweep, function (err, res, eventsForWhichReportsWereSent){
							//console.log (" BACK  11111 !!!!"+eventsForWhichReportsWereSent.length)
							
							if (err){

							} else{

								//console.log (" BACK  22222 !!!!"+eventsForWhichReportsWereSent.length)
								

								if (eventsForWhichReportsWereSent.length > 0){

									//console.log (" BACK!!!!")
									events.markEventAsEndedAndProcessed(eventsForWhichReportsWereSent, function (err, resultMessage) {
										
										if (err){
				
										} else{
											var eventsForWhichEmailsNotSentCount = allEventsSinceLastSweep.length - eventsForWhichReportsWereSent.length
											createLogEntry(sweepTime+" -- "+resultMessage+", "+eventsForWhichEmailsNotSentCount+" had no attendance records.");																												

										}
									})
								}else{
									console.log ("HEEEEEES HERE!!!!")
									
									var eventsForWhichEmailsNotSentCount = allEventsSinceLastSweep.length - eventsForWhichReportsWereSent.length
									createLogEntry(sweepTime+" -- 0 EVENTS updated as ended, "+eventsForWhichEmailsNotSentCount+" had no attendance and were not updated.");

								}	
								

							}
						})

					} else{
						createLogEntry(sweepTime+" -- 0 EVENTS were found for this sweep.");

					}

				}
			});
		}
	}); 
}
