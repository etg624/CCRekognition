//######
//###### Wed Nov 1 14:12:19 PDT 2017  New module for importing tickets
//######

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var csvImport = require('../controllers/csvImport');
var crlf = require('crlf-helper');
var db = require('../models/db');




////////////////////////////////////////////////////////////////////////////
//  API prototype
//////////////////////////////////////////////////////////////////////////////
exports.getTickets = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  
  
  // feb-- don't let nameless people view the page.  redirect them to home page.
   //if (typeof sess.username == 'undefined') {
     // res.redirect('/');
    //}else{

  //Make sure the api call has a valid password
console.log ("here is the body "+JSON.stringify(req.body))
console.log("here is the POST API IN^^^^^API "+JSON.stringify(req.params))
var pass = req.body.pass
console.log("the password sent is "+pass)
//How to send back an error???
if (pass != "agpbrtdk") {
  res.status (400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
  res.send ('None shall pass') // This goes into tData and urlResponse
  // or res.status(400).json({error: 'message'})
  
}else{

  db.createConnection(function(err,reslt){  
    if (err) {
      console.log('Error while pErforming common connect query: ' + err);
      callback(err, null);
    }else{
      //process the i/o after successful connect.  Connection object returned in callback
      var connection = reslt;
      console.log('here is the connnection '+reslt.threadId);


      var _sqlQ = "SELECT * FROM EventTickets";
      connection.query(_sqlQ, function(err, results) {
        //connection.release();
        if(err) { console.log('Internal API error:  '+err); callback(true); connection.end(); return; }
      
        connection.end();
        console.log('API return data for eventTickets '+JSON.stringify(results));


        //TypeError: First argument must be a string or Buffer
        //res.end (results);

        //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
        //res.send (results);
        
        //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
        res.json (results);
        
      });
    } 
  });
}

}

////////////////////////////////////////////////////////////////////////////
//  API prototype
//////////////////////////////////////////////////////////////////////////////
exports.getTickets2 = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  
  
  // feb-- don't let nameless people view the page.  redirect them to home page.
   //if (typeof sess.username == 'undefined') {
     // res.redirect('/');
    //}else{

  //Make sure the api call has a valid password
console.log ("here is the body "+JSON.stringify(req.body))
console.log("here is the POST API IN^^^^^API "+JSON.stringify(req.params))
var pass = req.body.pass
console.log("the password sent is "+pass)
//How to send back an error???
//if (pass != "agpbrtdk") {
 // res.status (400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
  //res.send ('None shall pass') // This goes into tData and urlResponse
  // or res.status(400).json({error: 'message'})
  
//}else{

  db.createConnection(function(err,reslt){  
    if (err) {
      console.log('Error while pErforming common connect query: ' + err);
      callback(err, null);
    }else{
      //process the i/o after successful connect.  Connection object returned in callback
      var connection = reslt;
      console.log('here is the connnection '+reslt.threadId);


      var _sqlQ = "SELECT * FROM EventTickets";
      connection.query(_sqlQ, function(err, results) {
        //connection.release();
        if(err) { console.log('Internal API error:  '+err); callback(true); connection.end(); return; }
      
        connection.end();
        console.log('API return data for eventTickets '+JSON.stringify(results));


        //TypeError: First argument must be a string or Buffer
        //res.end (results);

        //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
        //res.send (results);
        
        //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
        res.json (results);
        
      });
    } 
  });
//}

}


