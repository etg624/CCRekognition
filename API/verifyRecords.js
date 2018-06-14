//######
//###### Wed Nov 1 2017 14:12:19 PDT 2017  New Module for API. replaces verifyrecords.lc
//######

//###### Mon Dec 11 2017 07:47:12 PST 2017  ALSO NEED TO VALIDATE THE DEVICE CODE.  NOT IN THE API YET
//###### Mon Feb 02 2018 07:47:12 PST 2017 Post VerifyRecords to Lenel as Events

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var csvImport = require('../controllers/csvImport');
var crlf = require('crlf-helper');
var db = require('../models/db');
var verifyRecords = require('../models/verifyRecords'); //verifyrecords db interaction module in MODELS
var vx_verifyRecords = require('../API_vx/vx_verifyRecords'); //vx event posting in API_vx
var lnlPostEvent = require('../controllers/lenelOAPostEvent'); //lenel event posting
var lnlPostAuth = require('../controllers/lenelOAPostAuthentication'); //lenel authentication



////////////////////////////////////////////////////////////////////////////
//  API to post verifyrecords
//////////////////////////////////////////////////////////////////////////////
exports.postVerifyRecords = function(req, res) {
  

  //Make sure the api call has a valid password
  console.log ("here is the POST body "+JSON.stringify(req.body))
  var data1  = req.body.data
  data = JSON.parse(data1)
  var pass = req.body.pass
  var device = req.body.authCode
  

  console.log("the password sent is "+pass)
  console.log("the data sent is "+JSON.stringify(data))
  console.log("the device sent is "+device)
  console.log("the device sent is "+JSON.stringify(device))

  // console.log("the elements . "+JSON.stringify(data[2]))
  // console.log("the elements p "+JSON.stringify(data[2].BadgeID))
  // console.log("the elements p "+ data[2].BadgeID)
  // console.log("the nuimber of rows sent is "+data.length)


  //How to send back an error???
  if (pass != "agpbrtdk") {
    res.status (400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
    res.send ('Error: Invalid API password') // This goes into tData and urlResponse
    // or res.status(400).json({error: 'message'})
    
  }else{

    db.createConnection(function(err,reslt){  
      if (err) {
        console.log('API Error: common connect : ' + err);
        callback(err, null);
      }else{
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = reslt;

        //Initialize counters to keep track of number of callbacks from the model and any errors
        var rowsToInsert = data.length
        var counter = 0
        var totalCounter = 0
        var errorCounter = 0
        
        //Loop through all the data records sent in the HTTP request body and post them to 
        //the verifyrecords table
        for (var j=0; j < data.length; j++) {
          
              var fields = data[j]
          
          //Process the update through the MODEL
          verifyRecords.createVerifyRecord(connection, fields, function(err,reslt){ 
            totalCounter++
            if (err) {
              console.log('API Error: verifyRecords post: ' + err);
              errorCounter++
              
            }else{
              counter++
              
            }
            //keep track of the total number of times we get callbacks from the model
            totalCounter = counter + errorCounter
            if (totalCounter == rowsToInsert){  

              if (errorCounter ==0){

                ///////////////////////////////EXTERNAL PACS INTERFACE///////////////////////////////////////////
                //The verifyrecords file has been successfully updated, so if we are using AccessNSite
                //call and update the vx system.  Other sources and their APIs can be added here.

                switch (process.env.EXPORT_SOURCE)
						    {
                   case "ACCESSNSITE":
                    //post all the records
                    //reset counters
                    var vx_counter = 0
                    var vx_errorCounter = 0
                    var vx_totalCounter = 0

                    for (var j=0; j < data.length; j++) {
                      
                      var fields = data[j]

                      vx_verifyRecords.recordEvent(fields, function(err,reslt){ 

                        if (err) {
                          console.log('API vx Error: recording verifyRecords event: ' + err);
                          vx_errorCounter++
                          
                        }else{
                          vx_counter++
                          
                        }

                         //keep track of the total number of times we get callbacks from the model
                        vx_totalCounter = vx_counter + vx_errorCounter
                        if (vx_totalCounter == rowsToInsert){  

                          if (vx_errorCounter ==0){
                            console.log("vx external system was successfully updated with "+vx_totalCounter+" records")
                            //need to go and mark the verifyrecords as sent_to_vx at this point

                          }else{
                            console.log("vx external system update: "+vx_counter+" records successful, "+vx_errorCounter+" records unsuccessful")
                            //leave the verifyrecords marked unsent_to_vx

                          }

                        }

                      });

                    }
                      break;

                  case "LENEL_DIRECT":
                      //post all the records to Lenel
                      //reset counters
                      var lnl_counter = 0
                      var lnl_errorCounter = 0
                      var lnl_totalCounter = 0

                      // first get the token to authenticate with Lenel
                      lnlPostAuth.getToken(function(err, result){ 
                        if (err) {
                          console.log('Error while performing GET Lenel Token' + err);
                        }else {
                              var token = result
  
                              for (var k=0; k < data.length; k++) {
                              // exports.postEvent = function(token, device, result, badgeID, callback) {
                                  
                                var fields = data[k]
                                var device= data[k].MobssOperator
                                var result= data[k].Result
                                var badgeID= data[k].BadgeID
                                
          
                                lnlPostEvent.postEvent(token, device, result, badgeID, function(err,reslt){ 
          
                                  if (err) {
                                    console.log('API Error: recording Lenel event: ' + err);
                                    lnl_errorCounter++
                                    
                                  }else{
                                    lnl_counter++
                                    
                                  }
          
                                  //keep track of the total number of times we get callbacks from the model
                                  lnl_totalCounter = lnl_counter + lnl_errorCounter
                                  if (lnl_totalCounter == rowsToInsert){  
          
                                    if (lnl_errorCounter ==0){
                                      console.log("Lenel external system was successfully updated with "+lnl_totalCounter+" records")
                                      //need to go and mark the verifyrecords as sent_to_lenel at this point
          
                                    }else{
                                      console.log("Lenel external system update: "+lnl_counter+" records successful, "+lnl_errorCounter+" records unsuccessful")
                                      //leave the verifyrecords marked unsent_to_lenel
          
                                    }
          
                                  }
          
                                });
          
                              }
                        }
                      })
                        break;
						      default: 
                    //No action
						    }
                 
                ///////////////////////////////END OF EXTERNAL PACS INTERFACE/////////////////////////////////////

                //Return code will only be representative of the commandCenter update as we wont have all the 
                //callback info from the vx/lenel interface calls -- AND we dont want to hold up the app while that is 
                //happening.  We should have a mechanism where the vx interface just checks for unsent verifyrecords
                //rather than just sending those records sent from the app.
                res.status(200);
                res.send(counter+' records posted to commandCenter');

              }else{
                
                res.status(400);
                res.send('Error : only '+counter+' of '+totalCounter+' records posted');
                
              }      
              connection.end();                
            }
  

          })//end of verifyrecords model call
        
        }



      }
      
      
    });
  } 
  
}


