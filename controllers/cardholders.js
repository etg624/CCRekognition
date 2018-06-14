//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var db = require('../models/db');

// handler for processing csv file ingest submit request
exports.cardholdersHome = function(req, res) {
	sess=req.session;
    // don't let nameless people view the dashboard, redirect them back to the homepage
    if (typeof sess.username == 'undefined') res.redirect('/');
    else {

        db.createConnection(function(err,reslt){  
        if (err) {
          callback(err, null);
        }else{
          //process the i/o after successful connect.  Connection object returned in callback
          var connection = reslt;

          var _sqlQ = "SELECT * FROM people";
          connection.query(_sqlQ, function(err, results) {
              //connection.release();
            if(err) { console.log('cardholder query bad'+err); callback(true); return; }
            
            //use alternate views based on data load. Using JS datatables, HTML must load comletely before
            //the page renders
            if (results.length <5000){
            //regular Js datatables high functionality search and pagination  
            res.render('cardholders', { title: 'Command Center - Cardholders', username: req.session.username, results });
            }else{
            //plain table and browser search only  
            res.render('cardholdersLarge', { title: 'Command Center - Cardholders', username: req.session.username, results });
            }
            });
        }
        });
        //res.render('cardholders', { title: 'Command Center 360 - ' });
    }
};
