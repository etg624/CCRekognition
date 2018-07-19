var MusterModel = require('../models/MusterModel');

module.exports.getAttendance = function (req, res) {
  MusterModel.getAttendance(req.params.id, function (err, result) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(result);
    }
  });
};


module.exports.getUnknowns = function (req, res) {
  MusterModel.getUnknowns(req.params.id, function (err, resUnknowns) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(resUnknowns);
    }
  });
};

module.exports.getInvalids = function (req, res) {
  MusterModel.getInvalids(req.params.id, function (err, resInvalids) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(resInvalids);
    }
  });
};

module.exports.getEvacuationList = function (req, res) {
  MusterModel.getEvacuationList(function (err, resEvacuation) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(resEvacuation);
    }
  });
};

module.exports.getMusterPoints = function (req, res) {
  MusterModel.getMusterPoints(req.params.id, function (err, resPoints) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(resPoints);
    }
  });
};





