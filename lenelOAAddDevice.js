var https = require('https');
var querystring = require('querystring');
 
// THIS VERSION WORKS TO ADD A LOGICAL DEVICE
// 01/21/2018

  
 
var postData = JSON.stringify({
    
    type_name : "lnl_LogicalDevice",
    property_value_map : 
    {Name : "DXSCR45tjj67WeRT45vGh7",
    SourceID: "3"}
});
console.log ("postdata "+postData)

// request option
var options = {
  host: 'localhost',
  port: 8080,
  method: 'POST',
  //json: true,
  path: '/api/access/onguard/openaccess/instances?version=1.0',
  headers: {
    //'Content-Type': 'application/json',
    //'Content-Length': postData.length,
    'Session-Token': 'fdea56d0-e0c7-4248-af13-552732515b32',
    'Application-Id': 'OPEN_ACCESS_NON_PRODUCTION'   
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
    console.log("or just end" + result);
    console.log("result code " + res.statusCode);
    var parsedData = JSON.parse(result)
    console.log( "here is the JSON Parsed data : "+JSON.stringify(parsedData) )
    
    //callback (null,token)

  });
  res.on('error', function (err) {
    console.log("is this what im getting" + err);
  })
});
 
// req error
req.on('error', function (err) {
  console.log("or this "+err);
  callback(err,null)
});
 
//send request witht the postData form
req.write(postData);
req.end();

