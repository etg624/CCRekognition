
//######
//###### Wed Mar 2018 14:12:19 PDT 2018  New Module for API. Replaces Auth part 
//###### of mobss_scripts.lc
//######
var datetime = require('../controllers/datetime');

///////////////////////////////////////////////////////////////////////////
//  API to verify server connectivity
//////////////////////////////////////////////////////////////////////////////
exports.verifyConnection = function(req, res) {
  

  //Make sure the api call has a valid password
  var data1  = req.body.data
  var pass = req.body.pass
  var updateTime = new Date()
  var hostName = req.headers.host
  
  var connectDate = datetime.syncCurrentDateTimeforDB(updateTime)
  console.log ("here is the HEADER HOST  "+JSON.stringify(req.headers.host))
  


  if (pass != "agpbrtdk") {
    res.status (400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
    res.send ('Error: Invalid API password') // This goes into tData and urlResponse
    // or res.status(400).json({error: 'message'})
    
  }else{
    res.status(200);
    res.send("SUCCESS Connected to "+ hostName+ " at "+connectDate); 
   
  } 
  
}

///////////////////////////////////////////////////////////////////////////
//  API to verify server connectivity
//////////////////////////////////////////////////////////////////////////////
exports.checkConnectivity = function(req, res) {
  

  //Make sure the api call has a valid password
  var data1  = req.body.data
  var pass = req.body.pass
  var _d = new Date();
  var _t = _d.getTime(); 
  var checkTime = _t;
  
  
  if (pass != "agpbrtdk") {
    res.status (400) // this goes into "the result" tsneterr: HTTP response code 400 returned from server
    res.send ('Error: unauthorised access attempt') // This goes into tData and urlResponse
    // or res.status(400).json({error: 'message'})
    
  }else{
    res.status(200);
    res.send("SUCCESS "+checkTime); 
    
   
  } 
  
}
