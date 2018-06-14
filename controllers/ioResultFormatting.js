//###### Wed Apr 28 18:27:05 PDT 2018 Create Date for Common module for date reformat and sorting 

/////////////////////////////////////////////////////////////////////
//  Common function for reformating the InTime
/////////////////////////////////////////////////////////////////////
module.exports.reformatTimes = function (results){
  
  // Input is the jSON array from a SELECT * on the attendance table
  // Dates are text fields in h:mm am/pm format, which are not sortable
  // Add leading 0 for the single digit hours, then convert to 24h and remove am/pm.
  for (var j=0; j < results.length; j++) {                        
    
    var _InTime = results[j].InTIme

    //Pad times with leading zero if the hour is single digit
    if (_InTime.length < 8){_InTime = "0"+_InTime}
    
    var last2 = _InTime.slice(-2);
    var first2 = _InTime.slice(0,2);
    
    //if am, check for the midnight case and then remove the "am"
    if (last2 == "am"){
      switch (first2)
      {
        case '12':
          _InTime="00" + _InTime.slice(2)
          _InTime=_InTime.slice(0,-2)
          break;
     
              default:
              _InTime = _InTime.slice(0, -2);
      }

    }else{
      //for pm,  go to 24 hour clock and remove the "pm"
      switch (first2)
      {
        case '01':
          _InTime="13" + _InTime.slice(2)
          _InTime=_InTime.slice(0,-2)
          break;

        case '02':
          _InTime="14" + _InTime.slice(2)
          _InTime=_InTime.slice(0,-2)
          break;

        case '03':
          _InTime="15" + _InTime.slice(2)
          _InTime=_InTime.slice(0,-2)
          break;

        case '04':
          _InTime="16" + _InTime.slice(2)
          _InTime=_InTime.slice(0,-2)  
          break;

        case '05':
          _InTime="17" + _InTime.slice(2)
          _InTime=_InTime.slice(0,-2)                                
          break;

        case '06':
          _InTime="18" + _InTime.slice(2)
          _InTime=_InTime.slice(0,-2)     
          break;

        case '07':
          _InTime="19" + _InTime.slice(2)
          _InTime=_InTime.slice(0,-2)     
          break;

        case '08':
          _InTime="20" + _InTime.slice(2)
          _InTime=_InTime.slice(0,-2)     
          break;

        case '09':
          _InTime="21" + _InTime.slice(2)
          _InTime=_InTime.slice(0,-2)     
          break;

        case '10':
          _InTime="22" + _InTime.slice(2)
          _InTime=_InTime.slice(0,-2)     
          break;

        case '11':
          _InTime="23" + _InTime.slice(2)
          _InTime=_InTime.slice(0,-2)                                   
          break;

        case '12':
          _InTime="12" + _InTime.slice(2)
          _InTime=_InTime.slice(0,-2)
                                        
          break;
    

        default: 
      }


    }  
    results[j].InTIme = _InTime
  }
  
  return results
 
};  


/////////////////////////////////////////////////////////////////////
//  Common module for sorting the attendance records by InTime
/////////////////////////////////////////////////////////////////////
module.exports.resortByTime = function (results){
  // Input if the attendance table.  sorts by the InTIme ASC 
  var sortArray = results
  sortArray.sort(function(a,b) {
      if ( b.InTIme < a.InTIme ) // DESC order
      //if ( a.InTIme < b.InTIme ) // TODO ASC, didnt work - replicated 1 record in a list and left out another with the same InTIme
          return -1;
      if ( b.InTIme > a.InTIme ) // DESC order
      //if ( a.InTIme > b.InTIme ) // TODO ASC, didnt work - replicated 1 record in a list and left out another with the same InTIme
          return 1;
      return 0;
  } );
  
  return sortArray
};

/////////////////////////////////////////////////////////////////////
//  Common module for sorting the attendance records by Device
/////////////////////////////////////////////////////////////////////
module.exports.resortByDevice = function (results){
  // Input if the attendance table.  sorts by the InTIme ASC 
  var sortArray = results
  sortArray.sort(function(a,b) {
      if ( a.DeviceAuthCode < b.DeviceAuthCode )
          return -1;
      if ( a.DeviceAuthCode > b.DeviceAuthCode )
          return 1;
      return 0;
  } );
  
  return sortArray
};


/////////////////////////////////////////////////////////////////////
//  Common module for sorting the attendance records by Name
/////////////////////////////////////////////////////////////////////
module.exports.resortByName = function (results){
  // Input if the attendance table.  sorts by the InTIme ASC 
  var sortArray = results
  sortArray.sort(function(a,b) {
      if ( a.LastName < b.LastName )
          return -1;
      if ( a.LastName > b.LastName )
          return 1;
      return 0;
  } );
  
  return sortArray
};


/////////////////////////////////////////////////////////////////////
//  Common module for sorting the attendance records by Operator
/////////////////////////////////////////////////////////////////////
module.exports.resortByOperator = function (results){
  // Input if the attendance table.  sorts by the InTIme ASC 
  var sortArray = results
  sortArray.sort(function(a,b) {
      //if ( a.MobSSOperator < b.MobSSOperator )
      if ( b.MobSSOperator < a.MobSSOperator )
      
          return -1;
      //if ( a.MobSSOperator > b.MobSSOperator )
      if ( b.MobSSOperator > a.MobSSOperator )
      
          return 1;
      return 0;
  } );
  
  return sortArray
};

/////////////////////////////////////////////////////////////////////
//  Common module for sorting the attendance records by Device
/////////////////////////////////////////////////////////////////////
module.exports.resortByPoint = function (results){
  // Input if the attendance table.  sorts by the InTIme ASC 
  var sortArray = results
  sortArray.sort(function(a,b) {
      if ( a.MusterPoint < b.MusterPoint )
          return -1;
      if ( a.MusterPoint > b.MusterPoint )
          return 1;
      return 0;
  } );
  
  return sortArray
};
