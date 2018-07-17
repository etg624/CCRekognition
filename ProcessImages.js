const { fork } = require('child_process');
var fs = require('fs');
var path = require('path');
var sharp = require('sharp');

var moveTo = "./public/photosforreader";


if (process.send) {
  process.send('child started');
}

process.on('message', message => {
  // console.log('message from parent:', message);

  var itemsProcessed = 0;

  message.files.forEach(function (file, index) {
    var fromPath = path.join(message.moveFrom, file);
    var toPath = path.join(moveTo, file);

    fs.stat(fromPath, function (error, stat) {
      if (error) {
        console.error("Error stating file.", error);
        return;
      }

      if (stat.isFile()) {
        // console.log( "'%s' is a file.", fromPath );
      }

      else if (stat.isDirectory()) {
        // console.log( "'%s' is a directory.", fromPath );
      }

      // was 200, 300.  changed to smaller size 7/7/17  
      sharp(fromPath).resize(100, 150).toFile(toPath, function (err) {
        if (err) {
          console.log("One of the files is not in expected format (.jpg) " + err);
          return;
        } else {
          itemsProcessed++;
          if(itemsProcessed === message.files.length) {
            callback();
          }
        }
      });

    });
  });

  

  function callback () { createLogEntry('done'); }

  function createLogEntry ( param ) {  
    fs.open('./public/reports/photoProcess.log', 'a', 666, function( e, fd ) {
    fs.appendFileSync(fd, param + "\r\n", null, 'utf8')
    fs.close(fd, function(){});
    return
});
};

});