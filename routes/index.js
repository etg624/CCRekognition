var express = require('express');
var router = express.Router();



var cc = require('../controllers/cc');
var csv = require('../controllers/csv');
var photos = require('../controllers/photos');
var invites = require('../controllers/invites');
var cardholders = require('../controllers/cardholders');

var badges = require('../controllers/badges');

var events = require('../controllers/events');
var devices = require('../controllers/devices');
var connections = require('../controllers/connections');
var settings = require('../controllers/settings');
var users = require('../controllers/users');

var verify = require('../controllers/verify');
var mustering = require('../controllers/mustering');
var evacuation = require('../controllers/evacuation');
var invites = require('../controllers/invites');
//###### Wed Nov 1 14:44:04 PDT 2017 support for event tickets
var eventTickets = require('../controllers/eventTickets');
var eventTicketsAPI = require('../api/eventTickets');
//###### Sat Nov 11 13:22:50 EST 2017
var verifyRecordsAPI = require('../api/verifyRecords');
var devicesAPI = require('../api/devices');
//###### Sat Dec 30 11:17:07 PST 2017
var peopleAPI = require('../api/people');
//###### Sun Dec 31 11:17:07 PST 2017
var accessLevelsAPI = require('../api/AccessLevels');
var empBadgeAPI = require('../api/EmpBadge');
//###### Wed Jan 3 07:25:18 PST 2018
var authenticateAPI = require('../api/authenticate');
//###### Wed Jan 5 07:25:18 PST 2018  
var serverConnectAPI = require('../api/serverConnect')
//###### Wed Jan 5 07:25:18 PST 2018  
var attendanceAPI = require('../api/attendance')
var inviteListsAPI = require('../api/inviteLists')
var eventsAPI = require('../api/events');
//###### Wed Jan 21 07:25:18 PST 2018  
var syncPACS = require('../controllers/syncPACS')
//###### Fri Mar 9 14:21:39 PST 2018
var verifyConnectionAPI = require('../api/verifyConnection');
var deviceAuthAPI = require('../api/deviceAuth');

////###### Fri Apr 13 14:21:39 PST 2018
var eventTicketsAPI = require('../api/eventTickets')

////###### Fri Apr 19 14:21:39 PST 2018
var evacuationAPI = require('../api/evacuation')

////###### Fri Apr 30 14:21:39 PST 2018
var writeReport = require('../controllers/writeReport')

////###### Fri May 16 14:21:39 PST 2018
var images = require('../api/images')

////###### Fri May 16 14:21:39 PST 2018
var imageZip = require('../api/imagezip')

////###### Fri Jul 01 14:21:39 PST 2018
var photosAPI = require('../api/photos')


////###### Fri May 31 14:21:39 PST 2018
var SMSCheckInController = require('../controllers/SMSCheckInController');


/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

// display the home page
router.get('/', cc.home);

// display the list of items
router.get('/dashboard', cc.dashboardHome);
// feb--display the csv file ingest screen
router.get('/csv', csv.csvHome);
// feb--process the csv file and put the records in the database
router.post('/csv', csv.csvIngest);
// feb--display the photo ingest screen
router.get('/photos', photos.photosHome);
// feb--process the csv file and put the records in the database
router.post('/photos', photos.photosIngest);
// feb--process the csv file and put the records in the database

// show photo check page
router.get('/photoCheck', photos.photoCheck);

// show photo check page
router.post('/photoCheck', photos.photoCheckProcess);
// show general pagesrouter.get('/photoCheck', photos.photoCheck);
// show cardholders page
router.get('/cardholders', cardholders.cardholdersHome);
router.get('/badgeDetail/:badgeID', badges.badgesGetOne);
router.get('/badges', badges.badgesHome);
router.get('/badgesActive', badges.badgesActive);
router.get('/badgesInactive', badges.badgesInactive);

/////////////////////////////////////////////////////////////////////
//  EVENTS
/////////////////////////////////////////////////////////////////////
router.get('/events', events.eventsHome);
// show event Add form
router.get('/eventAdd', events.eventAdd);
// add event to database
router.post('/eventAdd', events.eventPostDatabase);
router.get('/eventModify/:eventID', events.eventGetOne);
//###### Fri Nov 17 08:06:44 PST 2017
router.get('/eventDelete/:eventID', events.eventGetForDelete);
router.post('/eventDelete/:eventID', events.eventDeleteOne);


router.get('/eventModify', events.eventGetOne);
router.post('/eventModify/:eventID', events.eventUpdateOne);
router.get('/eventAttendance/:eventID', events.eventAttendance);
router.get('/eventsUpcoming', events.eventsUpComing);
//router.post('/eventAttendance/:eventID/:eventTempID', events.writeAttendanceRpt);

router.post('/eventAttendance/:eventID', events.writeAttendanceRpt);

