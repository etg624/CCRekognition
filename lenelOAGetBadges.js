var https = require('https');
 
// THIS VERSION DOES A SUCCESSFUL GET AND EXTRACTS THE BADAGE DATA FROM THE RESPONSE
/* here is the JSON Parsed data : {"count":2,"item_list":[{"property_value_map":{"ACTIVATE":"2015-07-08T00:00:00-07:00","APBEXEMPT":false,"BADGEKEY":1,"DEACTIVATE":"2020-07-08T00:00:00-07:00","DEAD
BOLT_OVERRIDE":null,"DEST_EXEMPT":false,"EMBOSSED":0,"EXTEND_STRIKE_HELD":false,"ID":1,"ISSUECODE":0,"LASTCHANGED":null,"LASTPRINT":null,"PASSAGE_MODE":false,"PERSONID":1,"PIN":null,"PRINTS":0,"
STATUS":1,"TYPE":1,"USELIMIT":0}},{"property_value_map":{"ACTIVATE":"2017-12-06T00:00:00-08:00","APBEXEMPT":false,"BADGEKEY":2,"DEACTIVATE":"2022-12-06T00:00:00-08:00","DEADBOLT_OVERRIDE":false,
"DEST_EXEMPT":false,"EMBOSSED":null,"EXTEND_STRIKE_HELD":false,"ID":12345,"ISSUECODE":0,"LASTCHANGED":"2017-12-06T08:59:08-08:00","LASTPRINT":null,"PASSAGE_MODE":false,"PERSONID":2,"PIN":null,"P
RINTS":0,"STATUS":1,"TYPE":1,"USELIMIT":null}}],"page_number":1,"page_size":20,"total_items":2,"total_pages":1,"type_name":"lnl_badge","version":"1.0"}
*/

exports.getBadges = function(token, callback) {
    


function getCall() {
    //initialize options values, the value of the method can be changed to POST to make https post calls
//AS OF JAN 15 -- FOLLOWING GETS A PARTICULAR BADGE, LEAVINS OUTTHE FILTER GETS ALL BADGES
//SEEMS LIKE HAVE TO MAKE A JOIN OF IN ORDER TO FILL THE BADGE NUMBER FIELDS OF THE CARDHOLDER REQUEST, WHICH
//DOESNT BRING BACK BADGE NUMBERS (EITH THROUGH THE /CARDHOLDERS OR THE INSTANCE CALL FOR LNL_CARDHOLDERS)
    
    var options = {
        host :  'localhost',
        port : 8080,
        //path : '/api/access/onguard/openaccess/instances?type_name=lnl_badge&filter=ID=12345&version=1.0',
        path : '/api/access/onguard/openaccess/instances?type_name=lnl_badge&version=1.0',

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
                count = parsedData.count
                array = []
                console.log( "here is the JSON Parsed data : "+JSON.stringify(parsedData) );
                console.log("here is the count : "+parsedData.count)

                console.log("here is a Badge Number : "+parsedData.item_list[1].property_value_map.ID)
                for (var i=0; i < count; i++) {
                    badgeKey=parsedData.item_list[i].property_value_map.BADGEKEY
                    badgeID=parsedData.item_list[i].property_value_map.ID
                    activate=parsedData.item_list[i].property_value_map.ACTIVATE
                    deactivate=parsedData.item_list[i].property_value_map.DEACTIVATE
                    personID=parsedData.item_list[i].property_value_map.PERSONID
                    status=parsedData.item_list[i].property_value_map.STATUS
                    
                    array.push({BadgeKey : badgeKey, BadgeID: badgeID, Activate: activate, Deactivate : deactivate, PersonID : personID, Status : status}); 
                    console.log("here is the array "+JSON.stringify(array))
                    console.log("here is the array length "+JSON.stringify(array.length))
                    console.log("here is an addressable array field "+array[i].BadgeID)
                    

                }
                callback(null,array)





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