
var path = require ('path')
var mysql = require('mysql');
//var fs  = require('fs');
var fs = require('graceful-fs');


/**
================================================================================================
                                        Variables
================================================================================================ 
*/
var empID = ""
var lastName = ""
var firstName = ""
var position = ""
var badgeID = ""
var imageName = ""
var lineToWrite =""

/**
================================================================================================
                                        Common functions
================================================================================================ 
*/

    function formatLine ( i ) {  
		empID = i+","
        lastName = "Decimus Meridius,"
        firstName = "Maximus,"
        position = "General of the felix legions,"
        badgeID = i+","
        imageName = "myphoto.jpg"
        
        lineToWrite = empID+lastName+firstName+position+badgeID+imageName
		
		return lineToWrite
    };

   	function writeFile ( line ) {  
		fs.open('./public/reports/cardholderTestData.txt', 'a', 666, function( e, id ) {

            if (e){console.log("People file generator utility: "+e)}
            else{
            
            for (var i=1 ; i <5000; i++){ 
                line = formatLine (i)
                fs.appendFileSync(id, line + "\r\n", null, 'utf8')
            }

            fs.close(id, function(){});
            }
		return
	});
    };

    
/**
================================================================================================
                                        Execution
================================================================================================ 
*/    

//EmpID,LastName,FirstName,POSITION,Badge ID,ImageName,PAYROLLID


writeFile ()
    
    
//WriteLine ("EmpID,LastName,FirstName,POSITION,Badge ID,ImageName")


 

    