
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
var params = {
  CollectionId: "myTestImages", 
  DetectionAttributes: [
  ], 
  ExternalImageId: "Ara", 
  Image: {
   S3Object: {
    Bucket: "rekog-image-bucket", 
    Name: "Screenshot 2017-08-04 00.27.48.JPG"
   }
  }
 };


rekognition.indexFaces(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(JSON.stringify(data));           // successful response
});