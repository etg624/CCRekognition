var db = require('../models/db');
var InviteListModel = require('../models/InviteListModel');

exports.createInviteListHome = function (req, res) {
  sess = req.session;
  // don't let nameless people view the dashboard, redirect them back to the homepage
  if (typeof sess.username == 'undefined') res.redirect('/');
  else {

    db.createConnection(function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        //process the i/o after successful connect.  Connection object returned in callback
        var connection = result;

        var _sqlQ = "SELECT * FROM people";
        connection.query(_sqlQ, function (err, results) {
          //connection.release();
          if (err) { console.log('cardholder query bad' + err); callback(true); return; }

          //use alternate views based on data load. Using JS datatables, HTML must load comletely before
          //the page renders
          if (results.length < 5000) {
            //regular Js datatables high functionality search and pagination  
            res.render('CreateInviteListView', { title: 'Command Center - Create Invite List', username: req.session.username, results });
          } else {
            //plain table and browser search only  
            res.render('cardholdersLarge', { title: 'Command Center - Cardholders', username: req.session.username, results });
          }
        });
      }
    });
    //res.render('cardholders', { title: 'Command Center 360 - ' });
  }
};

exports.postInviteList = function (req, res) {
  InviteListModel.postInviteList(req.body, function (err, postInviteListResult) {
    if (err) {
      res.json(err);
    } else {
      res.json(postInviteListResult);
    }
  })
}

exports.postInvitee = function (req, res) {
  InviteListModel.postInvitee(req.body, function (err, postInviteeResult) {
    if (err) {
      res.json(err);
    } else {
      res.json(postInviteeResult);
    }
  })
}

module.exports.getLastInviteList = function (req, res) {
  InviteListModel.getLastInviteList(function (err, getLastInviteListResult) {
    if (err) {
      res.json(err);
    }
    else {
      res.json(getLastInviteListResult);
    }
  });
};

exports.renderListWizard = function (req, res) {

  sess = req.session;
  // don't let nameless people view the dashboard, redirect them back to the homepage
  if (typeof sess.username == 'undefined') res.redirect('/');
  else {
    let json = {
      GroupCategory: 'Department'
    }
    InviteListModel.getGroups(json, function (err, getDepartmentsResult) {
      if (err) {
        res.end()
      } else {
        let json = {
          GroupCategory: 'Division'
        }
        InviteListModel.getGroups(json, function (err, getDivisionsResult) {
          if (err) {
            res.end()
          } else {
            let json = {
              GroupCategory: 'SiteLocation'
            }
            InviteListModel.getGroups(json, function (err, getSiteLocationsResult) {
              if (err) {
                res.end()
              } else {
                let json = {
                  GroupCategory: 'Building'
                }
                InviteListModel.getGroups(json, function (err, getBuildingsResult) {
                  if (err) {
                    res.end()
                  } else {
                    InviteListModel.getDistributionLists(function (err, getDistributionListsResult){
                      if (err){
                        res.end()
                      } else {
                        InviteListModel.getDistributionListMembers(function (err, getDistributionListMembersResult){
                          if (err){
                            res.end()
                          } else {
                            res.render('ListWizardView', { title: 'Command Center - Create Invite List', username: req.session.username, getDepartmentsResult, getDivisionsResult, getSiteLocationsResult, getBuildingsResult, getDistributionListsResult,getDistributionListMembersResult  });
                          }
                        })
                        
                      }
                    })
                    
                  }
                })
              }
            })
          }
        })
      }
    })
  }
}

exports.getPeopleByGroup = function (req, res) {
  InviteListModel.getPeopleByGroup(req.params.groupCategory, req.params.groupName, function (err, getPeopleByGroupResult) {
    if (err) {
      res.json(err);
    } else {
      res.json(getPeopleByGroupResult)
    }
  })
}


//*************************** Microsoft Graph API Methods ************************************ */

exports.truncateDistributionList = function (req, res) {
  InviteListModel.truncateDistributionList(function (err, truncateListResult) {
    if (err) {
      res.json(err);
    } else {
      res.json(truncateListResult);
    }
  })
}

exports.truncateDistributionListMembers = function (req, res) {
  InviteListModel.truncateDistributionListMembers(function (err, truncateListResult) {
    if (err) {
      res.json(err);
    } else {
      res.json(truncateListResult);
    }
  })
}

exports.postDistributionList = function (req, res) {
  InviteListModel.postDistributionList(req.body, function (err, postDistributionListResult) {
    if (err) {
      res.json(err);
    } else {
      res.json(postDistributionListResult);
    }
  })
}

exports.postDistributionListMembers = function (req, res) {

  console.log('postDistrubutionListMembers called');

  InviteListModel.postDistributionListMembers(req.body, function (err, postDistributionListMembersResult) {
    if (err) {
      res.json(err);
    } else {
      res.json(postDistributionListMembersResult);
    }
  })
}

exports.getDistributionListMembers = function (req, res) {
  InviteListModel.getDistributionListMembers(function (err, getDistributionListMembersResult) {
    if (err) {
      res.json(err);
    } else {
      res.json(getDistributionListMembersResult)
    }
  })
}

