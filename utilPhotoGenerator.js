var fs = require('graceful-fs');


function createDirectoriesForPhotos (directoryToBeCreated) {

    if (!fs.existsSync(directoryToBeCreated)){
        console.log('Directory created before: ' + directoryToBeCreated)

        fs.mkdirSync(directoryToBeCreated);
        console.log('Directory created: ' + directoryToBeCreated)
    }
}


function createPhotos (directoryToBeCreated, numberOfPhotosToGenerate) {

    var photoName = 1
    var photoNamePrecursor = 't'
    var directoryToWriteFilesTo = directoryToBeCreated+'/'

    for (var i=0 ; i <numberOfPhotosToGenerate; i++){ 

    fs.createReadStream('./46000.jpg').pipe(fs.createWriteStream(directoryToWriteFilesTo+photoNamePrecursor+photoName+'.jpg'));
    photoName++

    }
}


var timeStamp = Date.now()
var directoryToBeCreated = "./public/photosforreader"+Date.now()
const numberOfPhotosToGenerate = parseInt(process.argv[2])
console.log('Directory created: ' + directoryToBeCreated)
console.log('Number of photos to generate: '+ numberOfPhotosToGenerate)

createDirectoriesForPhotos(directoryToBeCreated)
createPhotos(directoryToBeCreated,numberOfPhotosToGenerate)


