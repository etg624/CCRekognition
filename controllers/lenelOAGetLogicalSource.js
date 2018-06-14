var https = require('https');
 
// THIS VERSION DOES A SUCCESSFUL GET AND EXTRACTS THE LOGICAL SOURCE ID FOR THE MOBSS READER
// here is the JSON Parsed data : {"count":1,"item_list":[{"property_value_map":{"I
// D":5,"IsDaylightSaving":true,"IsOnline":true,"Name":"mobssReaders","WorldTimezon
// eID":40}}],"page_number":1,"page_size":20,"total_items":1,"total_pages":1,"type_
// name":"lnl_LogicalSource","version":"1.0"}
// sourceID is 5


exports.getLogicalSource = function(token, callback) {
    
function getCall() {
    
    var options = {
        host :  'localhost',
        port : 8080,
        //path : '/api/access/onguard/openaccess/instances?type_name=lnl_badge&filter=ID=12345&version=1.0',

        path : '/api/access/onguard/openaccess/instances?type_name=lnl_LogicalSource&filter=Name="mobssReaders"&version=1.0',
        method : 'GET',
        headers: {

            'Session-Token': token,
            'Application-Id': 'OPEN_ACCESS_NON_PRODUCTION'

        },
        rejectUnauthorized: false
    }
 
    //making the https get call
    var getReq = https.request(options, function(res) {
        console.log("\nstatus code: ", res.statusCode);
        res.on('data', function(data) {
                parsedData = JSON.parse(data)
                var sourceID = parsedData.item_list[0].property_value_map.ID
                console.log("sourceID is " + sourceID);
                callback (null,sourceID)
        });
    });
 
    //end the request
    getReq.end();
    getReq.on('error', function(err){
        console.log("Error: ", err);
    }); 
}
 
getCall();

}