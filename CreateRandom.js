var CreateRandom = {};


CreateRandom.create = function () {

    var newID = Math.random().toString(36).substr(2, 9);
    return newID;
}

module.exports = CreateRandom;