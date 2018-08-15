//######
//###### Wed Nov 1 14:12:19 PDT 2017  New module for importing tickets
//######

var mysql = require('mysql');
var fs = require('fs');
var csvParser = require('csv-parse');
var path = require('path');
var csvImport = require('../controllers/csvImport');
var crlf = require('crlf-helper');
var db = require('../models/db');
var archiver = require('archiver');

/**
================================================================================================
                                Declarations & Set-up
================================================================================================ 
*/
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' }); // TODO:can also use a global config onject in same way as credentials

var rekognition = new AWS.Rekognition();

/**
================================================================================================ 
*/

//###### Wed Jun 13 08:47:11 PDT 2018
////////////////////////////////////////////////////////////////////////////
//  Search collection for image match
//////////////////////////////////////////////////////////////////////////////
exports.searchForImageMatch = function (req, res) {


  /**
  ================================================================================================ 
  */ // This gets the filename but the reKog fails due to invalid encoding
  console.log("the IMAGE sent is " + req.file)
  console.log("the IMAGE STRING sent is " + JSON.stringify(req.file))

  //const image = JSON.stringify(req.file.filename)
  console.log("the IMAGE filename sent is " + JSON.stringify(req.file.filename))

  var hostName = req.headers.host
  console.log("the host sent is " + req.headers.host)
  console.log("the HEADERS sent are " + JSON.stringify(req.headers))



  /**
  ================================================================================================ 
  */

  /**
  ================================================================================================
                        read the saved file and send to recog
  ================================================================================================ 
  */
  var AWS = require('aws-sdk');
  AWS.config.update({ region: 'us-west-2' }); // TODO:can also use a global config onject in same way as credentials

  var rekognition = new AWS.Rekognition();

  /**
  ================================================================================================ 
  */

  // var params = {
  //   CollectionId: "myTestImages", 
  //   FaceMatchThreshold: 80, 
  //   Image: {
  //     Bytes: new Buffer(req.file, 'binary')
  //     /* Strings will be Base-64 encoded on your behalf */

  //     //S3Object: {
  //       //Bucket: "rekog-image-bucket", 
  //       //Name: "IMG_2295.jpg"
  //     //}
  //   }, 
  //   MaxFaces: 5
  // };

  // rekognition.searchFacesByImage(params, function(err, data) {
  //   if (err) console.log(err, err.stack); // an error occurred
  //   else     console.log(JSON.stringify(data));  res.status(200) ; res.send("Match found.")     // successful response
  //   /*
  //   data = {
  //     FaceMatches: [
  //       {
  //       Face: {
  //       BoundingBox: {
  //         Height: 0.3234420120716095, 
  //         Left: 0.3233329951763153, 
  //         Top: 0.5, 
  //         Width: 0.24222199618816376
  //       }, 
  //       Confidence: 99.99829864501953, 
  //       FaceId: "38271d79-7bc2-5efb-b752-398a8d575b85", 
  //       ImageId: "d5631190-d039-54e4-b267-abd22c8647c5"
  //       }, 
  //       Similarity: 99.97036743164062
  //     }
  //     ], 
  //     SearchedFaceBoundingBox: {
  //     Height: 0.33481481671333313, 
  //     Left: 0.31888890266418457, 
  //     Top: 0.4933333396911621, 
  //     Width: 0.25
  //     }, 
  //     SearchedFaceConfidence: 99.9991226196289
  //   }
  //   */
  // });



  // const imageName = "64921ae8eae6440b365e0a45eec7eb93"
  const imageName = req.file.filename
  console.log(JSON.stringify("filename: " + imageName))


  // Read in the file, convert it to base64, store to S3
  fs.readFile(imageName, function (err, data) {
    if (err) { throw err; }

    //var base64data = new Buffer(data, 'binary').toString('base64'); // accroding to stackoverflow, dont need to convert

    var s3 = new AWS.S3();
    s3.putObject({
      Bucket: 'rekog-image-bucket',
      Key: imageName,
      //Body: base64data
      Body: data

    }, function (err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        console.log("success: " + JSON.stringify(data));

        //* This operation searches for faces in a Rekognition collection that match the largest face in an S3 bucket stored image. */
        var params = {
          CollectionId: "myTestImages",
          FaceMatchThreshold: 70,
          Image: {

            S3Object: {
              Bucket: "rekog-image-bucket",
              Name: imageName
            }
          },
          MaxFaces: 5
        };
        rekognition.searchFacesByImage(params, function (err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else
            console.log(JSON.stringify(data));
          console.log("faces length " + data.FaceMatches.length)

          if (data.FaceMatches.length == 0) {
            let json = {
              Matches: data.FaceMatches.length,
              BestMatch: "None",
              Similarity: '0'
            }
            res.status(200);
            res.send(json);
          } else {
            let json = {
              Matches: data.FaceMatches.length,
              BestMatch: data.FaceMatches[0].Face.ExternalImageId,
              Similarity: data.FaceMatches[0].Similarity
            }
            res.status(200);
            res.send(json);

            console.log(JSON.stringify("Match confidence Level: " + data.FaceMatches[0].Similarity))
            console.log(JSON.stringify("Matched image ID: " + data.FaceMatches[0].Face.ExternalImageId))         // successful response

          }




          // successful response
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

      }              // successful response

    });


  })





}

//###### Wed Jun 13 08:47:11 PDT 2018
////////////////////////////////////////////////////////////////////////////
//  Search collection for image match
//////////////////////////////////////////////////////////////////////////////
exports.searchForFaceMatch = function (req, res) {


  /**
  ================================================================================================ 
  */ // This gets the filename but the reKog fails due to invalid encoding
  //console.log("the IMAGE sent is "+req.file)
  //console.log("the IMAGE STRING sent is "+JSON.stringify(req.file))

  //const image = JSON.stringify(req.file.filename)
  //console.log("the IMAGE filename sent is "+req.body.image)
  var imageString = req.body.image
  console.log("The length of the image string: " + imageString.length)



  //** */
  // This code works converting base64 (incoming) to 'binary and then setting the buffer type of binary in the rekog call
  // let buff = new Buffer(imageString, 'base64');  
  // let text = buff.toString('binary');
  //** */

  //var hostName = req.headers.host
  //console.log("the host sent is "+req.headers.host)
  console.log("the HEADERS sent are " + JSON.stringify(req.headers))
  //console.log("the BODY sent is "+JSON.stringify(req.body))



  //** */
  // This coode works for writing the incoming image to file
  // buffer = new Buffer(imageString, 'base64');
  //         console.log(imageString.length, buffer.length);
  //         fs.writeFileSync('imageM8.png', buffer, 0, buffer.length);
  //** */


  /**
  ================================================================================================ 
  */

  /**
  ================================================================================================
                        read the saved file and send to recog
  ================================================================================================ 
  */
  var AWS = require('aws-sdk');
  AWS.config.update({ region: 'us-west-2' }); // TODO:can also use a global config onject in same way as credentials

  var rekognition = new AWS.Rekognition();

  /**
  ================================================================================================ 
  */
  // Read in the file, convert it to base64, store to S3
  // var imageOnDisk = "imageM7.png"
  // fs.readFile(imageOnDisk, function (err, data) {
  //   if (err) { throw err; }

  //   //var base64data = new Buffer(data, 'binary').toString('base64'); // accroding to stackoverflow, dont need to convert

  //   var s3 = new AWS.S3();
  //   s3.putObject({
  //     Bucket: 'rekog-image-bucket',
  //     Key: imageOnDisk,
  //     //Body: base64data
  //     Body: data

  //   },  function(err, data) {
  //     if (err) {console.log(err, err.stack); // an error occurred
  //     }else{
  //       console.log("success: "+ JSON.stringify(data)); 

  //* This operation searches for faces in a Rekognition collection that match the largest face in an S3 bucket stored image. */
  var params = {
    CollectionId: "myTestImages",
    FaceMatchThreshold: 70,
    Image: {
      Bytes: new Buffer(imageString, 'base64')

      // S3Object: {
      //   Bucket: "rekog-image-bucket", 
      //   Name: imageOnDisk
      // }
    },
    MaxFaces: 5
  };
  rekognition.searchFacesByImage(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else
      console.log(JSON.stringify(data));
    console.log("faces length " + data.FaceMatches.length)

    if (data.FaceMatches.length == 0) {
      let json = {
        Matches: data.FaceMatches.length,
        BestMatch: "None",
        Similarity: '0'
      }
      res.status(200);
      res.send(json);
    } else {
      let json = {
        Matches: data.FaceMatches.length,
        BestMatch: data.FaceMatches[0].Face.ExternalImageId,
        Similarity: data.FaceMatches[0].Similarity
      }
      res.status(200);
      res.send(json);

      console.log(JSON.stringify("Match confidence Level: " + data.FaceMatches[0].Similarity))
      console.log(JSON.stringify("Matched image ID: " + data.FaceMatches[0].Face.ExternalImageId))         // successful response

    }

  });






  // var params = {
  //   CollectionId: "myTestImages", 
  //   FaceMatchThreshold: 80, 
  //   Image: {
  //     Bytes: new Buffer(req.file, 'binary')
  //     /* Strings will be Base-64 encoded on your behalf */

  //     //S3Object: {
  //       //Bucket: "rekog-image-bucket", 
  //       //Name: "IMG_2295.jpg"
  //     //}
  //   }, 
  //   MaxFaces: 5
  // };

  // rekognition.searchFacesByImage(params, function(err, data) {
  //   if (err) console.log(err, err.stack); // an error occurred
  //   else     console.log(JSON.stringify(data));  res.status(200) ; res.send("Match found.")     // successful response
  //   /*
  //   data = {
  //     FaceMatches: [
  //       {
  //       Face: {
  //       BoundingBox: {
  //         Height: 0.3234420120716095, 
  //         Left: 0.3233329951763153, 
  //         Top: 0.5, 
  //         Width: 0.24222199618816376
  //       }, 
  //       Confidence: 99.99829864501953, 
  //       FaceId: "38271d79-7bc2-5efb-b752-398a8d575b85", 
  //       ImageId: "d5631190-d039-54e4-b267-abd22c8647c5"
  //       }, 
  //       Similarity: 99.97036743164062
  //     }
  //     ], 
  //     SearchedFaceBoundingBox: {
  //     Height: 0.33481481671333313, 
  //     Left: 0.31888890266418457, 
  //     Top: 0.4933333396911621, 
  //     Width: 0.25
  //     }, 
  //     SearchedFaceConfidence: 99.9991226196289
  //   }
  //   */
  // });


  //* This operation searches for faces in a Rekognition collection that match the largest face in an S3 bucket stored image. */
  // var params = {
  //   CollectionId: "myTestImages", 
  //   FaceMatchThreshold: 70, 
  //   Image: {
  //     Bytes: new Buffer("'"+imageString+"'")


  //   }, 
  //   MaxFaces: 5
  // };
  // rekognition.searchFacesByImage(params, function(err, data) {
  //   if (err){ console.log(err, err.stack);// an error occurred
  //   }else {    
  //     console.log(JSON.stringify(data));  
  //     console.log("faces length " + data.FaceMatches.length)

  //     if (data.FaceMatches.length == 0){
  //       let json = {
  //         Matches: data.FaceMatches.length,
  //         BestMatch: "None",
  //         Similarity: '0'
  //       }
  //       res.status(200);
  //       res.send(json);
  //     }else{
  //       let json = {
  //         Matches: data.FaceMatches.length,
  //         BestMatch: data.FaceMatches[0].Face.ExternalImageId,
  //         Similarity: data.FaceMatches[0].Similarity
  //       }
  //       res.status(200);
  //       res.send(json);

  //       console.log(JSON.stringify("Match confidence Level: " + data.FaceMatches[0].Similarity))
  //       console.log(JSON.stringify("Matched image ID: " + data.FaceMatches[0].Face.ExternalImageId))         // successful response

  //     }
  //   }



  //     // successful response
  //   /*
  //   data = {
  //     FaceMatches: [
  //       {
  //       Face: {
  //       BoundingBox: {
  //         Height: 0.3234420120716095, 
  //         Left: 0.3233329951763153, 
  //         Top: 0.5, 
  //         Width: 0.24222199618816376
  //       }, 
  //       Confidence: 99.99829864501953, 
  //       FaceId: "38271d79-7bc2-5efb-b752-398a8d575b85", 
  //       ImageId: "d5631190-d039-54e4-b267-abd22c8647c5"
  //       }, 
  //       Similarity: 99.97036743164062
  //     }
  //     ], 
  //     SearchedFaceBoundingBox: {
  //     Height: 0.33481481671333313, 
  //     Left: 0.31888890266418457, 
  //     Top: 0.4933333396911621, 
  //     Width: 0.25
  //     }, 
  //     SearchedFaceConfidence: 99.9991226196289
  //   }
  //   */
  // });




}




