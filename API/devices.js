//######
//###### Wed Nov 1 14:12:19 PDT 2017  New Module for API
//######

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var csvImport = require('../controllers/csvImport');
var crlf = require('crlf-helper');
var db = require('../models/db');
var devices = require('../models/devices'); //devices db interaction module in MODELS


////////////////////////////////////////////////////////////////////////////
//  API to get device name PRIVATE callers
//////////////////////////////////////////////////////////////////////////////
exports.getDeviceName = function(req, res) {
  

  //Make sure the api call has a valid password
  console.log ("here is the DEVICE POST body "+JSON.stringify(req.body))
  var data1  = req.body.data
  //data = JSON.parse(data1)
  var pass = req.body.pass
  var authCode = req.body.authCode
  

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
                    
        //Process the request through the MODEL
        devices.getDeviceName(authCode, function(err,reslt){ 
          if (err) {
            console.log('API Error: device name request: ' + err);
            res.status(400);
            res.send('Unnamed device');
            
            
          }else{
            res.status(200);
            res.send(reslt[0].Name); 
          }
          
          connection.end();                
          
        })//end of devices model call
   
      }
      
      
    });
  } 
  
}


