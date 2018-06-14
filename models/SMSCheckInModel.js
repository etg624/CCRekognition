var db = require('./db');
var datetime = require('../controllers/datetime');

module.exports.getPerson = function (Body, callback) {
    console.log('getPerson called');

    db.createConnection(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            var connection = result;
            var strSQL = 'SELECT * FROM people WHERE ' + Body.Field + ' = "' + Body.Value + '";'
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

module.exports.checkIn = function (Body, callback) {

    console.log('checkIn called');

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;
            var time = datetime.syncGetTimeInDisplayFormat();
            var date = datetime.syncGetDateOnlyInDisplayFormat();

            var strSQL = "Insert into attendance values ('999999999', '" + Body.FirstName + "', '" + Body.LastName + "', '" + time + "', '','" + Body.EventID + "','" + Body.EventName + "','" + Body.iClassNumber + "', '" + date + "', '', '', '" + Body.EmpID + "', '', '', 'SMS', '" + Body.CheckInType + "')";
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

module.exports.checkInUnknown = function (Body, callback) {

    console.log('checkInUnknown called');

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;
            var time = datetime.syncGetTimeInDisplayFormat();
            var date = datetime.syncGetDateOnlyInDisplayFormat();

            var strSQL = "Insert into attendance values ('999999999', '" + Body.FirstName + "', '" + Body.LastName + "', '" + time + "', '','" + Body.EventID + "','" + Body.EventName + "','" + Body.iClassNumber + "', '" + date + "', '', '', '" + Body.EmpID + "', '', '', 'SMS', '" + Body.CheckInType + "')";
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

module.exports.getEvent = function (input, callback) {

    console.log('checkEvent called');

    db.createConnection(function (err, reslt) {
        if (err) {
            console.log('Error while performing common connect query: ' + err);
            callback(err, null);
        } else {
            //process the i/o after successful connect.  Connection object returned in callback
            var connection = reslt;

            var strSQL = 'SELECT * FROM events WHERE EventID ="' + input + '";';
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



