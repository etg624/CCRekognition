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
//  SAMPLE CLIENT FOR CONTACTING THE MOBSS API                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////



var https = require('https');
 
// THIS VERSION SUCCESSFULLY USES A VAALID TOKEN IN IT'S ARGUMENTS 
// [OBTAINED BY RUNNING THE apiClientAuthenticationSample.js SCRIPT]
// AND RETRIEVES CARDHOLDERS [ALL, FOR A BADGE, FOR AN EMPID]

var token = process.argv[2]
console.log ('the argument '+ token)
 
var authReqData = JSON.stringify({
    
    pass: "agpbrtdk",
    token: token,
    lastName: "", 
    badgeNumber: "", 
    empID: "" 
})

// request option
var options = {
  host: 'localhost',
  method: 'POST',
  //json: true,
  path: '/api/getPeople',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': authReqData.length,
  },
  rejectUnauthorized: false
};
 
// request object
var req = https.request(options, function (res) {
  var result = '';
  res.on('data', function (chunk) {
    result += chunk;
  });
  res.on('end', function () {
    if (res.statusCode == 200){
        var parsedResult = JSON.parse(result)
        console.log("result code " + res.statusCode);
        console.log("Here is the full result " + JSON.stringify(parsedResult));
    }else{
        console.log("Status code " + res.statusCode+ ": "+ result);
    }
    // write the file out to

  });
  res.on('error', function (err) {
    console.log("is this what im getting" + err);
  })
});
 
// req error
req.on('error', function (err) {
  console.log("or this "+err);
});
 
//send request witht the postData form
req.write(authReqData);
req.end();

















        // function readLines(input, func) {
        //     var remaining = '';
          
        //     input.on('data', function(data) {
        //       remaining += data;
        //       var index = remaining.indexOf('\r\n');
        //       while (index > -1) {
        //         var line = remaining.substring(0, index);
        //         remaining = remaining.substring(index + 1);
        //         func(line);
        //         index = remaining.indexOf('\r\n');
        //       }
        //     });
          
        //     input.on('end', function() {
        //       if (remaining.length > 0) {
        //         func(remaining);
        //       }
        //       callback(null,newFileName)
        //     });
        //   }
          
        //   function func(data) {
        //     var array = data.toString().split(',')
        //     console.log('data Line: ' + data);
        //     console.log('ARRAY element 1: ' + array[0]);
        //     //Only process the line if it is not a blank line
        //     if (array.length > 1 ){
                
        //        //Only process the pad if it is not the title line
        //        var arrayElement1 = array[0]
              
        //        if (arrayElement1 != '"LastName"'){
                  
               
        //             var pad = "000000";
        //             var n = array[2];
        //             var result2 = (pad+n).slice(-pad.length);
        //             var m = array[5];
        //             var result5 = (pad+m).slice(-pad.length);
        //             console.log("here is the result of the PAD " +result5)

        //             array[2]=result2
        //             array[5]=result5
        //         }
                            
        //     /*  writeString = '"SALIZAR",'+result+','
        //         fs.writeFile('helloworld.txt', array, function (err) {
        //             if (err) return console.log(err);
        //             console.log('Hello World > helloworld.txt');
        //         }); */
        //         //fs.unlinkSync('padding.txt');
               
        //         var appPath = path.normalize(onlyPath+'/');                      
        //         newFileName = appPath+_u+"AMAGPaddedCopy.txt"     
        //         fs.open(newFileName, 'a', 666, function( e, id ) {
        //         //in some cases appends to the end of the last line rather than on a new line,
        //         //so write a blank line first
        //         //fs.appendFileSync(id, "" + "\r\n", null, 'utf8')
            
        //         //for (var i=0; i<array.length; i++){
        //             fs.appendFileSync(id, array, null, 'utf8')
        //         //}
        //             fs.close(id, function(){});
        //         });  
        //     }
        //   }
          
        //   var input = fs.createReadStream(csvFileName);
        //   readLines(input, func);           

        
