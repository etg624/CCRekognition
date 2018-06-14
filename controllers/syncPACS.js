//////////////////////////////////////////////////////////////////////////////////////////////
//  Common handler for reading through a CSV file and inserting those records into the      //
//  evacuation table.                                                                       //
//  PROBABLY SHOULD CHANGE THIS TO INFILE PROCESSING                                        //
//////////////////////////////////////////////////////////////////////////////////////////////

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var datetime = require('./datetime');
var db = require('../models/db');
var csvProcess = require('./csvProcess');
var lnlOAGetPeople = require('./lenelOAGetPeople');



exports.syncPACSHome = function(req, res) {

  sess=req.session;
  var name = req.query.name;
  if (typeof sess.username == 'undefined'){
    res.render('home', { title: 'Command Center'});
    // if user is logged in already, take them straight to the dashboard list
    }else{

    res.render('PACSImport', { title: 'Command Center'});
};
};



////////////////////////////////////////////////////////
//  Sync to the PACS systmem                          //
////////////////////////////////////////////////////////
//exports.syncPACSGo = function(req, res) {
exports.syncPACSGo = function(req, res) {
        
    sess.success = null;
    sess.error = null;
    var strSQL = "";
    var query = null;


    //Call LenelOAGetPeople to pull data from Lenel and update the MOBSS
    //People, EmpBadge and AccessLevels tables
    switch (process.env.EXPORT_SOURCE)
    {
        case 'LENEL_DIRECT':
    
            lnlOAGetPeople.getPeople(function(err,reslt)
            {  
                if (err) {
                console.log('Error while performing Lenel Sync: ' + err);
                //callback("Lenel sync failed", null)
                //res.render('PACSImport', { title: 'Command Center', username: sess.username, error: sess.error });
            }else{
                //process the i/o after successful connect.  Connection object returned in callback
                //callback(null,  "Lenel sync successful")
                //res.render('PACSImport', { title: 'Command Center', username: sess.username, success: sess.success });
                }  
            })
            break;

        default:
            sess.error = "No PACS identified to Sync (see settings)"
            //res.render('PACSImport', { title: 'Command Center', username: sess.username, success: sess.success });
            //callback("No PACs identified to sync", null)
            
    }

};

