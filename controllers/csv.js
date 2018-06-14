//feb--lots of console.log stuff here for debugging purposes

var mysql = require('mysql');
var fs  = require('fs');
var csvParser = require('csv-parse');
var path = require( 'path' );
var accessLevels = require('../models/accessLevels');
var empBadge = require('../models/empBadge');
var people = require('../models/people');
var csvImport = require('./csvImport');
var csvImportInsert = require('./csvImportInsert');
var fileImportAMAG = require('./fileImportAMAG');
//PB 2017.09.28 detect line endings and adjust infile syntax accordingly
var crlf = require('crlf-helper');



//////////////////////////////////////////////////////////////////////////////
//  Handler for showing csv ingest page                                     //  
//////////////////////////////////////////////////////////////////////////////
exports.csvHome = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
 
  
  // feb-- don't let nameless people view the page.  redirect them to home page.
   if (typeof sess.username == 'undefined') {
      res.redirect('/');
    }else{

         var name = req.query.name;
         var contents = {
         about: 'Use this screen to select the CSV file containing your exported PACS data.',
         contact: 'Command Center will update the MOBSS database with any changes.'
         };
    res.render('csv', { title: 'Command Center - ' + name, username: sess.username,content:contents[name] });
    };
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  IMPORT JUNCTION --- Junction handler for directing the import processing based on the various export sources //  
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.csvIngest = function(req, res) {
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
      res.render('csv', { title: 'Command Center - Import Cardholders', username: sess.username, success: sess.success});
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
    console.log('csvFileName '+csvFileName)

  }


  // Ensure file extension is valid.  Catches user entry of valid directory and file name but invalid file extension
  var fileExtension = path.extname(csvFileName);
  console.log("the file extension is "+fileExtension);
  console.log("the filename BEFORE the INFILE "+csvFileName);
 
  /**
   * Check the file type/extension is correct for the export source specified
   * in the environmental variables  
   */
  switch (process.env.EXPORT_SOURCE)
           {
             case 'AMAG':
                
                 if (fileExtension != '.txt'){
                  sess.error = 'Invalid file type -- "'+csvFileName+'" -- Import files should be .txt';
                  res.render('csv', { title: 'Command Center', username: sess.username, success: sess.success });
                 }   
                 break;

              default: 
                 if (fileExtension != '.csv' && fileExtension != '.CSV'){
                      sess.error = 'Invalid file type -- "'+csvFileName+'" -- Import files should be .csv';
                      res.render('csv', { title: 'Command Center', username: sess.username, success: sess.success });
                     }
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
          res.render('csv', { title: 'Command Center', username: sess.username, success: sess.success });
          } else {
           
            //###### Mon Oct 2 05:55:01 PDT 2017
            //PB 2017.09.28 detect line endings and adjust infile syntax accordingly
            // Need to change this read to just get the first line of the file if possible
            var text = fs.readFileSync(csvFileName,'utf8')

            var lineEnding = crlf.getLineEnding(text);
            console.log("This is the CR?LF? for this file -- "+lineEnding);
            // CRLF
  
            // Call handler for clearing and creating records for the 3 files
            // passing as variable the screen inputted directory and filename for the csv
            // NOTE: res2 so that this subbordinate function can access the original http res variable
            //###### Dec 01 2017 - Support for alternate S2 formats
         switch (process.env.INFILE_DISABLED)
           {
             case 'YES':
                var count = 0;
                //Only OTHER (mobss stipulated format) and S2 can use INSERT processing
                if (process.env.EXPORT_SOURCE=="OTHER" || process.env.EXPORT_SOURCE=="S2-1"|| process.env.EXPORT_SOURCE=="S2-2"){
                  csvImportInsert.insertPeople(csvFileName, function(err, res2){ 
                   if (err) {
                    count = count +1;
                    console.log('Error while performing People INSERT proessing: ' +count+ err);                     
                    res.render('csv', { title: 'Command Center', username: sess.username, success: sess.success, error : sess.error });   
                    } else {
                    res.render('csv', { title: 'Command Center', username: sess.username, success: sess.success });
                      
                    }
                  });
                } else {
                  sess.error = 'Cannot import cardholders with INFILE disabled and source data = '+process.env.EXPORT_SOURCE; 
                  res.render('csv', { title: 'Command Center', username: sess.username, success: sess.success, error : sess.error });                   
                }
                break;

              default: 
                // INFILE is enabled but cant be used with some data sources (eg S2)
                if (process.env.EXPORT_SOURCE=="S2-1" || process.env.EXPORT_SOURCE=="S2-2"){
                    var count = 0;
                    csvImportInsert.insertPeople(csvFileName, function(err, res2){ 
                     if (err) {
                        count = count +1;
                        console.log('Error while performing People INSERT proessing: ' +count+ err);                     
                        res.render('csv', { title: 'Command Center', username: sess.username, success: sess.success, error : sess.error });                   
                        } else {                      
                        res.render('csv', { title: 'Command Center', username: sess.username, success: sess.success });
                      
                      }
                    });

                }else{
                  // this should be the most common pathway -- Infile is enabled and the data
                  // source allows for it
                  
                  //PB 2017.09.28 detect line endings and adjust infile syntax accordingly
                  //added LineEnding parameter

                  //###### Wed Dec 27 12:33:39 PST 2017 Use dedicated controller for AMAG processing
                  if (process.env.EXPORT_SOURCE=="AMAG"){

                      fileImportAMAG.inFile(csvFileName, "manual", lineEnding, function(err, res2){ 
                        if (err) {
                          sess.error ='Update was not successful.';
                          res.render('csv', { title: 'Command Center', username: sess.username, success: sess.success });                          
                        } else {
                          sess.success = 'Update was successful.';
                          res.render('csv', { title: 'Command Center', username: sess.username, success: sess.success });                          
                        }
                      });

                  }else{

                      csvImport.inFile(csvFileName, "manual", fileExtension, lineEnding, function(err, res2){ 
                          if (err) {
                            console.log('Error while performing INFILE proessing: ' + err);
                            res.render('csv', { title: 'Command Center', username: sess.username, success: sess.success });
                          }else{
                            res.render('csv', { title: 'Command Center', username: sess.username, success: sess.success });
                          }
                      });

                  } 

                }
            }

          } 



  });   

  
                
  }; //feb--end of exports.csvIngest


