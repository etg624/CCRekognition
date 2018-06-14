

function test(){
                bootbox.confirm({ 
                    size: "small",
                    message: "Are you sure you want to Sync to PACS?", 
                    callback: function(result){
                        /* result is a boolean; true = OK, false = Cancel*/ 
                        if (result) {


                            var xhr = new XMLHttpRequest();
                            if (!xhr) {
                                alert("Cannot create an XMLHTTP instance");
                                return false;
                            }
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == XMLHttpRequest.DONE) {
                                    console.log("logging PACSImport response: " + xhr.responseText);
                                    let json = JSON.parse(xhr.responseText);
                                }
                            }
                            xhr.open("GET", "http://localhost:3000/PACSImport", true);
                            xhr.setRequestHeader("Content-Type", "application/json");
                            xhr.send(null);
  
                               
                        } else {
                                // if CANCEL is clicked, do the following
                        }
                        }
                })
            }
