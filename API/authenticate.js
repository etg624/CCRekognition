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
var jwt = require ('jsonwebtoken')




////////////////////////////////////////////////////////////////////////////
//  Authenticate a user for API use
//////////////////////////////////////////////////////////////////////////////
exports.getToken = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
 

  var pass = req.body.pass
  console.log("the password sent is "+pass)
  if (pass != "agpbrtdk") {
      res.status (400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
      res.send ('Invalid credentials') // This goes into tData and urlResponse
      // or res.status(400).json({error: 'message'})
    
  }else{

      //if the user/password check is valid, generate and send back a token 
      //Token is set to expire in 10 hours
      var payload = {payload : "agpbrtdk"}
      var token = jwt.sign(payload, "boris", {
          expiresIn: '10h'
      });
      console.log ("Here is the token created "+token)

      // return the information including token as JSON
      res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
      });


  }

}

////////////////////////////////////////////////////////////////////////////
//  API prototype
//////////////////////////////////////////////////////////////////////////////
exports.authenticateTest = function(req, res) {
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
var token = req.body.token
var pass = req.body.pass
console.log("the token sent is "+JSON.stringify(token))
//How to send back an error???

try {
var decoded = jwt.verify(token, "boris")
} catch (err) {
console.log('here is the error '+err)
}

console.log("decoded token "+token)
console.log("decoded token "+JSON.stringify(token))

if (pass != "agpbrtdk") {
 res.status (400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
  res.send ('None shall pass') // This goes into tData and urlResponse
  //or res.status(400).json({error: 'message'})
  
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


