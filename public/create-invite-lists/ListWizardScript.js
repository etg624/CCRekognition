function loadScripts() {

    /////////////////////////////////////////// Global Variables

    var button = document.getElementById('button');
    button.addEventListener('click', function () {
        buttonPressed();
    })

    var backButton = document.getElementById('backButton');
    backButton.addEventListener('click', function () {
        backButtonPressed();
    })

    var yesButton = document.getElementById('yesButton');
    yesButton.addEventListener('click', function () {
        yesButtonPressed();
    })

    var noButton = document.getElementById('noButton');
    noButton.addEventListener('click', function () {
        noButtonPressed();
    })

    var groupCategoryDropdown = document.getElementById('groupCategoryDropdown');

    var groupNameDropdown = document.getElementById('groupNameDropdown');

    var header = document.getElementById('header')

    var comment = document.getElementById('comment')

    var question = 0;

    var groupCategory = '';

    var groupName = '';

    var yesSelected = false;

    var peopleList = [];

    var tableDiv = document.getElementById('tableDiv');

    var table = $('#table');

    table.on('check.bs.table', function (row, $element) {
        clearRow($element)
    });


    table.on('check-all.bs.table', function () {
        clearSelections();
    });




    /////////////////////////////////////////// Functions

    function clearRow(row) {

        table.bootstrapTable('removeByUniqueId', row.ID);
        table.bootstrapTable('refreshOptions', {
            pageSize: 10,
            sortName: 'LastName'
        });

        // empty the peopleList incase there are any duplicates, then re-add the data    
        peopleList = [];
        var newData = table.bootstrapTable('getData');
        peopleList.push(newData);
        table.bootstrapTable('refreshOptions', {
            pageSize: 10,
            sortName: 'LastName'
        });
    }

    function clearSelections() {
        var selections = table.bootstrapTable('getSelections');

        for (i = 0; i < selections.length; i++) {
            var selection = selections[i];
            table.bootstrapTable('removeByUniqueId', selection.ID);
        }
        peopleList = [];
        var newData = table.bootstrapTable('getData');
        peopleList.push(newData);

        table.bootstrapTable('refreshOptions', {
            pageSize: 10,
            sortName: 'LastName'
        });

    }

    function clearAll() {
        var data = table.bootstrapTable('getData');

        for (i = 0; i < data.length; i++) {
            var selection = data[i];
            table.bootstrapTable('removeByUniqueId', selection.ID);
        }
        peopleList = [];
        table.bootstrapTable('refreshOptions', {
            pageSize: 10,
            sortName: 'LastName'
        });
    }

    function createID() {
        var newID = Math.random().toString(36).substr(2, 9);
        return newID;
    }

    function yesButtonPressed() {
        yesSelected = true;
        checkOption();
    }

    function noButtonPressed() {
        yesSelected = false;
        checkOption();
    }

    function backButtonPressed() {
        question--;
        checkQuestion();
    }

    function buttonPressed() {

        if (question == 1) {
            if (groupCategoryDropdown.value == '') {
                bootbox.alert('Please select a choice from the dropdown.')
            } else {
                question++
                checkQuestion();
            }
        } else if (question == 3) {
            if (groupNameDropdown.value == '') {
                bootbox.alert('Please select a choice from the dropdown.')
            } else {
                question++
                checkQuestion();
            }
        } else {
            question++;
            checkQuestion();
        }
    }

    function checkQuestion() {
        if (question == 0) {
            groupCategoryDropdown.style.display = 'none';
            backButton.style.display = 'none'
            button.style.display = 'block';
            tableDiv.style.display = 'none';
            clearAll();

            button.innerText = 'Begin'
            comment.innerText = 'You can follow this wizard to quickly create an invite list.'
        }
        else if (question == 1) {
            groupCategoryDropdown.style.display = 'block';
            backButton.style.display = 'block';
            button.style.display = 'block';
            noButton.style.display = 'none'
            yesButton.style.display = 'none'

            button.innerText = 'Next'
            comment.innerText = 'What do you want to add to the list?'
        } else if (question == 2) {
            groupCategoryDropdown.style.display = 'none';
            groupNameDropdown.style.display = 'none';
            tableDiv.style.display = 'none';
            backButton.style.display = 'block';
            button.style.display = 'block';

            button.innerText = 'Next'
            comment.innerText = 'You are making a list for a ' + groupCategoryDropdown.value + '.';
            groupCategory = groupCategoryDropdown.value;
        } else if (question == 3) {

            if (groupCategory != 'Office 365 Distribution List') {
                getGroups();
                tableDiv.style.display = 'block';
            } else {
                getDistributionLists();
            }



            backButton.style.display = 'block'
            button.style.display = 'block';
            groupNameDropdown.style.display = 'block';
            noButton.style.display = 'none'
            yesButton.style.display = 'none'
            tableDiv.style.display = 'none';
            

            comment.innerText = 'Which ' + groupCategory + ' do you want to add?'
        } else if (question == 4) {
            groupName = groupNameDropdown.value;

            if (groupCategory != 'Office 365 Distribution List') {
                getPeople();
                
            } else {
                getDistributionListMembers();
            }            
            

            backButton.style.display = 'none'
            button.style.display = 'none';
            groupNameDropdown.style.display = 'none';
            noButton.style.display = 'block'
            yesButton.style.display = 'block'
            tableDiv.style.display = 'block';

            comment.innerText = 'Do you want to add any other groups?'
        } else if (question == 5) {
            prompt();
        }
    }

    function checkOption() {

        console.log(question);
        console.log(yesSelected);

        if (question == 4) {
            if (yesSelected) {
                question = 1;
                checkQuestion();
            } else {
                question++;
                checkQuestion();
            }
        }
    }

    function getGroups() {
        if (groupCategory == 'Department') {

            for (i = groupNameDropdown.options.length - 1; i >= 0; i--) {
                groupNameDropdown.remove(i);
            }

            for (i = 0; i < departments.length; i++) {
                var option = document.createElement("option");
                option.text = departments[i].Department;
                option.value = departments[i].Department;
                groupNameDropdown.appendChild(option);
            }


        } else if (groupCategory == 'Division') {

            for (i = groupNameDropdown.options.length - 1; i >= 0; i--) {
                groupNameDropdown.remove(i);
            }

            for (i = 0; i < divisions.length; i++) {
                var option = document.createElement("option");
                option.text = divisions[i].Division;
                option.value = divisions[i].Division;
                groupNameDropdown.appendChild(option);
            }

        } else if (groupCategory == 'Site Location') {

            for (i = groupNameDropdown.options.length - 1; i >= 0; i--) {
                groupNameDropdown.remove(i);
            }

            for (i = 0; i < siteLocations.length; i++) {
                var option = document.createElement("option");
                option.text = siteLocations[i].SiteLocation;
                option.value = siteLocations[i].SiteLocation;
                groupNameDropdown.appendChild(option);
            }

        } else if (groupCategory == 'Building') {

            for (i = groupNameDropdown.options.length - 1; i >= 0; i--) {
                groupNameDropdown.remove(i);
            }

            for (i = 0; i < buildings.length; i++) {
                var option = document.createElement("option");
                option.text = buildings[i].Building;
                option.value = buildings[i].Building;
                groupNameDropdown.appendChild(option);
            }

        }
    }

    function getDistributionLists() {


        for (i = groupNameDropdown.options.length - 1; i >= 0; i--) {
            groupNameDropdown.remove(i);
        }
        for (i = 0; i < distributionLists.length; i++) {
            var option = document.createElement("option");
            option.text = distributionLists[i].ListName;
            option.value = distributionLists[i].ListName;
            groupNameDropdown.appendChild(option);
        }

    }

    function getDistributionListMembers(){
        for (i = 0; i < distributionListMembers.length; i++) {
            let person = distributionListMembers[i];
            
            console.log('logging from getDistributionListMembers')
            console.log(person);

            var data = ({

                LastName: person.LastName,
                FirstName: person.FirstName,
                Cardnumber: 99999999,
                ID: 99999999,
                Email: person.EmailAddress,
                Title: '',
                Department: '',
                Division: '',
                SiteLocation: '',
                Building: ''
            })

            table.bootstrapTable('append', data);
            table.bootstrapTable('refreshOptions', {
                pageSize: 10,
                sortName: 'LastName'
            });

            // empty the peopleList incase there are any duplicates, then re-add the data
            peopleList = [];
            var newData = table.bootstrapTable('getData');
            peopleList.push(newData);


        }
        table.bootstrapTable('refreshOptions', {
            pageSize: 10,
            sortName: 'LastName'
        });
    }

    function getPeople() {

        let xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("GET", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/listwizard/" + groupCategory + '/' + groupName, true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(null);

        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {

                    var json = JSON.parse(xhr.responseText);

                    for (i = 0; i < json.length; i++) {
                        let person = json[i];
                        var data = ({

                            LastName: person.LastName,
                            FirstName: person.FirstName,
                            Cardnumber: person.iClassNumber,
                            ID: person.EmpID,
                            Email: person.EmailAddr,
                            Title: person.Title,
                            Department: person.Department,
                            Division: person.Division,
                            SiteLocation: person.SiteLocation,
                            Building: person.Building
                        })

                        table.bootstrapTable('append', data);
                        table.bootstrapTable('refreshOptions', {
                            pageSize: 10,
                            sortName: 'LastName'
                        });

                        // empty the peopleList incase there are any duplicates, then re-add the data
                        peopleList = [];
                        var newData = table.bootstrapTable('getData');
                        peopleList.push(newData);


                    }
                    table.bootstrapTable('refreshOptions', {
                        pageSize: 10,
                        sortName: 'LastName'
                    });
                    console.log(peopleList);

                }
            }
        };

    }

    function prompt() {
        bootbox.hideAll();

        bootbox.prompt("Enter a name for the invite list.", function (nameInput) {
            if (nameInput === null) {
                question--;
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

                        xhr.open("POST", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/postinvitelist", true);

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

        xhr.open("GET", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/lastinvitelist", true);

        xhr.send(null);

        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    var json = JSON.parse(xhr.responseText);
                    console.log(json);
                    var listID = json[0].InvitationListID;

                    console.log('logging peopleList');
                    console.log(peopleList);

                    for (i = 0; i < peopleList[0].length; i++) {
                        postInvitee(peopleList[0][i], listID);
                    }
                }
            }
        };
    }

    function postInvitee(person, listID) {
        console.log('logging person');
        console.log(person);

        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("POST", "http://ec2-34-215-115-69.us-west-2.compute.amazonaws.com:3000/postinvitee", true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            'InvitationListID': listID,
            'BadgeNumber': person.Cardnumber,
            'LastName': person.LastName,
            'FirstName': person.FirstName,
            'EmailAddress': person.Email

        }));


        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    question = 0;
                    checkQuestion();
                }
            }
        };


    }

}