router.get('/eventAddInviteList/:InvitationListID/:eventID', events.eventAddInviteList);
router.post('/eventChangeInviteList/:InvitationListID/:eventID', events.eventChangeInviteList);


//###### Wed Nov 1 14:40:34 PDT 2017
/////////////////////////////////////////////////////////////////////
//  EVENT TICKETS
/////////////////////////////////////////////////////////////////////
router.get('/ticketImport', eventTickets.csvTicketHome);
router.post('/ticketImport', eventTickets.csvTicketIngest);


/////////////////////////////////////////////////////////////////////
//  API for PRIVATE (from the APP) method callers
/////////////////////////////////////////////////////////////////////

//###### Thu Nov 2 06:00:54 PDT 2017 API prototype
router.get('/getTickets', eventTicketsAPI.getTickets2);
router.post('/getTickets', eventTicketsAPI.getTickets);
//router.post('/postTickets', eventTicketsAPI.postTickets);

//###### Sat Nov 11 13:18:34 EST 2017 Post verifyRecords
router.post('/postVerifyRecords', verifyRecordsAPI.postVerifyRecords);
//###### Sat Mar 04 13:18:34 EST 2018 get People COUNT for check sum
router.post('/getPeopleCount', peopleAPI.getPeopleCount);
router.post('/getEmpBadgeCount', empBadgeAPI.getEmpBadgeCount);
router.post('/getAcclvlCount', accessLevelsAPI.getAccLvlCount);

//###### Mon Dec 11 09:36:18 PST 2017
router.post('/getDeviceName', devicesAPI.getDeviceName);

//###### Sat Dec 30 11:16:12 PST 2017 -- these three routes called from the RELAY
router.post('/getPeople', peopleAPI.getPeople);
router.post('/getEvents', eventsAPI.getEvents);
router.post('/getAccessLevels', accessLevelsAPI.getAccessLevels);
router.post('/getEmpBadge', empBadgeAPI.getEmpBadge);

router.post('/getEventAttendance', attendanceAPI.getEventAttendance);

router.post('/getInviteLists', inviteListsAPI.getInviteLists);
router.post('/getInvitees', inviteListsAPI.getInvitees);
////###### Fri Apr 13 14:21:39 PST 2018
router.post('/getEventTickets', eventTicketsAPI.getTickets);


//###### Fri Mar 9 14:22:22 PST 2018
router.post('/postVerifyConnection', verifyConnectionAPI.verifyConnection);
router.post('/postCheckConnectivity', verifyConnectionAPI.checkConnectivity);
router.post('/postCheckAuth', deviceAuthAPI.checkAuth);

//###### Fri Mar 9 14:22:22 PST 2018
router.post('/postAttendanceRecords', attendanceAPI.postAttendanceRecords);
router.post('/postEventRecords', eventsAPI.postEventRecords);

//###### Fri Mar 9 14:22:22 PST 2018
router.post('/getEvacCount', evacuationAPI.getEvacCount);

//###### Fri Jun 28 14:22:22 PST 2018
router.post('/getInviteeCount', inviteListsAPI.getInviteeCount);

//###### Fri Jul 01 14:22:22 PST 2018
router.post('/getNumberOfImageZipFiles', photosAPI.getZipFileCount);

//###### Wed Jun 13 08:48:33 PDT 2018
//router.post('/searchForImageMatch', images.searchForImageMatch);
//###### Wed Jun 13 14:14:02 PDT 2018
//-----
router.post ('/imageRecognition/searchForImageMatch', images.searchForImageMatch);
//-----
//###### Wed Jun 19 14:14:02 PDT 2018
router.post ('/searchForFaceMatch', images.searchForFaceMatch);

/////////////////////////////////////////////////////////////////////
// API for PUBLIC method callers
// PUBLIC routes pre-pended with /api/
/////////////////////////////////////////////////////////////////////
//###### Wed Jan 3 07:24:24 PST 2018
router.post('/api/authenticate', authenticateAPI.getToken);
router.post('/authVerify', authenticateAPI.authenticateTest);
router.post('/api/getPeople', peopleAPI.apiGetPeople);
router.post('/api/getEvents', eventsAPI.apiGetEvents);
//###### Tue Feb 19 08:21:05 PST 2018
router.post('/api/createEvent', eventsAPI.apiCreateEvent);

//###### Wed Jan 5 07:24:24 PST 2018
router.post('/api/testConnect', serverConnectAPI.testConnect);
router.post('/api/getAttendance', attendanceAPI.apiGetAttendance);
router.post('/api/getForAttendee', attendanceAPI.apiGetForAttendee);

//###### Tue feb 19 08:21:05 PST 2018
router.post('/api/markAttendance', attendanceAPI.apiMarkAttendance);

