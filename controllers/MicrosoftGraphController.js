var express = require('express');
var router = express.Router();
var MicrosoftGraphModel = require('../models/MicrosoftGraphModel');


module.exports.getPeople = function (req, res) {
    MicrosoftGraphModel.getPeople(function (err, getPeopleResult) {
        if (err) {
            res.json(err);
            
        } else {
            res.json(getPeopleResult);
        }
    });
}

module.exports.addPerson = function (req, res) {

    MicrosoftGraphModel.addPerson(req.body, function (err, result) {
      if (err) {
        res.json(err);
      }
      else {
        res.json(result);
      }
    });
  };

// module.exports.getPersonByName = function (req, res) {
//     MicrosoftGraphModel.getPersonByName(function (err, getPeopleResult) {
//         if (err) {
//             res.json(err);
            
//         } else {
//             res.json(getPeopleResult);
//         }
//     });
// }


