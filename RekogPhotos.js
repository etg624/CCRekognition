var fs = require('fs');
var path = require('path');
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' }); // TODO:can also use a global config onject in same way as credentials
var rekognition = new AWS.Rekognition();


if (process.send) {
  process.send('child started');
}

process.on('message', message => {
  // console.log('message from parent:', message);

  var imagesIndexed = 0;
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
          DetectionAttributes: [
          ],
          ExternalImageId: file,
          Image: {
            Bytes: buffer
          }
        };

        rekognition.indexFaces(params, function (err, data) {
          if (err) console.error(err, err.stack); // an error occurred
          else {
            // successful response
            imagesIndexed++;
            console.log(JSON.stringify(data));
            if (imagesIndexed === numberOfImages) {
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
