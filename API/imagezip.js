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
var zip = new require('node-zip')();
var archiver = require('archiver');



////////////////////////////////////////////////////////////////////////////
//  API Get Zipped images
//////////////////////////////////////////////////////////////////////////////
//The following design pattern should be 2 app-server i/o calls instead of a libURLDownloadToFile for every image!!!
//1. App sends an API request for a list of files or ALL files (using current code in App that looksrevzip
//2. at the people table and current images)
//2. For list, Loop through the list doing archive.file appends
//3. For ALL, use archive.directory
//4. App then does alibURLDownloadToFile with the zip file
//5. App unzips the file and puts pictures into local files

exports.getZipImages = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  
 

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


  // Using node-zip
  // zip.file('history10.jpg', fs.readFileSync(path.join(__dirname, 'history10.jpg')));
  // var data = zip.generate({ base64:false, compression: 'DEFLATE' });
  // fs.writeFileSync('history10.zip', data, 'binary');
  //  End node-zip

  // Using archiver
  var rootPath = path.normalize(__dirname+'/..');
  var filePath = path.normalize(rootPath+'/public/photosforreader/');
 
  var output = fs.createWriteStream('./bigDir.zip');
  var archive = archiver('zip', {
      gzip: true,
      zlib: { level: 9 } // Sets the compression level.
  });
  
  archive.on('error', function(err) {
    throw err;
  });
  
  // pipe archive data to the output file
  archive.pipe(output);
  
  // append files
  //archive.file(filePath+'/46000.jpg', {name: '46000.jpg'});
  //archive.file(filePath+'/46001.jpg', {name: '46001.jpg'});
  archive.directory(filePath, false);
  //
  archive.finalize();
  // End archiver



  //var rootPath = path.normalize(__dirname+'/..');
  //var filePath = path.normalize(rootPath+'/public/reports/');
  //var filePath = path.normalize(appPath+'/public/reports/'); -- use this type of thing to keep the image out of root TODO
  
  //var fileName = rootPath+'/history10.zip';
  //res.download(rptFullName, title+'.csv');

        
        //TypeError: First argument must be a string or Buffer
        //res.end (results);

        //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
        //res.send (results);
        
        //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
        //res.sendFile (fileName);
        res.sendFile (rootPath+'/example1.zip');  // Dont think we need this TODO
        
        
    
}

}





////////////////////////////////////////////////////////////////////////////
//  API Get Zipped images
//////////////////////////////////////////////////////////////////////////////
//The following design pattern should be 2 app-server i/o calls instead of a libURLDownloadToFile for every image!!!
//1. App sends an API request for a list of files or ALL files (using current code in App that looksrevzip
//2. at the people table and current images)
//2. For list, Loop through the list doing archive.file appends
//3. For ALL, use archive.directory
//4. App then does alibURLDownloadToFile with the zip file
//5. App unzips the file and puts pictures into local files

exports.imageRequest = function(req, res) {
  
  var data1  = req.body.data
  
  data = JSON.parse(data1)
  var pass = req.body.pass
  var device = req.body.authCode

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

  console.log('here is the image request'+JSON.stringify(data.length))
  
          


  // Using node-zip
  // zip.file('history10.jpg', fs.readFileSync(path.join(__dirname, 'history10.jpg')));
  // var data = zip.generate({ base64:false, compression: 'DEFLATE' });
  // fs.writeFileSync('history10.zip', data, 'binary');
  //  End node-zip

  // Using archiver
  var rootPath = path.normalize(__dirname+'/..');
  var filePath = path.normalize(rootPath+'/public/photosforreader/');
 
  var output = fs.createWriteStream('./exampleAppend.zip');
  var archive = archiver('zip', {
      gzip: true,
      zlib: { level: 9 } // Sets the compression level.
  });
  
  archive.on('error', function(err) {
    throw err;
  });
  archive.pipe(output);
  
  for (var j=0; j < data.length; j++) {
    console.log('here is the image counter '+j)
    
    
  var image = data[j].imageName
  // pipe archive data to the output file
  //archive.pipe(output);
  
  // append files
  archive.file(filePath+'/'+image+'.jpg', {name: image+'.jpg'});
  //archive.file(filePath+'/46001.jpg', {name: '46001.jpg'});
  //archive.directory(filePath, false);
  //
}
  archive.finalize();
  // End archiver



  //var rootPath = path.normalize(__dirname+'/..');
  //var filePath = path.normalize(rootPath+'/public/reports/');
  //var filePath = path.normalize(appPath+'/public/reports/'); -- use this type of thing to keep the image out of root TODO
  
  //var fileName = rootPath+'/history10.zip';
  //res.download(rptFullName, title+'.csv');

        
        //TypeError: First argument must be a string or Buffer
        //res.end (results);

        //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
        //res.send (results);
        
        //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
        //res.sendFile (fileName);

        //res.sendFile (rootPath+'/example1.zip');  // Dont think we need this TODO
        
        
    
}

}

