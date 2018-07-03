var fs  = require('fs');
var path = require( 'path' );
var archiver = require('archiver');

  // Using archiver
//var rootPath = path.normalize(__dirname);
var filePath = path.normalize(__dirname+'/photoGen/');

var output = fs.createWriteStream('./public/photosGenForDownload.zip');
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
console.log ('here is the filePath '+filePath)

archive.directory(filePath, false);
//
archive.finalize();
// End archiver


