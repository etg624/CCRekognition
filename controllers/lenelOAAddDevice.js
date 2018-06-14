var https = require('https');
var querystring = require('querystring');
var lnlPostAuth = require('./lenelOAPostAuthentication')
var lnlGetLogicalSource = require('./lenelOAGetLogicalSource')

 
// THIS VERSION WORKS TO ADD A LOGICAL DEVICE
// 01/21/2018

// First get the the logical source id for mobss "mobssReaders"

 exports.addDevice = function(name, callback) {
  
  // First authenticate with Lenel and get a token
  lnlPostAuth.getToken(function(err, result){ 
    if (err) {
      console.log('Error while performing GET Token' + err);
    }else {
      var token = result
      //Get the logical Source for MOBSS from Lenel
      lnlGetLogicalSource.getLogicalSource(token, function(err, result){ 
        if (err) {
          console.log('Error while performing GET Token' + err);
        }else {
          // After sucessful retrieval of the logicl source for the mobss readers, 
          // add device to the lenel logical sources tree
          var source = result
          // Get the PACS endpoint and credential information from the environment variables
          var pacsHost = process.env.PACS_HOST
          var pacsUser = process.env.PACS_USER
          var pacsPass = process.env.PACS_PASSWORD

          var postData = JSON.stringify({
              
              type_name : "lnl_LogicalDevice",
              property_value_map : 
              {Name : name,
              SourceID: source}
          });
          console.log ("postdata "+postData)

          // request option
          var options = {
            host: pacsHost,
            port: 8080,
            method: 'POST',
            //json: true,
            path: '/api/access/onguard/openaccess/instances?version=1.0',
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
              console.log("Result code for Device Add: " + res.statusCode);
              if (res.statusCode != "200"){
                var parsedData = JSON.parse(result)
                var errMsg = JSON.stringify(parsedData.error.message)
                console.log( "Device was not activated in Lenel   : "+errMsg)
              }else{
                console.log( "New device was activated in Lenel")
              }
              
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
        }
      })    
    }
  })
}

