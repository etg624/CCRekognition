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
//  API to test server connectivity
//////////////////////////////////////////////////////////////////////////////
exports.testConnect = function(req, res) {
  

  //Make sure the api call has a valid password
  console.log ("here is the DEVICE POST body "+JSON.stringify(req.body))
  var data1  = req.body.data
  //data = JSON.parse(data1)
  var pass = req.body.pass
  var action = req.body.action
  

  if (pass != "agpbrtdk") {
    res.status (400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
    res.send ('Error: Invalid API password') // This goes into tData and urlResponse
    // or res.status(400).json({error: 'message'})
    
  }else{

    if (action == "seconds"){
            res.status(200);
            res.send("SUCCESS"); 
    }else{
        res.status(400);
        res.send("Error: unsupported action requested")
    }      
  } 
  
}


