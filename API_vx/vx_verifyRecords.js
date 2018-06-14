
//###### Sat Nov 11 19:47:35 PST 2017  New module for updating the expternal PACS system AccessNSite

var request = require('request');
var verifyRecords = require('../models/verifyRecords'); //verifyrecords db interaction module in MODELS




////////////////////////////////////////////////////////////////////////////
//  API to vx system for posting verifyRecords events
//////////////////////////////////////////////////////////////////////////////
exports.recordEvent = function(data, callback) {

    getUniqueId(data, function(returnValue) {
      // use the return value here instead of like a regular (non-evented) return value
      
      var credUniqueId = returnValue
      //###### Fri Nov 17 06:00:37 PST 2017, ATTN: probably shouldnt make the second call if the first one fails
      //or does not produce a uniqueId we can use


      //Make sure the api call has a valid password
      //console.log ("here is the vx POST body "+JSON.stringify(req.body))
      //console.log("THISUNIQUE CRED??"+JSON.stringify(returnValue))
      //console.log("THISUNIQUE CRED??"+returnValue)
      

      //Format the XML envelope for the SOAP call to vx
      let xml =

      `<?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Body>
          <tns:VXWSCall xmlns:tns="vx.sx">
            <tns:op>recordEvent</tns:op>
            <tns:args>
              <tns:arg>
                <tns:String>XT.E0000</tns:String>
              </tns:arg>
              <tns:arg>
                <tns:String>9</tns:String>
              </tns:arg>
              <tns:arg>
                <tns:String>ingress</tns:String>
              </tns:arg>
              <tns:arg>
                <tns:Long>-1</tns:Long>
              </tns:arg>
              <tns:arg>
                <tns:Long>-1</tns:Long>
              </tns:arg>
              <tns:arg>
                <tns:String>`+credUniqueId+`</tns:String>
              </tns:arg>
              <tns:arg/>
              <tns:arg>
                <tns:Long>0</tns:Long>
              </tns:arg>
            </tns:args>
          </tns:VXWSCall>
        </soapenv:Body>
      </soapenv:Envelope>`



      //###### Sat Nov 11 19:54:04 PST 2017  Needd to parameterize the URL in the environment variables
      var options = {
        url: 'http://localhost:8080/axis2/services/VXService',
        method: 'POST',
        body: xml,
        headers: {
          'Content-Type':'text/xml;charset=utf-8',
          'Accept-Encoding': 'gzip,deflate',
          'Content-Length':xml.length,
          'SOAPAction': "urn:anonOutInOp"
        }
        


      };

      let callbackRequest = (error, response, body) => {
        if (!error && response.statusCode == 200) {
          //console.log('Raw result', body);

           //Update the verifyrecords table  
           verifyRecords.updateSentVerifyRecord(data, function(err,reslt2){ 
            if(err){console.log("scan record  was not updated as set in the mobss system")}
          })

          var xml2js = require('xml2js');
          var parser = new xml2js.Parser({explicitArray: false, trim: true});
          parser.parseString(body, (err, result) => {
              
          //for the entire JSOn set, need to stringify.  But can access and console.log individual elements of the object wihtout need of stringifying
              //console.log('JSON result', JSON.stringify(result));
            // Get The Result From The Soap API and Parse it to JSON

          //var requestResult = result['soapenv:Envelope']['soapenv:Body']["ns:VXWSResponse"]["ns:List"]["ns:Person"]["ns:PersonIdentifier"]["ns:Name"]["ns:lastName"]
          
          
          callback (null,result)
          
              //Both of these two work.  first one produces results with double quotes, second without.
              //console.log("SUB-JSON RESULT ", JSON.stringify(requestResult))
              ///console.log("SUB-JSON RESULT ", requestResult)
              
              
          });
        };
        console.log('E', response.statusCode, response.statusMessage);  
      };

      request(options, callbackRequest);
    })

  }



  ////////////////////////////////////////////////////////////////////////////
  //  API to vx system for posting verifyRecords events
  //////////////////////////////////////////////////////////////////////////////
  var getUniqueId = function(data, callback) {
    
    
    
      //Make sure the api call has a valid password
      //console.log ("here is the vx POST body "+JSON.stringify(req.body))
      console.log("THIS??"+JSON.stringify(data))
      //dataForUpd = JSON.parse(data)
    
      console.log("the vx data sent is "+JSON.stringify(data))
    
      //console.log("vx the elements . "+JSON.stringify(data[2]))
      //console.log("vx the elements p "+JSON.stringify(data[2].BadgeID))
      //console.log("vx the elements p "+ data[2].BadgeID)
      console.log("vx the nuimber of rows sent is "+data.length)
    
    
      //var cred ="3"
      var cred =data.BadgeID
      console.log("HERE IS CRED "+cred)
    
      //Format the XML envelope for the SOAP call to vx
      let xml =
    
      `<?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Body>
          <tns:VXWSCall xmlns:tns="vx.sx">
            <tns:op>getAllByFilter</tns:op>
            <tns:args>
              <tns:arg>
                <tns:String>Badge</tns:String>
              </tns:arg>
              <tns:arg>
                <tns:Filter>
                  <tns:EqualsNode tns:id="rootNode">
                    <tns:PropertyNode tns:id="leftNode">
                      <tns:property>cardNum</tns:property>
                    </tns:PropertyNode>
                    <tns:ValueNode tns:id="rightNode">
                      <tns:BigDecimal tns:id="value">`+cred+`</tns:BigDecimal>
                    </tns:ValueNode>
                    <tns:name>EQUALS</tns:name>
                    <tns:caseSensitive>true</tns:caseSensitive>
                  </tns:EqualsNode>
                </tns:Filter>
              </tns:arg>
              <tns:arg>
                <tns:Integer>-1</tns:Integer>
              </tns:arg>
              <tns:arg/>
            </tns:args>
          </tns:VXWSCall>
        </soapenv:Body>
      </soapenv:Envelope>`
    
    
    
      //###### Sat Nov 11 19:54:04 PST 2017  Needd to parameterize the URL in the environment variables
      var options = {
        url: 'http://localhost:8080/axis2/services/VXService',
        method: 'POST',
        body: xml,
        headers: {
          'Content-Type':'text/xml;charset=utf-8',
          'Accept-Encoding': 'gzip,deflate',
          'Content-Length':xml.length,
          'SOAPAction': "urn:anonOutInOp"
        }
        
    
    
      };
    
      let callbackRequest = (error, response, body) => {
        if (!error && response.statusCode == 200) {
          console.log('Raw result', body);
          var xml2js = require('xml2js');
          var parser = new xml2js.Parser({explicitArray: false, trim: true});
          parser.parseString(body, (err, result) => {
              
          //for the entire JSOn set, need to stringify.  But can access and console.log individual elements of the object wihtout need of stringifying
              console.log('FUNCTION JSON result', JSON.stringify(result));
            // Get The Result From The Soap API and Parse it to JSON
    
            var requestResult = result['soapenv:Envelope']['soapenv:Body']["ns:VXWSResponse"]["ns:List"]["ns:Badge"]["ns:uniqueId"];
            console.log('FUNCTION result', JSON.stringify(requestResult));
            console.log('E', response.statusCode, response.statusMessage);  
            
           
              //Both of these two work.  first one produces results with double quotes, second without.
              //console.log("SUB-JSON RESULT ", JSON.stringify(requestResult))
              ///console.log("SUB-JSON RESULT ", requestResult)
            callback (requestResult)


              
          });
        }else{
          console.log('E', response.statusCode, response.statusMessage);  
        }
      };
    
      request(options, callbackRequest);
  
  
};