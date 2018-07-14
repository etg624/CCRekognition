
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
        lastName = "Decimus Meridius" +i+","
        firstName = "Maximus"+i+","
        position = "General of the felix legion - Battalion "+i+ ","
        badgeID = i+","
        imageName = "t"+i+".jpg"
        
        lineToWrite = empID+lastName+firstName+position+badgeID+imageName
		
		return lineToWrite
    };

    function formatHeader () {  
        var headerToWrite="empID,lastName,firstName,position,badgeID,imageName"  
        
		return headerToWrite
    };


    function writeFile ( numberOfPhotosToGenerate ) {  
		fs.open('./public/reports/cardholderTestData'+Date.now()+'.csv', 'a', 666, function( e, id ) {

            if (e){console.log("People file generator utility: "+e)}
            else{
            
            header = formatHeader ()
            fs.appendFileSync(id, header + "\r\n", null, 'utf8')
            
            for (var i=1 ; i <numberOfPhotosToGenerate+1; i++){ 
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
const numberOfPhotosToGenerate = parseInt(process.argv[2])
writeFile (numberOfPhotosToGenerate)
    
    
//WriteLine ("EmpID,LastName,FirstName,POSITION,Badge ID,ImageName")


 

    