////////////////////////////////////////////////////////////////////////////
//  API get one image
//////////////////////////////////////////////////////////////////////////////
exports.getCardholderImage = function (req, res) {
  sess = req.session;
  sess.success = null;
  sess.error = null;

  const pass = req.body.pass
  const image = req.body.imageName


  if (pass != "agpbrtdk") {
    res.status(400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
    res.send('None shall pass') // This goes into tData and urlResponse
    // or res.status(400).json({error: 'message'})

  } else {

    var rootPath = path.normalize(__dirname + '/..');
    var filePath = path.normalize(rootPath + '/public/photosforreader/');


    //TypeError: First argument must be a string or Buffer
    //res.end (results);

    //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
    //res.send (results);

    //Returns a JSON file (was able to open up in nnotepad after brower asked what i wanteed to do with it)
    res.sendFile(filePath + image);


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

exports.getZipImages = function (req, res) {
  sess = req.session;
  sess.success = null;
  sess.error = null;



  //Make sure the api call has a valid password
  console.log("here is the body " + JSON.stringify(req.body))
  console.log("here is the POST API IN^^^^^API " + JSON.stringify(req.params))
  var pass = req.body.pass
  console.log("the password sent is " + pass)
  //How to send back an error???
  if (pass != "agpbrtdk") {
    res.status(400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
    res.send('None shall pass') // This goes into tData and urlResponse
    // or res.status(400).json({error: 'message'})

  } else {


    // Using node-zip
    // zip.file('history10.jpg', fs.readFileSync(path.join(__dirname, 'history10.jpg')));
    // var data = zip.generate({ base64:false, compression: 'DEFLATE' });
    // fs.writeFileSync('history10.zip', data, 'binary');
    //  End node-zip

    // Using archiver
    var rootPath = path.normalize(__dirname + '/..');
    var filePath = path.normalize(rootPath + '/public/photosforreader/');

    var output = fs.createWriteStream('./bigDir.zip');
    var archive = archiver('zip', {
      gzip: true,
      zlib: { level: 9 } // Sets the compression level.
    });

    archive.on('error', function (err) {
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
    res.sendFile(rootPath + '/example1.zip');  // Dont think we need this TODO



  }

}



