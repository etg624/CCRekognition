var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var sweep      = require('./controllers/sweep');

//###### Sun Jun 10 11:55:38 PDT 2018
var eventEnd = require('./controllers/eventEnd');

//feb--.lc script processing
var SimpleCGI = require('simplecgi');
const opn = require('opn');

//###### Wed Jun 13 14:14:02 PDT 2018
//-----
const multer = require('multer');
const upload = multer({dest: './'})
//----
//----

//require('./models/db');

//* SSL CHANGES - NEXT 3 LINES
var https = require("https")
var http = require("http")
var fs = require( 'fs' );
require('dotenv').config();

// var cc = require('./routes/cc');

// attempt to use express 4 sessions, as express 3 method now deprecated
var session = require('express-session');

/**
 * SSL certificate set up, if SSL is ON and conditioned on
 * whether cert was generated with a passphrase or not
 */
//var privateKey = fs.readFileSync( 'mobsscloudcert.pem' ).toString();
//var certificate = fs.readFileSync( 'STAR_mobsscloud_com.crt' ).toString();
if (process.env.CC_SSL == "YES"){
  var privateKey = fs.readFileSync( process.env.CERT_NAME+'.key' ).toString();
  var certificate = fs.readFileSync( process.env.CERT_NAME+'.crt').toString();
  if (process.env.CERT_PASSPHRASE ==""){
     var options = {key: privateKey, cert: certificate};
  }else{
    var passphrase = process.env.CERT_PASSPHRASE
    var options = {key: privateKey, cert: certificate, passphrase: passphrase};
  }
}

var app = express();



// which index file to use
var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

//###### Wed Jun 13 14:14:02 PDT 2018
//-----
app.use ('/imageRecognition/', upload.single('image'), routes);
//-----

// following two lines work for looging in but no post data is read
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

//following lines 
//app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));
//--> works for login not for verifyercords app.use(bodyParser.urlencoded({limit: '50mb', extended: false, parameterLimit:50000}));
//-APR 20-> x-www and multiform both work for posting (as long as using irldecode in script).  BUT log-in does not
app.use(bodyParser.urlencoded({ extended:true, limit:1024*1024*20, type:'application/x-www-form-urlencoding'}));
//app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}));
//--> works for verify records not for log-in  app.use(bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoding'}));

app.use(cookieParser());
app.use(require('stylus').middleware(__dirname + '/public'));
// feb-- .lc processing.  this line has to go BEFORE the app.use(express.static) line, or it doesnt run the engine.
// feb-- tried to do this through the router but couldnt get it to work
app.all(/^.+[.]lc$/, SimpleCGI(
      __dirname+'/livecode-server/livecode-server.exe', __dirname + '/public', /^.+[.]lc$/
    ));
app.use(express.static(path.join(__dirname, 'public')));

//app.get('/download', function(req, res) {
  //res.download(__dirname + '/foo.txt', 'foo.txt');
//});

//feb-- the new express 4 sessions stuff, as express 3 method now deprecated
app.use(session({secret: 'boris', 
                 saveUninitialized: true,
                 resave: true}));


app.use(bodyParser.urlencoded({limit: '50mb', extended: false, parameterLimit:50000}));


app.use('/', routes);



//app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

///////////////////////////////////////
// daily csv sweeper                 //
///////////////////////////////////////
var CronJob = require('cron').CronJob;

if (process.env.SWEEP_SCHED != "OFF") {

    /*
    Each of the 6 ranges represent, left to right...
    Seconds: 0-59
    Minutes: 0-59
    Hours: 0-23
    Day of Month: 1-31
    Months: 0-11
    Day of Week: 0-6
    eg: runs 5 days a week at 640PM
    '00 40 18 * * 1-5'
    Six * means runs every second
     */
    //new CronJob('00 46 12 * * 1-5', function() {
    
    //###### Tue Oct 3 07:12:37 PDT 2017  Seperate the photos and data elements of the sweep
    var sweepDataAndPhotos = process.env.SWEEP_SCOPE
    
    
    //###### Tue Oct 24 07:12:37 PDT 2017  User config of sweep -- parameterize cron
    var sweepTime = process.env.SWEEP_TIME
    
    console.log('here is the sweep time parm '+sweepTime) 
    
    new CronJob(sweepTime, function() {
      
    //new CronJob('0 31 11 * * 0-6', function() {

    //new CronJob('* * * * * *', function() {
        //###### Tue Oct 3 07:12:37 PDT 2017  Seperate the photos and data elements of the sweep
        sweep.sweeper(sweepDataAndPhotos, function(err,rslt){
              if (err) {console.log('cron unsuccessful: ' + err);}
      });

    }, null, true, 'America/New_York');
}

//###### Sun Jun 10 08:18:29 PDT 2018
///////////////////////////////////////
// Event End Monitor                 //
///////////////////////////////////////
var eventEndMonitor = require('cron').CronJob;

