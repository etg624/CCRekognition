var fs = require('fs');
var path = require('path');
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' }); // TODO:can also use a global config onject in same way as credentials
var rekognition = new AWS.Rekognition();

/* This operation searches for faces in a Rekognition collection that match the largest face in an S3 bucket stored image. */

if (process.send) {
  process.send('child started');
}

process.on('message', message => {
  // console.log('message from parent:', message);
  var itemsProcessed = 0;
  var imagesSearched = 0;
  var numberOfImages = 0;

  message.files.forEach(function (file, index) {
    var fromPath = path.join(message.moveFrom, file);
    // var toPath = path.join(moveTo, file);

    // check if file is .png or .jpg
    if (fromPath.slice(-3) === 'png' || fromPath.slice(-3) === 'jpg') {
      numberOfImages++;

      fs.readFile(fromPath, 'base64', (err, data) => {

        // create a new base64 buffer out of the string passed to us by fs.readFile()
        const buffer = new Buffer(data, 'base64');

        var params = {
          CollectionId: "myTestImages",
          FaceMatchThreshold: 80,
          Image: {
            Bytes: buffer
          },
          MaxFaces: 5
        };

        rekognition.searchFacesByImage(params, function (err, data) {
          console.log('///////////////////////////////////////////////////////////////');
          if (err) console.log(err, err.stack); // an error occurred
          else {
            // successful response
            imagesSearched++;
            console.log(JSON.stringify(data));
            if (imagesSearched === numberOfImages) {
              callback();
            }
          }
        });
      });
    }
  });

  
  function callback() {
    console.log('done');
    // createLogEntry('done'); 
  }

  function createLogEntry(param) {
    fs.open('./public/reports/photoProcess.log', 'a', 666, function (e, fd) {
      fs.appendFileSync(fd, param + "\r\n", null, 'utf8')
      fs.close(fd, function () { });
      return;
    });
  }
});