//###### Tue Jan 9 08:21:05 PST 2018
router.post('/api/createInviteList', inviteListsAPI.apiCreateInviteList);
router.post('/api/addInvitee', inviteListsAPI.apiAddInvitee);
router.post('/api/deleteInvitee', inviteListsAPI.apiDeleteInvitee);




/////////////////////////////////////////////////////////////////////
//  MOBILE DEVICE MANAGEMENT
/////////////////////////////////////////////////////////////////////
router.get('/events', events.eventsHome);
router.get('/connections', connections.connectionsHome);
router.get('/devices', devices.devicesHome);
router.get('/deviceModify/:authCode', devices.deviceGetOne);
router.post('/deviceModify/:authCode', devices.deviceUpdateOne);
router.get('/deviceHistory/:authCode', devices.deviceGetHistory);


/////////////////////////////////////////////////////////////////////
//  SETTINGS
/////////////////////////////////////////////////////////////////////
router.get('/settings', settings.settingsHome);
router.post('/settings', settings.settingsUpdate);
router.get('/settingsRestart', settings.settingsRestart);
//###### Tue feb 26 08:21:05 PST 2018
router.get('/attReportFormat', settings.attReportHome);
router.post('/attReportFormat', settings.attReportUpdate);
//###### Tue Apr 28 08:21:05 PST 2018
router.get('/mstReportFormat', settings.mstReportHome);
router.post('/mstReportFormat', settings.mstReportUpdate);

//###### Mon Apr 30 17:46:01 PDT 2018
//router.get('/reportConfirm', settings.mstReportUpdate);
router.get('/reportConfirm/:eventID/:rptFullName/:title', writeReport.reportConfirm);
router.post('/reportConfirm/:eventID/:rptFullName/:title', writeReport.reportDownload);






/////////////////////////////////////////////////////////////////////
//  USERS
/////////////////////////////////////////////////////////////////////
router.get('/users', users.usersHome);
router.get('/userAdd', users.userAdd);

router.post('/userAdd', users.userAddToDb);
router.get('/userModify/:userName', users.userGetOne);
router.post('/userModify/:userName', users.userUpdateOne);
router.get('/userDelete/:userName', users.userGetOneForDelete);
router.post('/userDelete/:userName', users.userDeleteOne);


/////////////////////////////////////////////////////////////////////
//  VERIFY RECORDS (records of scans through the verify app)
/////////////////////////////////////////////////////////////////////
router.get('/verifyRecords', verify.verifyHome);
//###### Fri Feb 9 17:17:47 PST 2018 Reformat screen to records within date search
router.post('/verifyRecords', verify.verifyRecordsSearch);

// Drill down into the records for a particular badge 
router.get('/verifyCheck/:badgeID', verify.verifyGetOne);
// Display the search result for drill down 
router.post('/verifyCheck/:badgeID', verify.verifySearch);
router.post('/verifyReport/:badgeID', verify.writeCardscansRpt);
router.get('/contractorCheck/:contractor', verify.contractorGetOne);

//###### Fri Jan 21 08:06:44 PST 2018
/////////////////////////////////////////////////////////////////////
//  PACS Sync
/////////////////////////////////////////////////////////////////////
//router.get('/PACSImport/', syncPACS.syncPACSHome);
router.get('/PACSImport', syncPACS.syncPACSGo);


/////////////////////////////////////////////////////////////////////
// MUSTERING
/////////////////////////////////////////////////////////////////////
router.get('/musterHome', mustering.musterHome);
router.get('/musterAdd', mustering.musterAdd);
router.post('/musterAdd', mustering.musterPostDatabase);

// Drill down into the records for a particular badge 
router.get('/musterDetail/:musterID', mustering.musterGetOne);
router.post('/musterDetail/:eventID', mustering.writeMusteringRpt);

router.get('/musterModify/:musterID', mustering.musterGetOneForEdit);
router.post('/musterModify/:musterID', mustering.musterUpdateOne);

// Display the search result for drill down 
//router.post('/musterDetail/:badgeID', mustering.verifySearch);
// Drill down into the records for a particular badge 
router.get('/musterLive/:musterID', mustering.musterLive);

//###### Fri May 01 08:06:44 PST 2018
router.post('/musterLive/:musterID', mustering.emailUnaccounted);

router.get('/musterPoints', mustering.musterPointHome);
router.get('/musterPointModify/:pointID', mustering.musterPointGetForModify);
router.post('/musterPointModify/:pointID', mustering.musterPointUpdateOne);
//attn: delete processing for muster point
//###### Fri Apr 24 08:06:44 PST 2018
router.get('/musterPointDelete/:pointID', mustering.musterPointGetForDelete);
router.post('/musterPointDelete/:pointID', mustering.musterPointDeleteOne);


//router.get('/musterPointModify/:pointID', mustering.musterPointDelete);




