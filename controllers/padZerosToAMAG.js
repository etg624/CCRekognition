//###### Thu Dec 19 05:55:01 PDT 2017 New module to pad one of the credenital fields in the AMAG export
// test file with leading zeros as AMAG erroneously exports them without.  This results in a problem 
// when concatenating the two fields that make the total card number, which requires any leading zeros
// in the second field.  Without them the total card number will be incorrect and too short.  
// EG. The correct card number 151234012345 would become the incorrect 15123412345 without the 
// leading zero in the second field. This module reads the export text file, pads the fields with leading
// zeros and rewrites the text file.

var csv = require('csv-parser')
var fs = require('fs')
var path = require( 'path' );




///////////////////////////////////////////////////////////////////////////////////////////////////
//  Handler for rewriting the AMAG export file with zeros padded to one of the cardnumber fields //
///////////////////////////////////////////////////////////////////////////////////////////////////
exports.padAndRewrite = function(csvFileName, callback) {

var pad = "000000";
var n = '5';
var result = (pad+n).slice(-pad.length);
var newFileName = ""
var _d = new Date();
var onlyPath = path.dirname(csvFileName);
var _u = _d.getTime(); 

/* fs.readFile('TestPAD.txt', {
    //fs.readFile(req.body.fileName, {
        encoding: 'utf-8'
      }, function(err, csvData) {
            if (err) {
          
                console.log("here is the error "+err)
            }else{
                console.log("here is the data "+csvData)
            }
        }); */

        function readLines(input, func) {
            var remaining = '';
          
            input.on('data', function(data) {
              remaining += data;
              var index = remaining.indexOf('\r\n');
              while (index > -1) {
                var line = remaining.substring(0, index);
                remaining = remaining.substring(index + 1);
                func(line);
                index = remaining.indexOf('\r\n');
              }
            });
          
            input.on('end', function() {
              if (remaining.length > 0) {
                func(remaining);
              }
              callback(null,newFileName)
            });
          }
          
          function func(data) {
            var array = data.toString().split(',')
            console.log('data Line: ' + data);
            console.log('ARRAY element 1: ' + array[0]);
            //Only process the line if it is not a blank line
            if (array.length > 1 ){
                
               //Only process the pad if it is not the title line
               var arrayElement1 = array[0]
              
               if (arrayElement1 != '"LastName"'){
                  
               
                    var pad = "000000";
                    var n = array[2];
                    var result2 = (pad+n).slice(-pad.length);
                    var m = array[5];
                    var result5 = (pad+m).slice(-pad.length);
                    console.log("here is the result of the PAD " +result5)

                    array[2]=result2
                    array[5]=result5
                }
                            
            /*  writeString = '"SALIZAR",'+result+','
                fs.writeFile('helloworld.txt', array, function (err) {
                    if (err) return console.log(err);
                    console.log('Hello World > helloworld.txt');
                }); */
                //fs.unlinkSync('padding.txt');
               
                var appPath = path.normalize(onlyPath+'/');                      
                newFileName = appPath+_u+"AMAGPaddedCopy.txt"     
                fs.open(newFileName, 'a', 666, function( e, id ) {
                //in some cases appends to the end of the last line rather than on a new line,
                //so write a blank line first
                //fs.appendFileSync(id, "" + "\r\n", null, 'utf8')
            
                //for (var i=0; i<array.length; i++){
                    fs.appendFileSync(id, array, null, 'utf8')
                //}
                    fs.close(id, function(){});
                });  
            }
          }
          
          var input = fs.createReadStream(csvFileName);
          readLines(input, func);           

        }
