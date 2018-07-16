var db = require('./db');
require('dotenv').config();


module.exports.getPeople = function (callback) {
    db.createConnection(function (err, result) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            var connection = result;
            var strSQL = "select * from people";
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);
                } else {
                    console.log('error with the query');
                    connection.end();
                    callback(err, rows);
                }
            })
        }
    });
}

module.exports.addPerson = function (Body, callback) {

    var date = new Date();
    var time = date.getTime();


    db.createConnection(function (err, result){
        if (err){
            console.log(err);
            callback(err, null);
        } else {
            var connection = result;
            var strSQL = "INSERT into people (FirstName, LastName, Phone) values ('" + Body.FirstName + "', '" + Body.LastName + "', '" + Body.Phone + "');"
            connection.query(strSQL, function (err, rows, fields) {
                if (!err) {
                    connection.end();
                    callback(null, rows);
                } else {
                    console.log('error with the query');
                    connection.end();
                    callback(err, rows);
                }
            })
        }
    })
}

// module.exports.getPersonByName = function (Body, callback) {
//     db.createConnection(function (err,result){
//         if (err) {
//             console.log(err);
//             callback (err, null);
//         } else {

//             var connection = result;
            

//         }
//     })
// }