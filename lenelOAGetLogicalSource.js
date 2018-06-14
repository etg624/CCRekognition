var https = require('https');
 
// THIS VERSION DOES A SUCCESSFUL GET AND EXTRACTS THE LOGICAL SOURCE DATA
// here is the JSON Parsed data : {"count":1,"item_list":[{"property_value_map":{"ID":3,"IsDaylightSaving":true,"IsOnline
// ":true,"Name":"mobssReader01","WorldTimezoneID":40}}],"page_number":1,"page_size":20,"total_items":1,"total_pages":1,"
// type_name":"lnl_LogicalSource","version":"1.0"}




function getCall() {
    //initialize options values, the value of the method can be changed to POST to make https post calls
//AS OF JAN 15 -- FOLLOWING GETS A PARTICULAR BADGE, LEAVING OUT THE FILTER GETS ALL BADGES
//SEEMS LIKE HAVE TO MAKE A JOIN OF IN ORDER TO FILL THE BADGE NUMBER FIELDS OF THE CARDHOLDER REQUEST, WHICH
//DOESNT BRING BACK BADGE NUMBERS (EITH THROUGH THE /CARDHOLDERS OR THE INSTANCE CALL FOR LNL_CARDHOLDERS)
    
    var options = {
        host :  'localhost',
        port : 8080,
        //path : '/api/access/onguard/openaccess/instances?type_name=lnl_badge&filter=ID=12345&version=1.0',

        path : '/api/access/onguard/openaccess/instances?type_name=lnl_LogicalSource&filter=Name="mobssReaders"&version=1.0',
        method : 'GET',
        headers: {

            'Session-Token': '589e3456-ec46-4c21-a842-6a6c120bc915',
            'Application-Id': 'OPEN_ACCESS_NON_PRODUCTION'

        },
        rejectUnauthorized: false
    }
 
    //making the https get call
    var getReq = https.request(options, function(res) {
        console.log("\nstatus code: ", res.statusCode);
        res.on('data', function(data) {
                parsedData = JSON.parse(data)
                console.log( "here is the JSON Parsed data : "+JSON.stringify(parsedData) );
                var sourceID = parsedData.item_list[0].property_value_map.ID
                console.log("sourceID is " + sourceID);
        });
    });
 
    //end the request
    getReq.end();
    getReq.on('error', function(err){
        console.log("Error: ", err);
    }); 
}
 
getCall();