if (process.env.EVENTEND_MONITOR != "OFF") {

    /*
    Each of the 6 ranges represent, left to right...
    Seconds: 0-59
    Minutes: 0-59
    Hours: 0-23
    Day of Month: 1-31
    Months: 0-11
    Day of Week: 0-6
    eg: runs 5 days a week at 640PM
    '00 40 18 * * 1-5'
    Six * means runs every second
     */
    //new CronJob('00 46 12 * * 1-5', function() {
    
    
    //###### Tue Oct 24 07:12:37 PDT 2017  User config of sweep -- parameterize cron
    var eventEndMonitorFrequency = process.env.EVENTEND_FREQ
        
    new eventEndMonitor(eventEndMonitorFrequency, function() {
 
      eventEnd.eventEndMonitor(function(err,rslt){
        if (err) {console.log('Event End Monitor cron unsuccessful: ' + err);}
      });

    }, null, true, 'America/New_York');
}


// console.log('You will see this message every second');
    //this will allow us to simply add a hardcoded directory daily csv and then it will simply read the latest file in the directory and determine if there has been a change
      //console.log('the path is '+__dirname); // this looks like the application directory
        //console.log('the path is '+__filename); // this is the directory plus app.js
          //console.log('the path is '+process.argv[1]);//this is the directory plus app

var port = process.env.PORT || 3000;
/**
 * Adding a name for the listen object so we can then set the timeout length.
 * Node defaults to 2 minutes, which is too sort to wait for long inserts.
 * Have only done the for HTTP so far.
 */
var server = app.listen(port, function() {
  console.log("Listening on " + port);
 });

 server.setTimeout(10 * 60 * 1000); // 10 * 60 seconds * 1000 msecs = 10 minutes


// You can set morgan to log differently depending on your environment
//console.log(__dirname);
//app.use(logger('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/morgan.log' }));

/** 
 * If SSL enabled, create a server instance for SSL
 * 
 */
if (process.env.CC_SSL == "YES"){
 https.createServer(options,app).listen(443, function () {
  console.log('App listening on port 443!')
});
}



// Opens the url in the default browser
//if (process.env.SETUP_STS == 1){
  //console.log('getting here '+process.env.SETUP_STS)
  //opn('http://localhost:3000');
//} else{
  //opn('http://localhost:3000/setup');
//}



