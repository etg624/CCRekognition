var https = require('https');
var querystring = require('querystring');
 
// THIS VERSION POSTS A "VERIFY RECORDS" EVENT TO A MOBSS READER ON LENEL
// 01/21/2018 
exports.postEvent = function(token, device, result, badgeID, callback) {
  
  
  console.log("incoming parms "+token+" "+device+" "+result+" "+badgeID)
  
  // Get the PACS endpoint and credential information from the environment variables
  var pacsHost = process.env.PACS_HOST
  var pacsUser = process.env.PACS_USER
  var pacsPass = process.env.PACS_PASSWORD
  var grantAccess = false
  var grantDeny = false
  

  var description = "MOBSS Verify Record"
  if (result !="1"){
    grantAccess = false; 
    grantDeny = true;
    description = "Access Denied: "+badgeID;
  
  } else{
    grantAccess = true; 
    grantDeny = false;
    description = "Access Granted: "+badgeID;
  }
   
  var postData = JSON.stringify({
      // could be:
      // galbraith@mobss.com/LenelintegrationtoCC5
      // admin/admin
      // Sa/mobss
      type_name : "Lnl_IncomingEvent",
      property_value_map : 
      {
      },
      method_name : "SendIncomingEvent",
      in_parameter_value_map :
      {
        Description : description,
        Source : "mobssReaders",
        Device : device,
        IsAccessGrant : grantAccess,
        IsAccessDeny : grantDeny,
        
        BadgeID : badgeID
      }
  });
  console.log ("postdata "+postData)

  // request option
  var options = {
    host: pacsHost,
    port: 8080,
    method: 'POST',
    //json: true,
    path: '/api/access/onguard/openaccess/execute_method?version=1.0',
    headers: {
      //'Content-Type': 'application/json',
      //'Content-Length': postData.length,
      'Session-Token': token,
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
}