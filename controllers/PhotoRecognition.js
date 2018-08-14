var fs = require('fs');
var path = require('path');
// var process = require( "process" ); -- I removed this as i believe it is globally availble object
var db = require('../models/db');
var archiver = require('archiver');

// ###### Tues Aug 14 11:36:14 PDT 2018 David
const { fork } = require('child_process');

//////////////////////////////////////////////////////
//handler for showing the photo recognition page         //
//////////////////////////////////////////////////////
exports.photoRecognitionHome = function (req, res) {
  var sess = req.session;
  // console.log(req);
  sess.photosSuccess = null;
  sess.photosError = null;

  // feb--don't let nameless people view the page, redirect them back to the homepage
  if (typeof sess.username == 'undefined') {
    res.redirect('/');
  } else {



    var name = req.query.name;
    var contents = {
      about: 'Use this screen to select the CSV file containing your exported PACS data.',
      contact: 'Command Center will update the MOBSS database with any changes.'
    };
    //res.render('photos');
    res.render('photoRecognition', { title: 'Command Center 5.0' + name, username: sess.username, content: contents[name] });
  }
};


///////////////////////////////////////////////////////////////////
//** handler for indexing photos into rekognition collection //
///////////////////////////////////////////////////////////////////

exports.photoRecognitionIndex = function (req, res) {
  let sess = req.session;
  let moveFrom = req.body.directorySource;

  // Loop through all the files in the source directory
  fs.readdir(moveFrom, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      sess.indexSuccess = null;
      sess.indexError = 'Directory does not exist or not accessible';
      res.render('photoRecognition', { title: 'Command Center 360', username: sess.username, success: sess.indexSuccess, error: sess.indexError });
      //process.exit( 1 );
    } else {

      const fork = require('child_process').fork;
      const program = path.resolve('RekogPhotos.js');
      const parameters = [];
      const options = {
        // stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
      };
      const child = fork(program, parameters, options);

      child.on('message', message => {
        console.log('message from child:', message);
        child.send({files: files, moveFrom: moveFrom});
      });



      //feb--finished looping through the directory, so process successful response
      sess.indexSuccess = 'Photos indexed successfully';
      sess.indexError = null;
      res.render('photoRecognition', { title: 'Command Center 360', username: sess.username, success: sess.indexSuccess });
    }
  });
};

///////////////////////////////////////////////////////////////////////////
//** handler for searching for matching photos in rekognition collection //
///////////////////////////////////////////////////////////////////////////

exports.photoRecognitionSearch = function (req, res) {

};

exports.photosIngest = function (req, res) {


  console.log('am i getting into the ingest handler');
  sess = req.session;
  // Going to need this to be a user input or a parameter.  User selected from and to but with To showing a default to the
  var moveFrom = req.body.directorySource;

  var moveTo = "./public/photosforreader";

  // Loop through all the files in the source directory
  fs.readdir(moveFrom, function (err, files) {
    if (err) {
      console.error("Could not list the directory.", err);
      sess.photosSuccess = null;
      sess.photosError = 'Directory does not exist or not accessible';
      res.render('photos', { title: 'Command Center 360', username: sess.username, success: sess.photosSuccess, error: sess.photosError });
      //process.exit( 1 );
    } else {

      const fork = require('child_process').fork;
      const program = path.resolve('ProcessImages.js');
      const parameters = [];
      const options = {
        // stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
      };
      const child = fork(program, parameters, options);

      child.on('message', message => {
        console.log('message from child:', message);
        child.send({files: files, moveFrom: moveFrom});
      });



      //feb--finished looping through the directory, so process successful response
      sess.photosSuccess = 'Photos processed successfully';
      sess.photosError = null;
      res.render('photos', { title: 'Command Center 360', username: sess.username, success: sess.photosSuccess });
    }
  });

}; //feb--end of export.photosIngest

/**
 ================================================================================================
                                        Common functions
  ================================================================================================ 
  */

function createLogEntry(param) {
  fs.open('./public/reports/eventEndMonitor.log', 'a', 666, function (e, id) {
    fs.appendFileSync(id, param + "\r\n", null, 'utf8');
    fs.close(id, function () { });
    return;
  });
};


function setUpSessionVarables(req) {
  sess = req.session;
  sess.photoCheckError = null;
  sess.photoCheckError1 = null;
  sess.empSearch = req.body.empIDSearch;
  return;
};


function setUpErrorsForDisplay() {
  sess.photosSuccess = null;
  sess.photosError = 'Directory does not exist or not accessible';
  return;
};

function setUpSuccessMessageForDisplay() {
  sess.photosSuccess = 'Photos processed successfully';
  sess.photosError = null;
  return;
};