// ###### Mon Jul 16 09:29:51 PDT 2018 ARA

 // ###################### MICROSOFT GRAPH API ##################################################################################################################################


 var auth = require('./microsoft-graph/auth');
 var graph = require('./microsoft-graph/graph');
 var findMatches = require('./findMatches');
 var CreateRandom = require('./CreateRandom');
 var request = require('request');
 const querystring = require('querystring');


 var exchangeArray = [];
 var ccArray = [];
 var exchangeNameArray = [];
 var exchangePhoneArray = [];
 var ccNameArray = [];
 var ccPhoneArray = [];
 var matches = [];


 clearDistributionLists();


 // ******************************** BELOW 3: For adding people to DB
 function callAPIForPeople() {
   // Get an access token for the app.
   auth.getAccessToken().then(function (token) {
     // Get all of the users in the tenant.
     graph.getContacts(token)
       .then(function (contacts) {
         for (var i = 0; i < contacts.length; i++) {
           let currentContact = contacts[i];
           // add contact to db;
           postPerson(currentContact);
           // exchangeArray.push({
           //   name: currentContact.givenName + ' ' + currentContact.surname,
           //   phone: currentContact.mobilePhone
           // });
         }
         // getPeopleFromDB();
       }, function (error) {
         console.error('>>> Error getting users: ' + error);
       });
   }, function (error) {
     console.error('>>> Error getting access token: ' + error);
   });
 }

 function getPeopleFromDB() {
   http.get(process.env.SERVER_ADDRESS + '/microsoftgraph', (res) => {


     const { statusCode } = res;
     const contentType = res.headers['content-type'];

     let error;
     if (statusCode !== 200) {
       error = new Error('Request Failed.\n' +
         `Status Code: ${statusCode}`);
     } else if (!/^application\/json/.test(contentType)) {
       error = new Error('Invalid content-type.\n' +
         `Expected application/json but received ${contentType}`);
     }
     if (error) {
       console.error(error.message);
       // consume response data to free up memory
       res.resume();
       return;
     }

     res.setEncoding('utf8');
     let rawData = '';
     res.on('data', (chunk) => { rawData += chunk; });
     res.on('end', () => {
       try {

         const parsedData = JSON.parse(rawData);

         for (var i = 0; i < parsedData.length; i++) {

           let currentPerson = parsedData[i];

           ccArray.push({
             name: currentPerson.FirstName + ' ' + currentPerson.LastName,
             phone: currentPerson.Phone
           });
         }


         for (var i = 0; i < exchangeArray.length; i++) {
           exchangeNameArray.push(exchangeArray[i].name);
         }
         for (var i = 0; i < exchangeArray.length; i++) {
           exchangePhoneArray.push(exchangeArray[i].phone);
         }
         for (var i = 0; i < ccArray.length; i++) {
           ccNameArray.push(ccArray[i].name);
         }
         for (var i = 0; i < ccArray.length; i++) {
           ccPhoneArray.push(ccArray[i].phone);
         }

         nameMatches = findMatches.find(exchangeNameArray, ccNameArray);

         for (var i = 0; i < nameMatches.length; i++) {

           addPhoneToDB(nameMatches[i]);
         }

       } catch (e) {
         console.error(e.message);
       }
     });
   }).on('error', (e) => {
     console.error(`Got error: ${e.message}`);
   });
 }

 function postPerson(contact) {

   const json = querystring.stringify({
     'FirstName': contact.givenName,
     'LastName': contact.surname,
     'Phone': contact.mobilePhone
   });

   const options = {
     hostname: 'ec2-34-215-115-69.us-west-2.compute.amazonaws.com',
     port: 3000,
     path: '/microsoftgraph',
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
       'Content-Length': Buffer.byteLength(json)
     }
   };

   const req = http.request(options, (res) => {
     res.setEncoding('utf8');
     res.on('data', (chunk) => {
     });
     res.on('end', () => {
     });
   });

   req.on('error', (e) => {
   });

   // write data to request body
   req.write(json);
   req.end();


 }

 // ******************************** BELOW 4: For adding distribution lists

 function clearDistributionLists() {

  console.log('clearDistributionLists called');

   request.del(process.env.SERVER_ADDRESS + "/distributionlist", function (err, res, body) {
     if (err) {
     } else {
       clearDistributionListMembers()
     }
   })

 }

 function clearDistributionListMembers() {
  console.log('clearDistributionListMembers called');

   request.del(process.env.SERVER_ADDRESS + "/distributionlistmembers", function (err, res, body) {
     if (err) {
     } else {
       callAPIForGroups();
     }
   })

 }

 function callAPIForGroups() {

  console.log('callAPIForGroups called');

   auth.getAccessToken().then(function (token) {
     // Get all of the users in the tenant.
     graph.getGroups(token)
       .then(function (groups) {

         for (var i = 0; i < groups.length; i++) {

           let currentGroup = groups[i];


           let json = {
             ListID: currentGroup.id,
             ListName: currentGroup.displayName,

           }

           postList(json);

         }

       }, function (error) {
         console.error('>>> Error getting groups: ' + error);
       });
   }, function (error) {
     console.error('>>> Error getting access token: ' + error);
   });

 }

 function postList(data) {

  console.log('postList called');

   const listData = querystring.stringify({
     'ListID': data.ListID,
     'ListName': data.ListName
   });


   const options = {
     hostname: 'ec2-34-215-115-69.us-west-2.compute.amazonaws.com',
     port: 3000,
     path: '/distributionlist',
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
     }
   };

   const req = http.request(options, (res) => {
     res.setEncoding('utf8');
     res.on('data', (chunk) => {
     });
     res.on('end', () => {

       callAPIForMembers(data);
     });
   });

   req.on('error', (e) => {
   });

   // write data to request body
   req.write(listData);
   req.end();

 }

 function callAPIForMembers(data) {

  console.log('callAPIForMembers called');

   auth.getAccessToken().then(function (token) {
     // Get all of the users in the tenant.
     graph.getGroupMembers(token, data.ListID)
       .then(function (members) {

         for (var i = 0; i < members.length; i++) {

           let currentMember = members[i];

           let memberID = CreateRandom.create();
           console.log(memberID);

           let personData = {
             'MemberID': memberID,
             'ListID': data.ListID,
             'LastName': currentMember.surname,
             'FirstName': currentMember.givenName,
             'EmailAddress': currentMember.mail,
             'NotificationNumber': currentMember.mobilePhone
           }

           console.log('logging personData');
           console.log(personData);

           postMember(personData);

         }

       }, function (error) {
         console.error('>>> Error getting members: ' + error);
       });
   }, function (error) {
     console.error('>>> Error getting access token: ' + error);
   });
 }

 function postMember(personData) {

  console.log('postMember called');

   const data = querystring.stringify(personData);


   const options = {
     hostname: 'ec2-34-215-115-69.us-west-2.compute.amazonaws.com',
     port: 3000,
     path: '/distributionlistmembers',
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
     }
   };


   let req = http.request(options, (res) => {
     res.setEncoding('utf8');
     res.on('data', (chunk) => {
     });
     res.on('end', () => {
     });
   });

   req.on('error', (e) => {
     console.log('logging error ');
     console.log(e);
   });



   // write data to request body
   req.write(data);
   req.end();



 }

 // ###################### MICROSOFT GRAPH API END ##################################################################################################################################

module.exports = app;
