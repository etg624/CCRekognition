var https = require('https');
var lnlGetCardholders = require('./lenelOAGetCardholders')
var lnlGetBadges = require('./lenelOAGetBadges')
var lnlPostAuth = require('./lenelOAPostAuthentication')
var db = require('./models/db')
var people = require('./models/people')
var empBadge = require('./models/empBadge')
var accessLevels = require('./models/accessLevels')


var token =""

// THIS VERSION SUCCESSFULLY RETRIEVES ALL CARDHOLDERS AND BADGES INTO TWO DIFFERNET ARRAYS

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
                    
                    
                    mobssTablesArray.push({FirstName : theFirstName, LastName : theLastName, BadgeID : theBadgeID, Title: theTitle, EmpID : theBadgeID, ActivationDate : theActivateDate, DeactivationDate : theDeactivateDate}); 
                   
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
                      //callback(err, null);  add this back when lenelOAGetPeople is called from somewhere (presumably manual and sweep)
                    }else{
                      var connection = reslt
                      
                      db.createConnection(function(err,reslt2)
                      {  
                          if (err) {
                            console.log('Error while performing common connect query: ' + err);
                            //callback(err, null);  add this back when lenelOAGetPeople is called from somewhere (presumably manual and sweep)
                          }else{
                            var connection2 = reslt2

                            db.createConnection(function(err,reslt3)
                            {  
                                if (err) {
                                  console.log('Error while performing common connect query: ' + err);
                                  //callback(err, null);  add this back when lenelOAGetPeople is called from somewhere (presumably manual and sweep)
                                }else{
                                  var connection3 = reslt3

                                  for (var k=0; k < mobssTablesArray.length; k++) {
                                    
                                    // CREATE PEOPLE TABLE
                                    //******************** */
                                    // people call parms: connection, firstName, lastName, iClassNumber, title, empID, image
                                    people.createPeopleRecord(connection, mobssTablesArray[k].FirstName, mobssTablesArray[k].LastName, mobssTablesArray[k].BadgeID, mobssTablesArray[k].Title, mobssTablesArray[k].BadgeID, "image.jpg", function(err,reslt)
                                    {  
                                        if (err) {
                                          console.log('Error while performing people create query: ' + err);
                                          //callback(err, null);  add this back when lenelOAGetPeople is called from somewhere (presumably manual and sweep)
                                        }else{
                                          console.log('SUCCESSFUL PEOPLE RECORD ADD');
                                          
                                        }
                                    })

                                    // CREATE EMPBADGE TABLE
                                    //********************** */
                                    //connectionEB, badgeID, empID, status, callback
                                    theActDate = mobssTablesArray[k].ActivationDate
                                    theDeactDate = mobssTablesArray[k].DeactivationDate
                                    
                                    //.toISOString method gets current date in the lenel format
                                    var _d = new Date().toISOString()
                                    
                                    console.log("DATE ???? "+_d)
                                    console.log("ACT DATE ???? "+theActDate)
                                    console.log("DEACT DATE ???? "+theDeactDate)
                                    
                                    // Set the badge status field. (the empbadge table model converts this to a status code)
                                    if (theActDate <= _d){
                                      if(theDeactDate >= _d){
                                        theStatus = "Active"
                                      }else{
                                        theStatus = "Expired"
                                      }

                                    }else{
                                        theStatus = "Inactive"
                                    }
                                    
                                    console.log ('The STATUS...'+theStatus)
                                    empBadge.createEmpBadge(connection2, mobssTablesArray[k].BadgeID, mobssTablesArray[k].BadgeID, theStatus, function(err,reslt)
                                    {  
                                        if (err) {
                                          console.log('Error while performing EmpBadge create query: ' + err);
                                          //callback(err, null);  add this back when lenelOAGetPeople is called from somewhere (presumably manual and sweep)
                                        }else{
                                          console.log('SUCCESSFUL EMPBADGE RECORD ADD');
                                          
                                        }
                                    })

                                    // CREATE ACCESSLEVELS TABLE
                                    //************************** */
                                    // connection, badgeID, empID
                                    accessLevels.createAccessLevel(connection3, mobssTablesArray[k].BadgeID, mobssTablesArray[k].BadgeID, function(err,reslt)
                                    {  
                                        if (err) {
                                          console.log('Error while performing AccessLevels create query: ' + err);
                                          //callback(err, null);  add this back when lenelOAGetPeople is called from somewhere (presumably manual and sweep)
                                        }else{
                                          console.log('SUCCESSFUL ACCESSLEVELS RECORD ADD');
                                          
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


