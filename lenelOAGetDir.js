var https = require('https');
 
// THIS VERSION DOES A SUCCESSFUL GET AND EXTRACTS THE DIRECTORY iD FROM THE RESPONSE

function getCall() {
    //initialize options values, the value of the method can be changed to POST to make https post calls
    
    var options = {
        host :  'localhost',
        port : 8080,
        path : '/api/access/onguard/openaccess/directories?version=1.0',
        method : 'GET',
        rejectUnauthorized: false
    }
 
    //making the https get call
    var getReq = https.request(options, function(res) {
        console.log("\nstatus code: ", res.statusCode);
        res.on('data', function(data) {
                parsedData = JSON.parse(data)
                console.log( parsedData );
                console.log(parsedData.item_list[0].property_value_map.ID)
        });
    });
 
    //end the request
    getReq.end();
    getReq.on('error', function(err){
        console.log("Error: ", err);
    }); 
}
 
getCall();