var https = require('https');
var lnlGetCardholders = require('./lenelOAGetCardholders')
var lnlGetBadges = require('./lenelOAGetBadges')
var lnlPostAuth = require('./lenelOAPostAuthentication')
var db = require('../models/db')
var people = require('../models/people')
var empBadge = require('../models/empBadge')
var accessLevels = require('../models/accessLevels')


exports.getPeople = function(callback) {
  

var token =""

// THIS VERSION SUCCESSFULLY RETRIEVES ALL CARDHOLDERS AND BADGES INTO TWO ARRAYS THEN COMBINES
// THESE ARRAYS INTO AN ARRAY READY TO POPULATE THE MOBSS TABLES

//MAKE THE AUTHENTICATION CALL HERE AND PASS THE SESSION TOKEN TO THE CARDHOLDER AND BADGE HANDLERS
 
lnlPostAuth.getToken(function(err, result){ 
  if (err) {
    console.log('Error while performing GET Token' + err);
  }
  else {
    token = result
    lnlGetCardholders.getCardholders(token, function(err, result){ 
        if (err) {
          console.log('Error while performing GET Cardholder' + err);
        }
        else {
            console.log("HERE IS THE RESULT "+JSON.stringify(result))
            
            //Now get the badge records
            lnlGetBadges.getBadges(token, function(err, resultB){ 
            if (err) {
              console.log('Error while performing GET Badges: ' + err);
            }
            else {
              console.log("HERE IS THE BADGES RESULT "+JSON.stringify(resultB))

              //This is where we will need to process the Arrays to create a People table-ready array
              //.....
              var badgeArrayLength = resultB.length
              var mobssTablesArray = []
              console.log('BADGE ARRAy LENGTH '+JSON.stringify(badgeArrayLength))
              for (var i=0; i < badgeArrayLength; i++) {

                //People table sructure
                //---------------------

                // |  FirstName   | varchar(64)  | YES  | MUL | NULL    |       |
                // | LastName     | varchar(64)  | YES  | MUL | NULL    |       |
                // | iClassNumber | bigint(20)   | YES  | UNI | NULL    |       |
                // | updateTime   | varchar(64)  | YES  |     | NULL    |       |
                // | EmpID        | varchar(40)  | YES  |     | NULL    |       |
                // | Status       | varchar(10)  | YES  |     | NULL    |       |
                // | UserName     | varchar(25)  | YES  |     | NULL    |       |
                // | Image        | blob         | YES  |     | NULL    |       |
                // | Title        | varchar(32)  | YES  |     | NULL    |       |
                // | imageName    | varchar(100) | YES  |     | NULL    |       |
                // | hasImage     | varchar(5)   | YES  |     | NULL    |       |
                // | EmailAddr    | varchar(40)  | YES  |     | NULL    |       |
                // | Department   | varchar(40)  | YES  |     | NULL    |       |
                // | Division     | varchar(40)  | YES  |     | NULL    |       |
                // | SiteLocation | varchar(40)  | YES  |     | NULL    |       |
                // | Building     | varchar(40)  | YES  |     | NULL    |       |
                // | Identifier1  | varchar(40)  | YES  |     | NULL    |


                //Cardholder Array
                //----------------
                
                //{ID : iD, 
                // LastName: lastName, 
                // FirstName: firstName, 
                // Department : dept, 
                // Building : building, 
                // Division : division, 
                // Title : title, 
                // Email : email}); 
                         
                
                //Badge Array
                //-----------

                //{BadgeKey : badgeKey, 
                // BadgeID: badgeID, 
                // Activate: activate, 
                // Deactivate : deactivate, 
                // PersonID : personID, 
                // Status : status}); 
                

                theBadgeID = resultB[i].BadgeID
                thePersonID = resultB[i].PersonID
                theActivateDate = resultB[i].Activate
                theDeactivateDate = resultB[i].Deactivate
                theLnlStatus = resultB[i].Status
                
                console.log('we are lookig for this guy '+JSON.stringify(thePersonID))
                
                console.log('CARD ARRAy LENGTH '+JSON.stringify(result.length))
                
                for (var j=0; j < result.length; j++) {
                  //var intOfString = parseInt(resz1[i].iClassNumber); 
                  if (result[j].ID == thePersonID){
                    
                    var theLastName = result[j].LastName
                    var theFirstName = result[j].FirstName
                    var theDepartment = result[j].Department
                    var theBuilding = result[j].Building
                    var theDivision = result[j].Division
                    var theTitle = result[j].Title        
                    var theEmailAddr = result[j].Email
                    
                    
                    mobssTablesArray.push({FirstName : theFirstName, LastName : theLastName, BadgeID : theBadgeID, Title: theTitle, EmpID : theBadgeID, ActivationDate : theActivateDate, DeactivationDate : theDeactivateDate, LnlStatus : theLnlStatus}); 
                   
                  }
                  
                }

              }

              //Now we have the full array built, send it row by row for insert into the mobss tables
              console.log('MOBSS ARRAY LENGTH '+mobssTablesArray.length)
              console.log('MOBSS ARRAY  '+JSON.stringify(mobssTablesArray))
              console.log("here is an addressable array field "+mobssTablesArray[0].BadgeID)
              
                //Create THREE connections, one for each table (for speed, as we are using insert processing)
                db.createConnection(function(err,reslt)
                {  
                    if (err) {
                      console.log('Error while performing common connect query: ' + err);
                      callback(err, null);  
                    }else{
                      var connection = reslt

                      
                      db.createConnection(function(err,reslt2)
                      {  
                          if (err) {
                            console.log('Error while performing common connect query: ' + err);
                            callback(err, null); 
                          }else{
                            var connection2 = reslt2

                            db.createConnection(function(err,reslt3)
                            {  
                                if (err) {
                                  console.log('Error while performing common connect query: ' + err);
                                  callback(err, null);  
                                }else{
                                  var connection3 = reslt3
                                  var counter = 0
                                  var rowsToInsert = 0
                                  var errInsert = null

                                  for (var k=0; k < mobssTablesArray.length; k++) {
                                    
                                    // CREATE PEOPLE TABLE
                                    //******************** */
                                    // people call parms: connection, firstName, lastName, iClassNumber, title, empID, image
                                    people.createPeopleRecord(connection, mobssTablesArray[k].FirstName, mobssTablesArray[k].LastName, mobssTablesArray[k].BadgeID, mobssTablesArray[k].Title, mobssTablesArray[k].BadgeID, "image.jpg", function(err,reslt)
                                    {  
                                       

                                        /**
                                         * The createPeopleRecord function is called for each record in the csv file.
                                         * The createPeopleRecord itself makes the insert asynchronously  and each time
                                         * it comes through that callback it will test for an error and drop back to here.
                                         * Once it has dropped back to here for the final time - ie all the inserts have 
                                         * been attempted, we callback to the csv.js parent with the final result
                                         * Note we are using a counter to track the number of times the createPeopleRecord 
                                         * callback with results.  Then if there has been an error (in any of the insert 
                                         * record attempts), We simply pass that back to the parent function
                                         * 
                                         */
                                        counter++;
                                        /**
                                         * only pass back the first encountered error.
                                         * this should allow us to destroy the connection
                                         * at the first error and therefore finish processing
                                         * quicker in event of an error
                                         * 
                                         */
                                        if (err) { if (errInsert==null){errInsert=err; sess.error = 'Error inserting a csv record '+err;}}
                                        //console.log('THE COUNTER IN CSVIMPORTINSERT '+counter)
                                        //console.log('THE errInsert IN CSVIMPORTINSERT '+errInsert)

                                        
                                      
                                        if (counter == rowsToInsert){
                                          sess.success==null;
                                          
                                        if (errInsert==null) {
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

                                          // get the row count for confirmation message
                                          var query = connection.query('select count(*) as rowCount from people', function(err, result) {

                                            console.log ('here is rowcount '+JSON.stringify(result[0].rowCount))

                                            if (!err) {sess.success = ' : '+result[0].rowCount+' cardholders'}; 

                                            console.log('READY NOW'+sess.success); 
                                            connection.end()
                                            callback(errInsert, sess.success);
                                      
                                          });   

                                        }
                                        
                                      };



                                    })

                                    // CREATE EMPBADGE TABLE
                                    //********************** */
                                    //connectionEB, badgeID, empID, status, callback
                                    theActDate = mobssTablesArray[k].ActivationDate
                                    theDeactDate = mobssTablesArray[k].DeactivationDate
                                    theLnlStatus = mobssTablesArray[k].LnlStatus
                                    
                                    
                                    //.toISOString method gets current date in the lenel format
                                    var _d = new Date().toISOString()
                                    
                                    console.log("DATE ???? "+_d)
                                    console.log("ACT DATE ???? "+theActDate)
                                    console.log("DEACT DATE ???? "+theDeactDate)
                                    
                                    // Set the badge status field. (the empbadge table model converts this to a status code)
                                    // if (theActDate <= _d){
                                    //   if(theDeactDate >= _d){
                                    //     theStatus = "Active"
                                    //   }else{
                                    //     theStatus = "Expired"
                                    //   }

                                    // }else{
                                    //     if( theLnlStatus = "2"){
                                    //       theStatus = "Lost"
                                    //     }else{
                                    //       theStatus = "Inactive"
                                    //     }
                                    // }

                                    if (theActDate <= _d){
                                      if(theDeactDate >= _d){
                                        theStatus = "Active"
                                      }else{
                                        theStatus = "Expired"
                                      }

                                    }else{
                                        theStatus ="Inactive"
                                    }

                                    if (theLnlStatus == "2"){
                                        theStatus = "Lost"
                                    }
                                    
                                    console.log ('The STATUS...'+theStatus)


                                    empBadge.createEmpBadge(connection2, mobssTablesArray[k].BadgeID, mobssTablesArray[k].BadgeID, theStatus, function(err,reslt)
                                    {  
                                        if (err) {
                                          console.log('Error while performing EmpBadge create query: ' + err);
                                          callback(err, null);  
                                        }
                                    })

                                    // CREATE ACCESSLEVELS TABLE
                                    //************************** */
                                    // connection, badgeID, empID
                                    accessLevels.createAccessLevel(connection3, mobssTablesArray[k].BadgeID, mobssTablesArray[k].BadgeID, function(err,reslt)
                                    {  
                                        if (err) {
                                          console.log('Error while performing AccessLevels create query: ' + err);
                                          callback(err, null);  
                                        }
                                    })

                                  } 

                                    }//The 3rd db connect
                            }) //The 3rd db connect
                                }//The 2nd db connect
                      }) //The 2nd db connect
                    }//The 1st db connect
                }) //The 1st db connect

              

            }
            })
        }   
    })  
  }
})  

}
