
//######
//###### Wed Mar 2018 14:12:19 PDT 2018  New Module for API. Replaces Auth part 
//###### of mobss_scripts.lc
//######

// HANDLERS:
// checkAuth
//


var mysql = require('mysql');
var path = require( 'path' );
var db = require('../models/db');
var devices = require('../models/devices'); //devices db interaction module in MODELS
var randomstring = require("randomstring");
var datetime = require('../controllers/datetime');



////////////////////////////////////////////////////////////////////////////
//  API to check authCode from PRIVATE (sweep/app) callers
//////////////////////////////////////////////////////////////////////////////
exports.checkAuth = function(req, res) {
  

  //Make sure the api call has a valid password
  console.log ("here is the POST body "+JSON.stringify(req.body))
  var pass = req.body.pass
  var device = req.body.authCode

  //Check the password is correct
  if (pass != "agpbrtdk") {
    res.status (400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
    res.send ('Error: Invalid API password') // This goes into tData and urlResponse
    // or res.status(400).json({error: 'message'})
    
  }else{

    // BLANK AUTHCODE -- this is a new device/App REQUESTING ACTIVATION
    if (device == ""){  

      var authCodeForDB = randomstring.generate(36);
      var currentStatusForDB = 0    // 0 is requesting activation
      var updateTime = new Date()
      var statusDate = datetime.syncCurrentDateTimeforDB(updateTime)

      //First log the connection
      devices.createConnectionsRecord(authCodeForDB, statusDate, currentStatusForDB, function(err,reslt2){  
        if (err) {
          console.log('API Error: common connect : ' + err);
          //Send a 500 -- server side problem
        
        }else{
          
          // Nothing to do

        }
      })
     
    // create the deviceheader for the device/app
    devices.createDeviceHeaderRecord(authCodeForDB, currentStatusForDB, statusDate, function(err,reslt1){  
      if (err) {
        console.log('API Error: common connect : ' + err);
        //Send a 500 -- server side problem
        res.status (500) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 500 returned from server
        res.send ('API error on the server') // When called from the App, this goes into tData and urlResponse
        // or res.status(400).json({error: 'message'})    
      }else{

        // Now create a deviceHistory record
        var StatusChangeComment = "Device requesting activation"
        devices.createDeviceHistoryRecord(authCodeForDB, currentStatusForDB, statusDate, StatusChangeComment, function(err,reslt2){  
          if (err) {
            console.log('API Error: common connect : ' + err);
            //Send a 500 -- server side problem
            res.status (500) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 500 returned from server
            res.send ('API error on the server') // When called from the App, this goes into tData and urlResponse
            // or res.status(400).json({error: 'message'})    
          }else{
            
            res.status (200) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 500 returned from server
            res.send ("Success: Code #2.2 " + authCodeForDB) 
  
          }
        })

      }
    })


    }else{
    
    // An AuthCode was sent so CHECK AUTHCODE is valid & active
    devices.getDeviceForAuthCode(device, function(err,reslt){  
      if (err) {
        console.log('API Error: common connect : ' + err);
        //Send a 500 -- server side problem
        res.status (500) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 500 returned from server
        res.send ('API error on the server') // When called from the App, this goes into tData and urlResponse
        // or res.status(400).json({error: 'message'})    
      }else{
        
        
        var currentStatus = reslt

        // Create a connections log record
        var authCodeForDB = device
        var updateTime = new Date()
        var statusDate = datetime.syncCurrentDateTimeforDB(updateTime)
  
        //First log the connection
        devices.createConnectionsRecord(authCodeForDB, statusDate, currentStatus , function(err,reslt2){  
          if (err) {
            console.log('API Error with Connections record : ' + err);
            //Send a 500 -- server side problem
          
          }else{
            
            // Nothing to do
  
          }
        })

        //And if a match was found, update the deviceHeader ConnectionAttemptCount, LastConnect
        //There won't be a deviceHeader record for unknown device (i.e. "4")
        if (currentStatus != "4"){
          devices.updateDeviceHeaderWithConnection(authCodeForDB, statusDate, function(err,reslt2){  
            if (err) {
              console.log('API Error with DeviceHeader Update : ' + err);
              //500 -- server side problem
            
            }else{
              
              // Nothing to do
    
            }
          })
        }

        // format the return to the caller based on the results of the device look up
        switch (currentStatus)
        {
          case "4": // No device was found for the AuthCode. A connections record with a status of "4" will be logged
            res.status (200) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 500 returned from server
            res.send ("Error: restricted access - unauthorised access attempt (code #2.1)") 
            break;
                        
          case "1": // Device valid and active
            res.status (200) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 500 returned from server
            res.send ("SUCCESS TRUE") 
            break;


          case "0": // Device activation request awaiting action ["statusUnconfirmed]"]
            res.status (200) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 500 returned from server
            res.send ("Error: restricted access - insecure device status (code #3.0)") 
            break;

          case "2": // Device has been deactivated ["statusDeactivated]"]
            res.status (200) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 500 returned from server
            res.send ("Error: restricted access - insecure device status (code #3.1)") 
            break;

          case "3": // Device has been blacklisted ["statusBlacklisted]"]
            res.status (200) // When called from the App, this goes into "the result" -- tsneterr: HTTP response code 500 returned from server
            res.send ("Error: restricted access - insecure device status (code #3.2)") 
            break;

          default: //nothing for now

        }
        


      }
      
      
    });

  }
  } 
  
}


