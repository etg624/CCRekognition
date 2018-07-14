var fs  = require('graceful-fs'); // using this to avoid EMFILE Too many files error
var path = require( 'path' );
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
    }
}


createDirectoriesForChunks("./public/phototest")