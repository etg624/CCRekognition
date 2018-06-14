var datetime = require('fs');
var mysql      = require('mysql');
var db = require('./db');


//////////////////////////////////////////////////////////////////////////////
// Get muster records from the attendance data (where EventsType=mustering) //
//////////////////////////////////////////////////////////////////////////////
//###### Wed May 4 18:23:41 PDT 2018  Return the TempID with the callback
module.exports.getMusterRecords = function(id, callback){

    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null, null);
        }else{
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            //%%%%%%%%%%%%%%%%%%
            //###### Wed May 4 18:23:41 PDT 2018  As well as the regular attendance records, get the muster records sent to the server that were taken for a device-generated muster
            //before that muster was sent up to the server and received another, server generated, ID.  The original EventID of the device-gen
            //muster is stored in a field in the events table, TempID
            var _sqlQ0 = 'SELECT TempID FROM events WHERE EventID='+id;
            console.log(_sqlQ0);
            connection.query(_sqlQ0, function(err, result0) {
           
                if (err) {
                    console.log('error with the select mustering query');
                    connection.end();
                    callback(err, null, rows);

                }else{
                    //###### TODO Send the Temp Device ID to the Screen, then use it later to
                    var tempID = ""
                    var eventTempID =  "CommandCenter-created muster"
                    if (result0[0].TempID =="" || result0[0].TempID == null) {
                    var strSQL = 'SELECT * FROM attendance WHERE EventID='+id;
                    }else{
                    var strSQL = 'SELECT * FROM attendance WHERE EventID='+id+' or EventID="'+result0[0].TempID+'"'
                    eventTempID="Device-created muster #"+result0[0].TempID
                    tempID = result0[0].TempID
                    }

                    //var strSQL =  'SELECT * FROM attendance where EventID='+id;
                    connection.query(strSQL, function(err, rows, fields) {
                        if (!err) {
                            //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
                            connection.end();
                            callback(null, tempID, rows);

                        }else{
                            console.log('error with the select mustering query');
                            connection.end();
                            callback(err, tempID, rows);
                        }
                    });
                }
            
            }) // TempID io
    
        } // db if else

    }); // db io end
        
};


//////////////////////////////////////////////////////////////////////////////
// Get one muster record from the events table (where EventsType=mustering) //
//////////////////////////////////////////////////////////////////////////////
module.exports.getOneMusterRecord = function(id, callback){

    
    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var strSQL =  'SELECT * FROM events where EventID='+id;
          connection.query(strSQL, function(err, rows, fields) {
               if (!err) {
                
                  connection.end();
                  callback(null, rows);

                  }else{
                      console.log('error with the select mustering query');
                      connection.end();
                      callback(err, rows);
                    }
                });
        }
    });
        
};

//////////////////////////////////////////////////////////////////////////////
// Get muster records from the attendance data (where EventsType=mustering) //
//////////////////////////////////////////////////////////////////////////////
//###### Wed Apr 20 18:27:05 PDT 2018 1. Separate count of unknowns, 2. New attendance field DeviceAuthcode
//###### Wed Apr 20 18:27:05 PDT 2018 Error handle if the query fails
//###### Wed May 4 18:23:41 PDT 2018  Get counts for the TempIDs as well; tempID now sent in parms

