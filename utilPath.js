fs = require('fs')

var path = 'C:'+'\\'+'Mobss Export'+'\\'
console.log (path)
createLogEntry (path)


function createLogEntry ( path ) {  
    fs.open('./public/reports/utilities.log', 'a', 666, function( e, id ) {
    fs.appendFileSync(id, path + "\r\n", null, 'utf8')
    fs.close(id, function(){});
    return
});
};
