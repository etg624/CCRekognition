//var fs = require('fs');
var fs = require('graceful-fs');


// fs.rename('./photoGen/Afghanistan.png', '/path/to/AF.png', function(err) {
//     if ( err ) console.log('ERROR: ' + err);
// });

// Prescursor + a number that increments allows for unique name
var photoName = 1
var photoNamePrecursor = 'z'

for (var i=1 ; i <81000; i++){ 
    photoName++

fs.createReadStream('./public/photosforreader/46000.jpg').pipe(fs.createWriteStream('./public/photosforreader/'+photoNamePrecursor+photoName+'.jpg'));
}


