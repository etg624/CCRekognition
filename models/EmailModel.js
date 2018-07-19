var db = require('./db');
var datetime = require('../controllers/datetime');

module.exports.getPerson = function (email, callback) {
    console.log('getPerson called');
    console.log('logging email from getPerson');
    console.log(email);

    db.createConnection(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            var connection = result;
            var strSQL = 'SELECT * FROM people WHERE EmailAddr = "' + email + '";'
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the getPerson query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    })

}

module.exports.checkIn = function (Body, callback) {

    console.log('checkIn called');
    console.log('logging Body from checkIn');
    console.log(Body);

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;
            var time = datetime.syncGetTimeInDisplayFormat();
            var date = datetime.syncGetDateOnlyInDisplayFormat();
            var queryFields = '()'
            var strSQL = "Insert into attendance values ('999999999', '" + Body.FirstName + "', '" + Body.LastName + "', '" + time + "', '','" + Body.EventID + "','" + Body.EventName + "','" + Body.EmpID + "', '" + date + "', '', '', '" + Body.EmpID + "', '', '','" + Body.CheckInType + "', '');";
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the checkIn query');
                    console.log(err);
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.getEvent = function (eventID, callback) {

    console.log('checkEvent called');
    console.log('logging eventID from getEvent');
    console.log(eventID);

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'SELECT * FROM events WHERE EventID ="' + eventID + '";';
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    });
}

module.exports.getUnaccounted = function (Body, callback) {

    db.createConnection(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            var connection = result;
            var strSQL = "SELECT * FROM unaccounted WHERE MusterID = '" + Body.MusterID + "';"
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);

                } else {
                    console.log('error with the query');
                    connection.end();
                    callback(err, rows);
                }
            });
        }
    })

}



