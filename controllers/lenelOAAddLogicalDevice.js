var https = require('https');
var lnlGetLogicalSource = require('./lenelOAGetLogicalSource')
var lnlAddDevice = require('./lenelOAAddDevice')
var lnlPostAuth = require('./lenelOAPostAuthentication')



//exports.getPeople = function(callback) {
  

var token =""
var deviceName ="DXSCR45tjj67WeRT45vGh67"


// THIS VERSION SUCCESSFULLY RETRIEVES ALL CARDHOLDERS AND BADGES INTO TWO ARRAYS THEN COMBINES
// THESE ARRAYS INTO AN ARRAY READY TO POPULATE THE MOBSS TABLES

//MAKE THE AUTHENTICATION CALL HERE AND PASS THE SESSION TOKEN TO THE CARDHOLDER AND BADGE HANDLERS
 
lnlPostAuth.getToken(function(err, result){ 
    if (err) {
    console.log('Error while performing GET Token' + err);
    }
    else {
        var token = result
        lnlGetLogicalSource.getLogicalSource(token, function(err, result){ 
            if (err) {
            console.log('Error while performing GET Logical Source' + err);
            }
            else {
                console.log("HERE IS THE RESULT "+JSON.stringify(result))
                var sourceID = result
                //Now get the badge records
                lnlAddDevice.addDevice(token, sourceID, deviceName, function(err, resultB){ 
                    if (err) {
                    console.log('Error while performing ADD DEVICE: ' + err);
                    }
                    else {
                    console.log("HERE IS THE ADD DEVICE RESULT "+JSON.stringify(resultB))
                    }
                })
            }
        })
    }
})

    

              

//}
