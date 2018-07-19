///////////////////////////////////////////////////////////////////////////////////////////
// This module is used to send messages to admininstrators if there is a serious db issue//
// or the sweep processing fails                                                         //
///////////////////////////////////////////////////////////////////////////////////////////


const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
var EmailModel = require('../models/EmailModel');

////////////////////////////////////////////////////////////////////////////
// The following module emails attendance reports to user's email address //
////////////////////////////////////////////////////////////////////////////

module.exports.sendAttendanceEmail = function (subject, message, to, fileName, callback) {

    if (process.env.EMAIL_SECURE == "true") {

        // var smtpConfig = {
        //     //host: 'smtp.mail.com',
        //     host: process.env.EMAIL_HOST,
        //     port: process.env.EMAIL_PORT,
        //     secure: process.env.EMAIL_SECURE, // use SSL
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS
        //     }
        // };
    } else {
        // var smtpConfig = {
        //     //host: 'smtp.mail.com',
        //     host: process.env.EMAIL_HOST,
        //     port: process.env.EMAIL_PORT,
        //     secure: false, // do NOT use SSL
        //     ignoreTLS: true // make sure nothing is using TLS
        // }
    }

    sgMail.setApiKey(process.env.EMAIL_PASS);
    const msg = {
        to: to,
        from: process.env.EMAIL_FROMADDR,
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(msg);


    // var transporter = nodemailer.createTransport(smtpConfig);

    // // setup email data with unicode symbols
    // var mailOptions = {
    //     //from: 'dragonseat@mail.com>', // sender address
    //     from: process.env.EMAIL_FROMADDR, // sender address
    //     to: to, // list of receivers
    //     subject: subject, // Subject line
    //     text: message, //
    //     //text: 'there was an error connecting to the database', //
    //     html: '<b>' + message + '</b>', // html body
    //     attachments: [
    //         {   // utf-8 string as an attachment
    //             //path: 'c:/users/bligh/dropbox/JH061617-master/DEVHEAD - Copy/Public/Reports/my_cron_file.txt'
    //             path: './Public/Reports/' + fileName


    //         }]

    // };

    // // send mail with defined transport object
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log('Message %s sent: %s', info.messageId, info.response);
    // });
};


//////////////////////////////////////////////////////////////////////////
// Following module emails in-application incidents and alerts to mobss //
//////////////////////////////////////////////////////////////////////////

module.exports.sendIncidentEmail = function (data) {

    console.log('sendIncidentEmail called');

    // var smtpConfig = {
    //     //host: 'smtp.mail.com',
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     secure: process.env.EMAIL_SECURE, // use SSL
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         //pass: 'Dragonseat6000!'
    //         pass: process.env.EMAIL_PASS
    //     },
    //     pool: true,
    //     maxConnections: 1,
    //     rateDelta: 20000,
    //     rateLimit: 3
    // };

    // var transporter = nodemailer.createTransport(smtpConfig);

    var title = process.env.EMERGENCY_TITLE
    var message = `
    There is an Emergency in progress at the school. Please click the link below to confirm that you are okay. 
    Please review the emergency procedures... https://emilms.fema.gov/IS360/SAFE0104230text2.htm'
  
    Problem Statement:
Mobbs readers have Bluetooth transceivers that pair to iPods inside the same housing.
However, if a customer has multiple Mobbs readers the iPods may pair to the wrong
Bluetooth, rendering the system unusable.

Possible Solution.
 A few months ago, I loaded the wrong firmware hex into the Bluetooth. The only difference
I am aware of is this firmware had a different UUID name. No matter what I tried the IOS 
would not allow me to pair to this Bluetooth. The IOS was apparently looking for a UUID
of CardReader Demo, however the firmware I loaded had a UUID called Mobbs Reader.
The different UUID name was effectively locking out other names and only pairing to CardReader
Demo.This mistake got me thinking that perhaps we could use the UUID name to exclusively
pair to the correct unit. If we used a unique firmware for each Bluetooth module and also made
the IOS name changeable we would have a locked down system.

IOS Question:
Is it true that the IOS is looking for a UUID of CardReader Demo ? And, if so can we make this choice settable in IOS ?

If then:
Depending on the answer to the IOS question, we can decide to move forward with this approach or not… This would involve changes in both IOS and Bluetooth hex. 

thanks
Randy

    `

    //Loop through the unaccounted table and find their emails
    for (var i = 0; i < data.length; i++) {

        //--
        // Email report
        if (data[i].EmailAddress != "" && data[i].EmailAddress != null) {

            var to = data[i].EmailAddress;

            // setup email data with unicode symbols
            // var mailOptions = {
            //     //from: 'dragonseat@mail.com>', // sender address
            //     from: process.env.EMAIL_FROMADDR, // sender address
            //     to: to, // list of receivers
            //     subject: title, // Subject line
            //     text: message, //
            //     //text: 'there was an error connecting to the database', //
            //     html: '<b>' + message + '</b>' // html body

            // };

            //send mail with defined transport object
            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         return console.log(error);
            //     }
            //     console.log('Message %s sent: %s', info.messageId, info.response);
            // });


            sgMail.setApiKey(process.env.EMAIL_PASS);
            const msg = {
                to: to,
                from: process.env.EMAIL_FROMADDR,
                subject: title,
                text: message
            };
            sgMail.send(msg);

            
        }

    }






};


module.exports.checkInByEmail = function (req, res) {
EmailModel.getPerson(req.params.email, function (err,getPersonResult){
    if (err) {
    res.end();
    } else {
EmailModel.getEvent(req.params.eventid, function (err, getEventResult){
    if (err) {
        res.end();
    } else {
        let json = {
            FirstName: getPersonResult[0].FirstName,
            LastName: getPersonResult[0].LastName,
            EventID: getEventResult[0].EventID,
            EventName: getEventResult[0].EventName,
            EmpID: getPersonResult[0].iClassNumber,
            CheckInType: 4

        }
EmailModel.checkIn(json, function (err, checkInResult) {
    if (err) {
        res.end();
    } else {
        res.json(checkInResult);
    }
})        
    }
})        
    }
})
}



