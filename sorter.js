var mysql = require('mysql');

var db = require('./models/db');



/////////////////////////////////////////////////////////////////////
//  Common module for sorting the attendance records by Operator
/////////////////////////////////////////////////////////////////////

var connection = mysql.createConnection({
      
      //user     : sess.username,
      //password : sess.password,
     
      host     : "localhost",
      user     : "root",
      password : "ms_root_XS12",
      database : "mobss"
       
    });


    connection.connect(function(err) {

    if (err) {
        console.log ("ERRRO")
    }else{


    _sqlQ ="select * from attendance where eventid=133";
    connection.query(_sqlQ, function(err, results) {
                //connection.release();
                if(err) { console.log('event query bad'+err); callback(true); connection.end(); return; }
            




    // Input if the attendance table.  sorts by the InTIme ASC 
    //var sortArray = results
    results.sort(function(a,b) {
        //if ( a.MobSSOperator < b.MobSSOperator )
        if ( b.MobSSOperator < a.MobSSOperator )
        
            return -1;
        //if ( a.MobSSOperator > b.MobSSOperator )
        if ( b.MobSSOperator > a.MobSSOperator )
        
            return 1;
        return 0;
    } );
    
    for (i=0; i<results.length; i++) {  
        console.log (JSON.stringify(results[i]))
        console.log ("BLANK")
        
    }

    })
    }
})

    