//the muster zone add screen
router.get('/musterPointAdd', mustering.musterPointAdd);
//post the muster zone after is was added
router.post('/musterPointAdd', mustering.musterPointPostDatabase);
//gets the list of available devices that can be selected for the zone
router.get('/devicePointAdd/:pointID', mustering.deviceListForPoint);
router.get('/devicePointChange/:pointID/:authCode', mustering.deviceChangeForMusterPoint);

//Posts the selected device to the muster point record
router.get('/musterPointAddDevice/:AuthCode/:pointID', mustering.deviceAddForPoint )
router.post('/musterPointAddDevice/:AuthCode/:pointID', mustering.deviceAddForPoint )


router.get('/evacuationHome', evacuation.evacuationHome);
router.post('/evacuationHome', evacuation.evacuationCSV);


router.get('/inviteLists', invites.inviteLists);
router.get('/inviteLists/:eventID', invites.inviteListsforEvent);
router.get('/inviteListsAdd/:eventID', invites.inviteListsAddforEvent);
router.get('/inviteListsChange/:eventID/:eventName/:invitationListID', invites.inviteListsChangeforEvent);
router.get('/inviteAdd', invites.inviteAdd);
router.post('/inviteAdd', invites.inviteIngest);
router.get('/invitees/:invitationListID', invites.invitees);

router.get('/about', cc.about);
router.get('/unauthorized', cc.unauthorized);

//###### Wed Jan 10 08:45:00 PST 2018 API help page
router.get('/apiDocs', cc.apiDocs);

//###### Thu Feb 8 17:04:26 PST 2018 Readme page
router.get('/readmeRelNotes', cc.readmeRelNotes);

//###### Thu May 16 17:04:26 PST 2018 image download prototype
//router.post('/getCardholderImages', images.getCardholderImages);


//###### Thu May 23 17:04:26 PST 2018 image download prototype
router.post('/getCardholderImage', images.getCardholderImage);


//###### Wed May 31 08:45:00 PST 2018 SMS processing
/////////////////////////////////////////////////////////////////////
// SMS
/////////////////////////////////////////////////////////////////////
router.post('/smscheckin', SMSCheckInController.handleIncoming);
router.post('/sendsmsalert', SMSCheckInController.sendAlerts);

// number is (213) 205-0068


// show photo check page
router.get('/setup', cc.about);
// handle the entry of username.  logging in
router.post('/', cc.home_post_handler);


// and logging out, closing the session
router.get('/logout', function(req, res) {
    // delete the session variable
	sess=req.session;
	console.log("logging out "+ sess.username);
    delete sess.username;
	delete sess.success;
	delete sess.photoSuccess;
	delete sess.error;
	console.log("logged out "+sess.username);
    // redirect user to homepage
    res.redirect('/');
});


// ###### Mon Jul 16 09:25:41 PDT 2018 ARA

//############################################### Invite List ############################################################
var InviteListController = require('../controllers/InviteListController');
router.get('/createinvitelist', InviteListController.createInviteListHome);
router.get('/lastinvitelist', InviteListController.getLastInviteList);
router.post('/postinvitelist', InviteListController.postInviteList);
router.post('/postinvitee', InviteListController.postInvitee);
router.get('/listwizard', InviteListController.renderListWizard);
router.get('/listwizard', InviteListController.renderListWizard);
router.get('/listwizard/:groupCategory/:groupName', InviteListController.getPeopleByGroup);
router.delete('/distributionlist', InviteListController.truncateDistributionList);
router.post('/distributionlist', InviteListController.postDistributionList);
router.post('/distributionlistmembers', InviteListController.postDistributionListMembers);
router.get('/distributionlistmembers', InviteListController.getDistributionListMembers);
router.delete('/distributionlistmembers', InviteListController.truncateDistributionListMembers);
//############################################### Invite List END ############################################################


//############################################### Microsoft Graph ############################################################

var MicrosoftGraphController = require('../controllers/MicrosoftGraphController');

router.get('/microsoftgraph', MicrosoftGraphController.getPeople);
router.post('/microsoftgraph', MicrosoftGraphController.addPerson);

//############################################### Microsoft Graph END ############################################################

//############################################### AJAX Stuff ############################################################
var MusterController = require('../controllers/MusterController');

router.get('/musterAttendance/:id', MusterController.getAttendance);
router.get('/musterUnknowns/:id', MusterController.getUnknowns);
router.get('/musterInvalids/:id', MusterController.getInvalids);
router.get('/musterEvacuation', MusterController.getEvacuationList);
router.get('/musterGetPoints/:id', MusterController.getMusterPoints);


//############################################## AJAX Stuff End ############################################################

//############################################## Email Additions ############################################################
var EmailController = require('../controllers/emailController');
router.get('/emailcheckin/:email/:eventid', EmailController.checkInByEmail);
//########################################### Email Additions End ############################################################



module.exports = router;
