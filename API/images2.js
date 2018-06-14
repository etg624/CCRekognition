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
var archiver = require('archiver');

/**
================================================================================================
                                Declarations & Set-up
================================================================================================ 
*/
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'}); // TODO:can also use a global config onject in same way as credentials

var rekognition = new AWS.Rekognition();

/**
================================================================================================ 
*/ 

//###### Wed Jun 13 08:47:11 PDT 2018
////////////////////////////////////////////////////////////////////////////
//  Search collection for image match
//////////////////////////////////////////////////////////////////////////////
exports.searchForImageMatch = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  
  const pass = req.body.pass  
  const image = req.body.image
 

  if (pass != "agpbrtdk") {
    res.status (400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
    res.send ('None shall pass') // This goes into tData and urlResponse
    // or res.status(400).json({error: 'message'})
    
  }else{


    /* This operation searches for faces in a Rekognition collection that match the largest face in an S3 bucket stored image. */

    var params = {
      CollectionId: "myTestImages", 
      FaceMatchThreshold: 80, 
      Image: {
        Bytes: image /* Strings will be Base-64 encoded on your behalf */,

        //S3Object: {
          //Bucket: "rekog-image-bucket", 
          //Name: "IMG_2295.jpg"
      }
      }, 
      MaxFaces: 5
    };
    rekognition.searchFacesByImage(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(JSON.stringify(data));  res.status(200)      // successful response
      /*
      data = {
        FaceMatches: [
          {
          Face: {
          BoundingBox: {
            Height: 0.3234420120716095, 
            Left: 0.3233329951763153, 
            Top: 0.5, 
            Width: 0.24222199618816376
          }, 
          Confidence: 99.99829864501953, 
          FaceId: "38271d79-7bc2-5efb-b752-398a8d575b85", 
          ImageId: "d5631190-d039-54e4-b267-abd22c8647c5"
          }, 
          Similarity: 99.97036743164062
        }
        ], 
        SearchedFaceBoundingBox: {
        Height: 0.33481481671333313, 
        Left: 0.31888890266418457, 
        Top: 0.4933333396911621, 
        Width: 0.25
        }, 
        SearchedFaceConfidence: 99.9991226196289
      }
      */
    });

  

    
  }

}

////////////////////////////////////////////////////////////////////////////
//  API get one image
//////////////////////////////////////////////////////////////////////////////
exports.getCardholderImage = function(req, res) {
  sess=req.session;
  sess.success = null;
  sess.error = null;
  
  const pass = req.body.pass  
  const image = req.body.imageName
 

if (pass != "agpbrtdk") {
  res.status (400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
  res.send ('None shall pass') // This goes into tData and urlResponse
  // or res.status(400).json({error: 'message'})
  
}else{

  var rootPath = path.normalize(__dirname+'/..');  
  var filePath = path.normalize(rootPath+'/public/photosforreader/');
  

  //TypeError: First argument must be a string or Buffer
  //res.end (results);

  //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
  //res.send (results);
  
  //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
  res.sendFile (filePath+image);
        
    
}

}


////////////////////////////////////////////////////////////////////////////
//  API Get Zipped images -- NOT USED RIGHT NOW.  IMAGES ZIPPED DURING PHOTO INGEST
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



