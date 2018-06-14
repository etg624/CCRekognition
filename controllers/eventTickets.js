
//######
//###### Wed Nov 1 14:12:19 PDT 2017  New module for importing tickets
//######

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var csvImport = require('./csvImport');
var crlf = require('crlf-helper');
var db = require('../models/db');


/////////////////////////////////////////////////////////////////////////////
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
        //res.end([JSON.stringify(results)] [, encoding])

        //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
        //res.send (results);
        
        //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
        res.json (results);
        
      });
    } 
  });

}



//////////////////////////////////////////////////////////////////////////////
//  Handler for showing csv ingest page for tickets                         //  
//////////////////////////////////////////////////////////////////////////////
exports.csvTicketHome = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  
  
  // feb-- don't let nameless people view the page.  redirect them to home page.
   if (typeof sess.username == 'undefined') {
      res.redirect('/');
    }else{

         var name = req.query.name;
         var contents = {
         about: 'Use this screen to select the CSV file containing your tickets data.',
         contact: 'Command Center will update the MOBSS database with any changes.'
         };
    res.render('ticketImport', { title: 'Command Center' + name, username: sess.username,content:contents[name] });
    };
};

//////////////////////////////////////////////////////////////////////////////
//  Handler for processing csv tickets file through INFILE ONLY 
//////////////////////////////////////////////////////////////////////////////
exports.csvTicketIngest = function(req, res) {
  sess = req.session;
  sess.error = null;
  sess.success=null;
  sess.multiError=null;
  
  /**
   * Ensure a filename is entered, either through the browse button, or manually.
   * Maual option was added for the beta customer who appeared to be getting 
   * an odd network type path back from the browse input
   */

   // make sure at least one of the two is entered
   if (req.body.fileName == '' && req.body.fileNameEntered == '') {
      sess.error = 'Either browse for OR enter a file name';
      res.render('ticketImport', { title: 'Command Center', username: sess.username, success: sess.success});
      return;
    }else{

      // use the manual entry if no browse input
      if (req.body.fileName ==undefined || req.body.fileName =='' ){
        console.log("ENTERED "+JSON.stringify(req.body.fileNameEntered))
        csvFileName = req.body.fileNameEntered;
      }else{
        csvFileName = req.body.fileName;
      }
  } 

  /**
   * Use the directory path, if entered
   *             
   */
  if (req.body.directorySource == undefined ) {
    csvFileName = csvFileName;

  } else{
    var csvFileName = req.body.directorySource + csvFileName;

  }


  // Ensure file extension is valid.  Catches user entry of valid directory and file name but invalid file extension
  var fileExtension = path.extname(csvFileName)

  // check for valid file extentoin
  if (fileExtension != '.csv' && fileExtension != '.CSV'){
    sess.error = 'Invalid file type -- "'+csvFileName+'" -- Import files should be .csv';
    res.render('ticketImport', { title: 'Command Center', username: sess.username, success: sess.success });
    }
          
	//First check that this is a valid directory and filename
  //added this line to see what stats can be attained ftom the fs module
  fs.stat(csvFileName, function(error, stats) { console.log(stats); });
  fs.readFile(csvFileName, {
  //fs.readFile(req.body.fileName, {
      encoding: 'utf-8'
    }, function(err, csvData) {
          if (err) {
          sess.error = 'File not found -- "'+csvFileName+'" -- Please check directory and file name.';
          res.render('ticketImport', { title: 'Command Center', username: sess.username, success: sess.success });
          } else {

            //###### Mon Oct 2 05:55:01 PDT 2017
            //PB 2017.09.28 detect line endings and adjust infile syntax accordingly
            // Need to change this read to just get the first line of the file if possible
            var text = fs.readFileSync(csvFileName,'utf8')

            var lineEnding = crlf.getLineEnding(text);
            console.log("This is the CR?LF? for this file -- "+lineEnding);
            // CRLF

            csvImport.importTickets(csvFileName, fileExtension, lineEnding, function(err, res2){ 
                if (err) {
                  console.log('Error while performing INFILE proessing: ' + err);
                  res.render('ticketImport', { title: 'Command Center', username: sess.username, success: sess.success });
                }else{
                  res.render('ticketImport', { title: 'Command Center', username: sess.username, success: sess.success });
                }
            });
                

          }

  });   

  
                
  }; //feb--end of exports.csvIngest


