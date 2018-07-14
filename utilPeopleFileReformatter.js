
/**
================================================================================================
                                        Declarations
================================================================================================ 
*/

var path = require ('path')
var fs = require('graceful-fs');
var csvParser = require('csv-parse');

const fileToReformat = "./public/"+process.argv[2]

/**
================================================================================================
                                        Common functions
================================================================================================ 
*/


    function writeReformattedFile ( fileToReformat, reformattedFileData ) {  

        const newFileToWrite = './public/reports/cardholderDataReformatted'+Date.now()+'.csv'

		fs.open(newFileToWrite, 'a', 666, function( e, id ) {

            if (e){console.log("People file reformatter utility: "+e)}
            else{
            
                //fs.appendFileSync(id, header + "\r\n", null, 'utf8')
                
                for (var i=0 ; i <reformattedFileData.length; i++){ 
                    line = reformattedFileData[i]
                    fs.appendFileSync(id, line + "\r\n", null, 'utf8')
                }

                fs.close(id, function(){
                    createLogEntry('People file reformatter utility: reformatted file '+newFileToWrite+' has been written.')
                    console.log('People file reformatter utility: reformatted file '+newFileToWrite+' has been written.')

                });
                }
		return
	});
    };

    
    function readFileAndReformat ( fileToReformat ) {  

        fs.readFile(fileToReformat, {
            //fs.readFile(req.body.fileName, {
                encoding: 'utf-8'
            }, function(err, csvData) {
                    if (err) {
                    console.log('People file reformatter utility: File not found.')
                    createLogEntry('People file reformatter utility: File not found.')
                    }

                    csvParser(csvData, {
                        delimiter: ',',
                        escape: "'"
                        //columns: true
                        }, function(err, dataReadFromFile) {
                        if (err) {
                        console.log(err);
                            console.log('People file reformatter utility: Problem parsing the CSV file.')
                            createLogEntry('People file reformatter utility: Problem parsing the CSV file.')
                        } else {
                            
                            var numberOfRowsToReformat = dataReadFromFile.length

                            var imageName = ""
                            var pathToRemoveFromImageName = 'C:'+'\\'+'Mobss Export'+'\\'


                            for (i=0; i<numberOfRowsToReformat; i++){

                                imageName= dataReadFromFile[i][5]

                                reformattedImageName = imageName.replace(pathToRemoveFromImageName, '')

                                dataReadFromFile[i][5] = reformattedImageName
                            }


                            writeReformattedFile (fileToReformat, dataReadFromFile)

                            //} // end of for loop through the csv file     
                        }; //feb--end of else in csvParser
                    }); //feb--end of csvParser 

        });
    }

    function createLogEntry ( param ) {  
        fs.open('./public/reports/utilities.log', 'a', 666, function( e, id ) {
        fs.appendFileSync(id, param + "\r\n", null, 'utf8')
        fs.close(id, function(){});
        return
    });
    };


    
/**
================================================================================================
                                        Execution
================================================================================================ 
*/    
var dateProgramInitiated = new Date()
createLogEntry('--')
createLogEntry(dateProgramInitiated + ' people file reformatting started.')
console.log ('People file reformatter utility: reformatted file '+fileToReformat+' being processed.')
createLogEntry('People file reformatter utility: reformatted file '+fileToReformat+' being processed.')

var reformattedFileData = readFileAndReformat (fileToReformat)


 

    