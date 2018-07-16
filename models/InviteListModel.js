var db = require('./db');
var datetime = require('../controllers/datetime');

var time = datetime.syncCurrentDateTimeforDB();

module.exports.postInviteList = function (Body, callback) {

    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var queryFields = '(InvitationListID, ListName, ListComment, UpdateTime)';
            var queryValues = '"' + Body.ListName + '", "' + Body.ListComment + '","' + time + '")';
            var query = 'INSERT INTO invitelist ' + queryFields + ' VALUES (LAST_INSERT_ID(),' + queryValues;
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the postInviteList query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.postInvitee = function (Body, callback) {

    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var queryFields = '(InvitationListID, BadgeNumber, LastName, FirstName, EmailAddress, UpdateTime)';
            var queryValues = '("' + Body.InvitationListID + '", "' + Body.BadgeNumber + '", "' + Body.LastName + '", "' + Body.FirstName + '", "' + Body.EmailAddress + '", "' + time + '")';
            var query = 'INSERT INTO invitees ' + queryFields + ' VALUES ' + queryValues;
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the createInviteList query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.getLastInviteList = function (callback) {

    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var query = 'SELECT * FROM invitelist ORDER BY InvitationListID desc LIMIT 1;';
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the getLastInviteList query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.getGroups = function (Body, callback) {
    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var query = 'SELECT ' + Body.GroupCategory + ' FROM people GROUP BY ' + Body.GroupCategory + ';';
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the getLastInviteList query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    })
}

module.exports.getPeopleByGroup = function (GroupCategory, GroupName, callback) {
    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var query = 'SELECT * FROM people WHERE ' + GroupCategory + '= "' + GroupName + '";'
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the getPeopleByGroup query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    })
}

//*************************** Microsoft Graph API Methods ************************************ */


module.exports.truncateDistributionList = function (callback){
    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var query = 'TRUNCATE TABLE distribution_list';
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the truncateDistributionList query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.truncateDistributionListMembers = function (callback){
    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var query = 'TRUNCATE TABLE distribution_list_member';
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the truncateDistributionList query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.postDistributionList = function (Body, callback){
    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var queryFields = '(ListID,ListName)';
            var queryValues = '("' + Body.ListID + '", "' + Body.ListName + '")';
            var query = 'INSERT INTO distribution_list ' + queryFields + ' VALUES ' + queryValues;
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the postDistributionList query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });   
}

module.exports.postDistributionListMembers = function (Body, callback){

    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var queryFields = '(MemberID,ListID, LastName, FirstName, EmailAddress, NotificationNumber )';
            var queryValues = '("' + Body.MemberID + '", "' + Body.ListID + '", "' + Body.LastName + '", "' + Body.FirstName + '", "' + Body.EmailAddress + '", "' + Body.NotificationNumber + '")';
            var query = 'INSERT INTO distribution_list_member ' + queryFields + ' VALUES ' + queryValues;
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the postDistributionListMembers query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });   
}

module.exports.getDistributionLists = function (callback) {
    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var query = 'SELECT * FROM distribution_list;';
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the getDistributionLists query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    })
}

module.exports.getDistributionListMembers = function (callback) {
    db.createConnection(function (err, res) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = res;

            var query = 'SELECT * FROM distribution_list_member;';
            connection.query(query, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the getDistributionListMembers query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    })
}


/**
 SELECT Department FROM people GROUP BY Department;
 SELECT * FROM people WHERE Department = "";
*/


