var datetime = require('./controllers/datetime');

var currentDateTime = datetime.syncCurrentDateTimeforDB()

  console.log(JSON.stringify(currentDateTime));
