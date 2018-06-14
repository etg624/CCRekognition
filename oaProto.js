const https = require("https");


'use strict';


//module.exports.relayPeople = function(moduleCallback){
  
  var data = JSON.stringify(
    {
        "user_name" : "agalbraith@mobss.com",
        "password" : "LenelintegrationtoCC5",
        "directory_id" : "id-1"
    }
  );
    
  var
  // Change 'localhost' to the fully qualified domain name where the OpenAccess service is hosted
  API_URL = 'localhost:8080/api/access/onguard/openaccess',
  API_VERSION = 'version=1.0'

  APPLICATION_ID = 'OPEN_ACCESS_NON_PRODUCTION', // OnGuard license feature name

  DEFAULT_PAGE_SIZE = 10; // Default number of items (e.g. cardholders) to show at once
  
  var url = API_URL + '/authentication?' + API_VERSION


  var options = {
    //host: 'localhost'
    host: 'localhost'
  , method: 'POST'
  ,json: true
  ,port: 8080
  ,path: '/api/access/onguard/openaccess/authentication?version=1.0'
  ,headers: {
      //'Content-Type': 'application/json',
      //'Content-Length': data.length
      'Application-Id': APPLICATION_ID

  }

  , rejectUnauthorized: false
  };

  options.agent = new https.Agent(options);


  var callback = function(response) {
    console.log(response.statusCode)
    
      var str = '';
      console.log("header : " + request.headers["Content-Type"]);
      console.log("body : " + request.data);
      console.log("url : " + request.url);
      
      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function(chunk) {
      str += chunk;
      });
      
      //the whole response has been recieved, so we just print it out here
      response.on('end', function() {
        
        //Don't do anyting if the results are an empty set
        console.log(response.statusCode)
        console.log("header : " + request.headers["Content-Type"]);
        console.log("body : " + request.data);
        console.log("url : " + request.url);
        
        var strJ = JSON.parse(str)
        console.log(strJ)
        

      });
      response.on('error', function() {
        
        //Don't do anyting if the results are an empty set
        console.log(response)
        console.log("header : " + request.headers["Content-Type"]);
        console.log("body : " + request.data);
        console.log("url : " + request.url);
        
        var strJ = JSON.parse(str)
        console.log(strJ)
        

      });
    };

    console.log("???????")
    
  https.request(options, callback).write(data);
//}
