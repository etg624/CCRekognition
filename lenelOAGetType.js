var https = require('https');
 
// THIS VERSION DOES A SUCCESSFUL GET AND EXTRACTS THE CARDHOLDER DATA FROM THE RESPONSE
/* here is the JSON Parsed data : {"count":2,"item_list":[{"property_value_map":{"ADDR1":null,"ALLOWEDVISITORS":true,"BDATE":null,"BUI
LDING":0,"CITY":null,"DEPT":0,"DIVISION":0,"EMAIL":null,"EXT":null,"FIRSTNAME":"Lisa","FLOOR":null,"ID":1,"LASTCHANGED":"1996-12-11
T00:00:00-08:00","LASTNAME":"Lake","LOCATION":0,"MIDNAME":"A","OPHONE":null,"PHONE":null,"SSNO":"123456789","STATE":null,"TITLE":0,
"ZIP":null}},{"property_value_map":{"ADDR1":null,"ALLOWEDVISITORS":true,"BDATE":null,"BUILDING":0,"CITY":null,"DEPT":0,"DIVISION":0
,"EMAIL":null,"EXT":null,"FIRSTNAME":"Phil","FLOOR":null,"ID":2,"LASTCHANGED":"2017-12-06T09:01:35-08:00","LASTNAME":"Bligh","LOCAT
ION":0,"MIDNAME":null,"OPHONE":null,"PHONE":null,"SSNO":null,"STATE":null,"TITLE":0,"ZIP":null}}],"page_number":1,"page_size":20,"t
otal_items":2,"total_pages":1,"version":"1.0"}
here is my last 
name : Bligh */



function getCall() {
    //initialize options values, the value of the method can be changed to POST to make https post calls
    
    var options = {
        host :  'localhost',
        port : 8080,
        path : '/api/access/onguard/openaccess/type?type_name=lnl_cardholder&version=1.0',
        method : 'GET',
        headers: {

            'Session-Token': 'd6a5a8fa-8533-4af4-a435-63da8d79c6da',
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
                //console.log("here is my last name : "+parsedData.item_list[1].property_value_map.LASTNAME)
        });
    });
 
    //end the request
    getReq.end();
    getReq.on('error', function(err){
        console.log("Error: ", err);
    }); 
}
 
getCall();