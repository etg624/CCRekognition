var findMatches = {};

findMatches.find = function(arr,arr2){
    var matchArray = [];
    arr.sort();
    arr2.sort();
    for (var i = 0; i < arr.length; i++) {
      if (arr2.indexOf(arr[i]) > -1) {
        matchArray.push(arr[i]);
      }
    }
    return matchArray;

}

module.exports = findMatches;