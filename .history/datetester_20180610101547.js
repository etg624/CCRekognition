//feb--returns any date string or date object in mobss db format YYYY/MM/DD HH:MM:SS
dateTimeParm = new Date(); 
console.log('dateTimeParm ' + dateTimeParm);

  var dt = datetime.create(dateTimeParm);
  var formatted = dt.format('Y/m/d H:M:S');
// e.g. 04/28/2015 21:13:09 
  console.log('inside formatted ' + formatted);
  return formatted;