module.exports.getMusterCounts = function(id, tempID, callback){
    
    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while performing common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          //In order to sort the muster records by the device that scanned them, select based on MobSSOperator, which now contains
          //the Device Auth Code (as per 324 app changes)
          //var strSQL = 'SELECT MobSSOperator,COUNT(*) as count FROM attendance WHERE EventID='+id+' GROUP BY MobSSOperator ORDER BY count DESC';
          
          //###### Wed May 4 18:23:41 PDT 2018  Get counts for the TempIDs as well; tempID now sent in parms
          if (tempID == ""){
            var strSQL = 'SELECT DeviceAuthCode,COUNT(*) as count FROM attendance WHERE EventID='+id+' GROUP BY DeviceAuthCode ORDER BY count DESC';
          }else{
            var strSQL = 'SELECT DeviceAuthCode,COUNT(*) as count FROM attendance WHERE EventID='+id+' or EventID="'+tempID+'" GROUP BY DeviceAuthCode ORDER BY count DESC';
          }
          connection.query(strSQL, function(err, rows, fields) {
               if (!err) {
                //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
                var devAuthCode = "" 
                var resultsArray = rows
                var strSQL1 = 'SELECT PointID, Lat, Lng, Description, DeviceAuthCode FROM musterPoint';
                connection.query(strSQL1, function(err, result3) {
                     if (!err) {
                      // Loop through the muster point array and match the count array
                      for (var i=0; i < rows.length; i++) {
            
                          //console.log('whats the array value  ' + JSON.stringify(resEvacs[i].iClassNumber)); 
                          //console.log('whats the muster array length  ' + JSON.stringify(resz1.length)); 
                          
                          for (var j=0; j < result3.length; j++) {
                            
                              if (result3[j].DeviceAuthCode==rows[i].DeviceAuthCode) {
                               // if (result3[j].DeviceAuthCode==rows[i].MobSSOperator) {
                                    
                                resultsArray[i].PointID = result3[j].PointID;
                                resultsArray[i].Description = result3[j].Description;
                                //###### Wed May 4 18:23:41 PDT 2018 If the lat lng of muster point is 0, use the default env lat lng
                                  
                                   //atn: logic here to use the muster(event) GPS fields rather than the environmental variables
                                   if ( result3[j].Lat !==0.000000 || result3[j].Lng !==0.000000){
                                       
                                       resultsArray[i].Lat = result3[j].Lat;
                                       resultsArray[i].Lng = result3[j].Lng;
                                   }else{
                                       //######
                                       // then use the default environment variable lat lng
                                       resultsArray[i].Lat = process.env.LAT
                                       resultsArray[i].Lng = process.env.LNG


                                   }
                                
                                }
                              
                          }
                      }

                        connection.end();
                        callback(null, resultsArray);
 
                      }else{
                       // resultsArray[k].MusterPoint = "Unassigned"
                       // resultsArray[k].Description = "N/A"
                      }
                  });

                     
                }else{
                      //###### Sat Apr 21 11:45:17 PDT 2018
                      console.log('Error while performing muster counts query: ' + err);
                      connection.end();                      
                      callback(err, null);
                      
                      
                     }
                  
                });
                    
              };
          });         
        
};



//////////////////////////////////////////////////////////////////////////////
// Get counts of unknown checkins from the muster                           //
//////////////////////////////////////////////////////////////////////////////
//###### Wed May 4 18:23:41 PDT 2018  Get counts for the TempIDs as well; tempID now sent in parms

module.exports.getUnknownCount = function(id, tempID, callback){
    
        //get a connection using the common handler in models/db.js
        db.createConnection(function(err,reslt){  
            if (err) {
              console.log('Error while performing common connect query: ' + err);
              callback(err, null, null);
            }else{
                //process the i/o after successful connect.  Connection object returned in callback
                var connection = reslt;
    
                //###### Wed May 4 18:23:41 PDT 2018  Get counts for the TempIDs as well; tempID now sent in parms
                //var strSQL1 =  'SELECT * FROM attendance where iClassNumber=999999999 AND EventID='+id;
                if (tempID == ""){
                    var strSQL1 =  'SELECT * FROM attendance where iClassNumber=999999999 AND EventID='+id;
                }else{
                    var strSQL1 =  'SELECT * FROM attendance where (iClassNumber=999999999) AND (EventID='+id+' or EventID="'+tempID+'")';
                }

              connection.query(strSQL1, function(err, rows1) {
                   if (err) {
                    
                      connection.end();
                      callback(err, null, null);
    
                      }else{
                        //###### Wed May 4 18:23:41 PDT 2018  Get counts for the TempIDs as well; tempID now sent in parms
                        //var strSQL2 =  'SELECT * FROM attendance where EmpID="invalid" AND EventID='+id;
                        if (tempID == ""){
                            var strSQL2 =  'SELECT * FROM attendance where EmpID="invalid" AND EventID='+id;
                        }else{
                            var strSQL2 =  'SELECT * FROM attendance where (EmpID="invalid") AND (EventID='+id+' or EventID="'+tempID+'")';
                        }

                        connection.query(strSQL2, function(err, rows2) {
                             if (err) {
                                console.log('error with the select invalids query');
                              
                                connection.end();
                                callback(null, rows1, null);
              
                            }else{
                                    connection.end();
                                    callback(null, rows1, rows2);  //successful callback of both queries
                                  }
                              });
                        
                        }
                    });
            }
        });
            
    };


////////////////////////////////////////////////////////////////
// FUTURE implementation using the dedicated mustering tables //
////////////////////////////////////////////////////////////////
module.exports.getMusterRecords_FUTURE = function(id, zone, callback){

    //get a connection using the common handler in models/db.js
    db.createConnection(function(err,reslt){  
        if (err) {
          console.log('Error while pErforming common connect query: ' + err);
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;
          console.log('here is the connnection '+reslt.threadId);

          var strSQL =  'SELECT * FROM muster where musterID='+id+' and zone='+zone;
          connection.query(strSQL, function(err, rows, fields) {
               if (!err) {
                //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
                  //var array=[];
                  //rows.forEach(function(item) {
                     // array.push(item.clientSWID);
                   // });
                  console.log('results of join'+JSON.stringify(rows));
                  connection.end();
                  callback(null, rows);


                  }else{
                      console.log('error with the max query');
                      connection.end();
                      callback(err, rows);
                    }
                });
        }
    });
        
};


