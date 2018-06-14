
/////////////////////////////////////////////////////////////////////////////////////
// Junction controller for the relay sweep.  this will call controllers for the
// people, empbadge and accesslevels tables.                                             
/////////////////////////////////////////////////////////////////////////////////////

module.exports.relayJunction = function(callback){
	

var sweepRelayPeople = require('./relayPeople');
var sweepRelayEmpBadge = require('./relayEmpBadge');
var sweepRelayAccessLevels = require('./relayAccessLevels');

//


sweepRelayPeople.relayPeople (function(err,reslt){
    if (err) {
        callback(err, null)
    }else{
        sweepRelayEmpBadge.relayEmpBadge (function(err,reslt){
            if (err) {
                callback(err, null)
            }else{
                sweepRelayAccessLevels.relayAccessLevels (function(err,reslt){
                    if (err) {
                        callback(err, null)
                    }else{
                        callback(null, "success")
                        console.log('RELAY sweep successful')
                    }
                })   
            }
        })   
    }   
});


}