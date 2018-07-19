var db = require('./db');


module.exports.getAttendance = function (id, callback) {
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'SELECT * FROM attendance where EventID=' + id;
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}


module.exports.getUnknowns = function (id, callback) {
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'SELECT * FROM attendance where iClassNumber=999999999 AND EventID=' + id;
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.getInvalids = function (id, callback) {
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'SELECT * FROM attendance where EmpID="invalid" AND EventID=' + id;
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.getUnaccounted = function (callback) {
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'SELECT * FROM unaccounted';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}


module.exports.getEvacuationList = function (callback) {
    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'SELECT * FROM evacuation';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.getMusterPoints = function(id, callback){
    
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
          var strSQL = 'SELECT DeviceAuthCode,COUNT(*) as count FROM attendance WHERE EventID='+id+' GROUP BY DeviceAuthCode ORDER BY count DESC';
          connection.query(strSQL, function(err, attendanceResult, fields) {
               if (!err) {
                //feb--send back the results via callback (cant 'return results' from asynch fucntions, have to use calllback)
                var strSQL1 = 'SELECT PointID, lat, lng, Description, DeviceAuthCode FROM musterPoint';
                connection.query(strSQL1, function(err, musterPointResult) {
                     if (!err) {
                      // Loop through the muster point array and match the count array
                      for (var i=0; i < attendanceResult.length; i++) {
            
                          //console.log('whats the array value  ' + JSON.stringify(resEvacs[i].iClassNumber)); 
                          //console.log('whats the muster array length  ' + JSON.stringify(resz1.length)); 
                          var resultsArray = [];
                          for (var j=0; j < musterPointResult.length; j++) {
                            
                              if (musterPointResult[j].DeviceAuthCode==attendanceResult[i].DeviceAuthCode) {
                               // if (musterPointResult[j].DeviceAuthCode==attendanceResult[i].MobSSOperator) {
                                

                                let record = {
                                    PointID: musterPointResult[j].PointID,
                                    Description: musterPointResult[j].Description,
                                    lat: musterPointResult[j].lat,
                                    lng: musterPointResult[j].lng,
                                    count: attendanceResult[i].count,
                                    DeviceAuthCode: attendanceResult[i].DeviceAuthCode
                                    
                                }

                                resultsArray.push(record);
                                }
                              
                          }
                        //   console.log('logging resultsArray');
                        //   console.log(resultsArray);
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
