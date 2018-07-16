function loadScripts() {

    var createButton = document.getElementById('createButton');
    createButton.addEventListener('click', function () {
        console.log('logging dataArray')
        console.log(dataArray);
        prompt();


    })


    function prompt() {
        bootbox.hideAll();

        bootbox.prompt("Enter a name for the invite list.", function (nameInput) {
            if (nameInput === null) {
            } else {
                var cleanNameInput = nameInput.replace(/[^a-zA-Z0-9 ]/g, "");
                bootbox.prompt('Enter a description for the invite list.', function (descriptionInput) {
                    if (descriptionInput === null) {

                    } else {
                        var cleanDescriptionInput = descriptionInput.replace(/[^a-zA-Z0-9 ]/g, "");

                        let xhr = new XMLHttpRequest();

                        if (!xhr) {
                            alert('Giving up :( Cannot create an XMLHTTP instance');
                            return false;
                        }

                        xhr.open("POST", "https://convoyer.mobsscmd.com/postinvitelist", true);

                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.send(JSON.stringify({
                            "ListName": cleanNameInput,
                            "ListComment": cleanDescriptionInput
                        }));

                        xhr.onload = function () {
                            if (xhr.readyState === xhr.DONE) {
                                if (xhr.status === 200) {
                                    getLastInviteList();
                                }
                            }
                        };



                        bootbox.hideAll();

                        bootbox.alert('Invite list has been created!');
                    }
                });

            }
        });
    }


    function getLastInviteList() {

        let xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("GET", "https://convoyer.mobsscmd.com/lastinvitelist", true);

        xhr.send(null);

        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    var json = JSON.parse(xhr.responseText);
                    console.log(json);
                    var listID = json[0].InvitationListID;
                    for (i = 0; i < dataArray.length; i++) {

                        postList(dataArray[i], listID);
                    }
                }
            }
        };
    }


    function postList(person, listID) {

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("POST", "https://convoyer.mobsscmd.com/postinvitee", true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            'InvitationListID': listID,
            'BadgeNumber': person.Cardnumber,
            'LastName': person.LastName,
            'FirstName': person.FirstName,
            'EmailAddress': person.EmailAddress

        }));
    }


    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

}


