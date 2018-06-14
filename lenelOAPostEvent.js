var https = require('https');
var querystring = require('querystring');
 
// THIS VERSION POSTS A "VERIFY RECORDS" EVENT TO A MOBSS READER ON LENEL
// 01/21/2018 

 
var postData = JSON.stringify({
    
    type_name : "Lnl_IncomingEvent",
    property_value_map : 
    {
    },
    method_name : "SendIncomingEvent",
    in_parameter_value_map :
    {
      Description : "MOBSS Verify Record",
      Source : "mobssReader01",
      Device : "DXSCR45tjj67WeRT45vGh",
      IsAccessGrant : true,
      BadgeID : 12345
    }
});
console.log ("postdata "+postData)

// request option
var options = {
  host: 'localhost',
  port: 8080,
  method: 'POST',
  //json: true,
  path: '/api/access/onguard/openaccess/execute_method?version=1.0',
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
req.write(postData);
req.end();