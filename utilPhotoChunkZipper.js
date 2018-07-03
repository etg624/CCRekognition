//var fs  = require('fs');
var fs  = require('graceful-fs'); // using this to avoid EMFILE Too many files error
var path = require( 'path' );
var archiver = require('archiver');
/**
================================================================================================
                                     Objective of this module
                                     
        For large numbers of images (>25,000), zips the images in chunks of 25,000.
        Reads the photosforreader directory and calculates the number of chunks required. 
        For each chunk, creates a staging directory and zip file for App download.
================================================================================================ 
*/

/**
================================================================================================
                                        Functions
================================================================================================ 
*/
function createDirectoriesForChunks (directoryToBeCreated) {

    if (!fs.existsSync(directoryToBeCreated)){
        fs.mkdirSync(directoryToBeCreated);
        createLogEntry('Directory created: ' + directoryToBeCreated)
    }
}


function zipPhotos(directoryToBeZipped, whichChunk) {
    //  Using archiver
    //var rootPath = path.normalize(__dirname);
    var filePath = path.normalize(__dirname+directoryToBeZipped);
    createLogEntry ('Status of File Zip: the file to be zipped is '+filePath)

    
    var output = fs.createWriteStream('./public/photosForDownload'+whichChunk+'.zip');
    var archive = archiver('zip', {
        gzip: true,
        zlib: { level: 9 } // Sets the compression level.
    });
    
    archive.on('error', function(err) {
      throw err;
    });
    
    // pipe archive data to the output file
    archive.pipe(output);
    
    // To append files....
    //archive.file(filePath+'/46000.jpg', {name: '46000.jpg'});
    //archive.file(filePath+'/46001.jpg', {name: '46001.jpg'});
    
    archive.directory(filePath, false);
    //
    archive.finalize();
    // End archiver

    console.log ('Status of File Zip: the '+whichChunk+' chunk is zipped.')
    createLogEntry ('Status of File Zip: the '+whichChunk+' chunk is zipped.')

    return
    }
    

function howManyChunksRequired ( arrayOfFileNames, maxFilesPerChunk ) {  
    var numberOfChunksRequired = arrayOfFileNames.length/maxFilesPerChunk
    numberOfChunksRequired =Math.ceil(numberOfChunksRequired)
    return numberOfChunksRequired
}


function loadChunkDirectoryAndZip ( arrayOfFileNames, whichChunk, maxFilesPerChunk ) {  

    var arrayStartFileIndex = (whichChunk*maxFilesPerChunk)
    var arrayEndFileIndex = arrayStartFileIndex + maxFilesPerChunk
    var directoryToStageFilesForZipping = '/public/photoZipChunks'+whichChunk+'/'

    var filesWrittenCounter = 0
    if (arrayOfFileNames.length > (arrayEndFileIndex )){
        var numberOfFilesToWrite = maxFilesPerChunk
    } else{
        var numberOfFilesToWrite = (arrayOfFileNames.length - arrayStartFileIndex )
        arrayEndFileIndex = arrayOfFileNames.length
    }

    console.log('Status of File Zip: Chunk: '+whichChunk+' File start: '+arrayStartFileIndex+' File end: '+arrayEndFileIndex+' Files to write: '+ numberOfFilesToWrite)

    for (var i=arrayStartFileIndex ; i <arrayEndFileIndex; i++){ 

        var readStreamObject = fs.createReadStream('./public/photosforreader/'+arrayOfFileNames[i])
        //var writeStreamObject = fs.createWriteStream('./photoZipChunks1/'+arrayOfFileNames[i])
        var writeStreamObject = fs.createWriteStream('.'+directoryToStageFilesForZipping+arrayOfFileNames[i])


        //fs.createReadStream('./photoChunk/'+files[i]).pipe(fs.createWriteStream('./photoZipChunks1/'+files[i]).on('finish', function() {counter++; console.log('finito'+counter); if (counter==2){zipPhotos('/photoZipChunks1/')}}));
        readStreamObject.pipe(writeStreamObject.on('finish', function() {
            filesWrittenCounter++;
            if (filesWrittenCounter==numberOfFilesToWrite){
               // zipPhotos('/photoZipChunks1/')}
                console.log('Status of File Zip: the '+whichChunk+' chunk has been staged.'+filesWrittenCounter+' of '+numberOfFilesToWrite+' written.')

                zipPhotos(directoryToStageFilesForZipping, whichChunk)
                return
            }

        }));

    };
    //return
}


function createLogEntry ( param ) {  
    fs.open('./public/reports/photoZip.log', 'a', 666, function( e, id ) {
    fs.appendFileSync(id, param + "\r\n", null, 'utf8')
    fs.close(id, function(){});
    return
});
};


/**
================================================================================================ 
*/ 


/**
================================================================================================
                                        Function Execution
================================================================================================ 
*/
var images = [];
var photoDir = "./public/photosforreader"
var directoryToStageChunks = "./public/photoZipChunks";
var maxFilesPerChunk = 25000
//
var dateProgramInitiated = new Date()
createLogEntry(dateProgramInitiated + ' Zip processing started.')
//

// Loop through all the files in the source directory
fs.readdir( photoDir, function( err, arrayOfFileNames ) {

  if( err ) {
    console.log(err)
  }else{ 

    
    // How many zip files does the image directory need to be chunked into to avoid App memory problems
    var numberOfChunksRequired = howManyChunksRequired( arrayOfFileNames,maxFilesPerChunk )

    console.log('Status of File Zip: '+arrayOfFileNames.length+ ' files to be zipped.')
    createLogEntry('Status of File Zip: '+arrayOfFileNames.length+ ' files to be zipped.')
    console.log('Status of File Zip: '+numberOfChunksRequired+ ' chunk(s) required.')
    createLogEntry('Status of File Zip: '+numberOfChunksRequired+ ' chunk(s) required.')


    for (i=0 ; i<numberOfChunksRequired; i++){

        createDirectoriesForChunks (directoryToStageChunks+i)
        
        loadChunkDirectoryAndZip (arrayOfFileNames, i, maxFilesPerChunk)
    }

  }
})

/**
================================================================================================ 
*/ 