function getTheFMaxPhotosForDisplay(callback) {
  console.log("getting into getMax");

  var photoArrayForDisplay = [];
  var nameAndPathOfThePhotoFile = "";
  var photosReadAndAddedToDisplayArray = 0;
  var numberOfPhotosInSourceDirectory = 0;
  var numberOfPhotosToReturnInDisplayArray = 0;


  const photoSourceDirectory = "./public/photosforreader";
  const theMaxNumberOfPhotosToDisplay = 100;

  fs.readdir(photoSourceDirectory, function (err, photoFiles) {

    if (err) { callback(err, null); }

    numberOfPhotosInSourceDirectory = photoFiles.length;

    if (numberOfPhotosInSourceDirectory > theMaxNumberOfPhotosToDisplay) { numberOfPhotosToReturnInDisplayArray = theMaxNumberOfPhotosToDisplay; }
    else { numberOfPhotosToReturnInDisplayArray = numberOfPhotosInSourceDirectory; }

    console.log("photofiles length" + photoFiles.length);

    for (var i = 0; i < numberOfPhotosToReturnInDisplayArray; i++) {

      nameAndPathOfThePhotoFile = '/photosforreader/' + photoFiles[i];
      photoArrayForDisplay.push(nameAndPathOfThePhotoFile);

    }

    callback(null, photoArrayForDisplay);





    // photoFiles.forEach( function( file, index ) {

    //   photosReadAndAddedToDisplayArray++
    //   nameAndPathOfThePhotoFile = '/photosforreader/'+file;
    //   photoArrayForDisplay.push(nameAndPathOfThePhotoFile)

    //   if (photosReadAndAddedToDisplayArray == theMaxNumberOfPhotosToDisplay || photosReadAndAddedToDisplayArray == numberOfPhotosInSourceDirectory){
    //     console.log ("getting into finish")
    //     console.log (photoArrayForDisplay)



    //     callback (null, photoArrayForDisplay) }

    // } );

  });
}

/**
 ================================================================================================ 
*/

exports.photoCheck = function (req, res) {

  const callerOfThisRouteIsNotRecognized = 'undefined';

  setUpSessionVarables(req);

  console.log("back from session variable");
  console.log("session variable" + sess.username);



  // don't let nameless people view the page, redirect them back to the homepage
  if (typeof sess.username == callerOfThisRouteIsNotRecognized) {
    res.redirect('/');
  } else {

    getTheFMaxPhotosForDisplay(function (err, photoArrayForDisplay) {
      console.log("getting back from getMax");


      if (err) {

        setUpErrorsForDisplay();
        res.render('photos', { title: 'Command Center 360', username: sess.username, success: sess.photosSuccess, error: sess.photosError });

      } else {

        var imageLast = "";  //TODO  what is this?
        setUpSuccessMessageForDisplay();
        res.render('photoCheck', { title: 'Command Center', images: photoArrayForDisplay, imageLast: imageLast });
      }

    });
  }
};


exports.photoCheckOLD = function (req, res) {
  sess = req.session;
  sess.photoCheckError = null;
  sess.photoCheckError1 = null;


  // don't let nameless people view the page, redirect them back to the homepage
  if (typeof sess.username == 'undefined') {
    res.redirect('/');
  } else {

    sess.empSearch = req.body.empIDSearch;

    if (typeof sess.empSearch == 'undefined') {

      if (sess.empSearch == undefined)

        /**
         * Get ALL the photos from public/photosforreader/ and put them into an array
         */
        var imageLast = "";
      var imageFile = "";

      var images = [];
      var photoDir = "./public/photosforreader";

      // Loop through all the files in the source directory
      fs.readdir(photoDir, function (err, files) {
        if (err) {
          sess.photosSuccess = null;
          sess.photosError = 'Directory does not exist or not accessible';
          res.render('photos', { title: 'Command Center 360', username: sess.username, success: sess.photosSuccess, error: sess.photosError });
        } else {

          files.forEach(function (file, index) {
            imageFile = '/photosforreader/' + file;

            images.push(imageFile);

          });

          //feb--finished looping through the directory, so process successful response
          sess.photosSuccess = 'Photos processed successfully';
          sess.photosError = null;
          res.render('photoCheck', { title: 'Command Center', images: images, imageLast: imageLast });
        }
      }); //End of the directory address read

    }; //feb--end of if/else test for nameless
  };
};


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Function for creating the zip file
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
function zipPhotos(callback) {
  console.log('YEP WORKS');

  // Using archiver
  var rootPath = path.normalize(__dirname + '/..');
  var filePath = path.normalize(rootPath + '/public/photosforreader/');

  var output = fs.createWriteStream('./public/photosForDownload.zip');
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
  console.log('here is the filePath ' + filePath);

  archive.directory(filePath, false);
  //
  archive.finalize();
  // End archiver
}




