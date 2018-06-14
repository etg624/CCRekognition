const https = require("https");
var people = require('../models/people');
var db = require('../models/db');
var mysql      = require('mysql');


'use strict';

var relayHost = process.env.RELAY_HOST


module.exports.relayPeople = function(moduleCallback){
  
  var data = JSON.stringify({
      pass: 'agpbrtdk',
  });
    

  var options = {
    //host: 'localhost'
    host: relayHost
  , method: 'POST'
  ,json: true
  ,headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
  }

  , path: '/getPeople/'
  , rejectUnauthorized: false
  };

  options.agent = new https.Agent(options);


  var callback = function(response) {
      var str = '';
      
      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function(chunk) {
      str += chunk;
      });
      
      //the whole response has been recieved, so we just print it out here
      response.on('end', function() {
        
        //Don't do anyting if the results are an empty set
        var strJ = JSON.parse(str)
        if (strJ.length > 0){
          console.log("after parse LENGTH"+JSON.stringify(strJ.length))
          
          console.log("after parse"+JSON.stringify(strJ[0]))
          
          console.log("after parse"+strJ[0].iClassNumber)
      
          

          var counter = 0;
          var rowsToInsert = strJ.length-1;
          var errInsert = null;
          
          
          var connection = mysql.createConnection({

              
                host     : process.env.DB_HOST,
                user     : process.env.DB_USER,
                password : process.env.DB_PASS,
                database : process.env.DB_NAME
              });
          connection.connect(function(err) {
          if (err) {
            console.error('error doing the  connect ' + err.stack);
            // email mobss support if there is a problem connecting to the database
            
          } else {
          
                for (var i=0; i < strJ.length; i++) {
                    var _firstName = strJ[i].FirstName
                    var _lastName = strJ[i].LastName
                    var _badgeNumber = strJ[i].iClassNumber
                    var _title = strJ[i].Title
                    var _empID = strJ[i].EmpID
                    var _imageName = strJ[i].imageName
                    people.createPeopleRecord(connection, _firstName, _lastName, _badgeNumber, _title, _empID, _imageName, function(err,rslt){
                    
                      /**
                       * The creatPeopleRecord function is called for each record in the csv file.
                       * The createPeopleRecord itself makes the insert asynchronously  and each time
                       * it comes through that callback it will test for an error and drop back to here.
                       * Once it has dropped back to here for the final time - ie all the inserts have 
                       * been attempted, we callback to the parent with the final result
                       * Note we are using a counter to track the number of times the createPeopleRecord 
                       * callback with results.  Then if there has been an error (in any of the insert 
                       * record attempts), We simply pass that back to the parent function
                       * 
                       */
                        counter++;
                        /**
                         * Track the errors against the number of rows to be added
                         * When all the callbacks are done, then process the error
                         * 
                         */
                        if (err) { if (errInsert==null){errInsert=err;}}
                      
                        if (counter == rowsToInsert){
                          if (errInsert !=null){
                            callback(errInsert, null);
                          }else{
                            
                            console.log("INSERTSUCESSFUL "+(rowsToInsert+1))
                            moduleCallback(null, rowsToInsert);
                          }
                        }
                    

                    }); // end of createPeopleRecord */


                }//end of loop


              };
              });

        }//end if str is > 0

      });
    };


  https.request(options, callback).write(data);
}
