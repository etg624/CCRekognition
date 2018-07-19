var express = require('express');
var router = express.Router();
var SMSCheckInModel = require('../models/SMSCheckInModel');
var MessagingResponse = require('twilio').twiml.MessagingResponse;

require('dotenv').config();


var accountSid = process.env.TWILIO_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_TOKEN;   // Your Auth Token from www.twilio.com/console
var errorMessage = 'Sorry. There was a problem with your request.'
var eventNotFoundMessage = 'No event was found with that ID.'
var contactNotFoundMessage = 'We could not find your number on file. You have been checked in as anonymous.'

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

module.exports.handleIncoming = function (req, res) {
  var phone = req.body.From;
  var input = req.body.Body;

  console.log(phone);
  console.log(input);

  /**
   ================================================================================================
                                          Revealing Modules
   ================================================================================================ 
   */
  function respond(message) {
    var twiml = new MessagingResponse();
    twiml.message(message);
    res.type('text/xml');
    res.send(twiml.toString());
  }
  /**
   ================================================================================================ 
   */

    SMSCheckInModel.getEvent(input, function (err, getEventResults) {
      if (err) {
        console.log(err);
        respond(errorMessage);
        res.end();

      } else {
        if (getEventResults.length > 0) {
          let json = {
            Field: 'Phone',
            Value: phone
          }
          SMSCheckInModel.getPerson(json, function (err, getPersonResults) {
            if (err) {
              console.log(err);
              respond(errorMessage);
              res.end();

            } else {

              if (getPersonResults.length > 0) {
                let json = {
                  FirstName: getPersonResults[0].FirstName,
                  LastName: getPersonResults[0].LastName,
                  EventID: input,
                  EventName: getEventResults[0].EventName,
                  iClassNumber: getPersonResults[0].iClassNumber,
                  EmpID: getPersonResults[0].EmpID,
                  CheckInType: "3"
                }
                SMSCheckInModel.checkIn(json, function (err, getCheckInResults) {

                  if (err) {
                    console.log(err);
                    respond(errorMessage);
                    res.end();

                  } else {
                    respond('Thank you, ' + getPersonResults[0].FirstName + '. You have been checked in.');
                    res.end();
                  }

                });
              } else {

                let json = {
                  FirstName: phone,
                  LastName: phone,
                  EventID: input,
                  EventName: getEventResults[0].EventName,
                  iClassNumber: '000',
                  EmpID: '000',
                  CheckInType: '3'

                }
                SMSCheckInModel.checkInUnknown(json, function (err, getCheckInResults) {


                  if (err) {
                    console.log(err);
                    respond(errorMessage);
                    res.end();
                  } else {
                    respond(contactNotFoundMessage);
                    res.end();
                  }

                });
              }

            }
          })
        } else {
          respond(eventNotFoundMessage);
          res.end();
        }
      }
    });
  


};


module.exports.sendAlerts = function (req, res) {

  console.log('IN SENDALERTS HANDLER');

  SMSCheckInModel.getUnaccounted(req.body, function (err, getUnaccountedResults) {
    if (err) {
      console.log(err);
      respond(errorMessage);
      res.end();
    } else {
      
      if (getUnaccountedResults.length > 0) {

        for (var i = 0; i < getUnaccountedResults.length; i++) {

          var result = getUnaccountedResults[i];
          // console.log('logging result');
          // console.log(result);


          if (result.NotificationNumber != '0' && result.NotificationNumber != '') {
            client.messages
              .create({
                body: result.FirstName + ', there is an Emergency in progress at the school.' + 
                  '. Please report to an Assembly Point OR reply with ' + req.body.MusterID + ' if you are safe.' +
                  ' Please review the emergency procedures... https://mobsscloud.com/emergency_procedures.html',
                from: '+12132050068',
                to: result.NotificationNumber
              })
              .then(message => {
                console.log("What is this? "+message.sid)
              }).done();


          } else {

          }

        }

        res.end();
      } else {
        console.log('getUnaccounted error');
        res.end();
      }
    }
  });


};