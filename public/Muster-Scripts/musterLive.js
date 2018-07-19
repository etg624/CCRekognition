/**
 
    h6 Manual check-ins of unknowns: #{resTotalUnknown} //need to do api call
    h6 Check-ins with invalid cards: #{resTotalInvalid} //need to do api call
    h6 Known from Evac List: #{resTotalFromEvacList} // total - unknown - invalid 

 */

function initMap() {

    var totalAttendance = 0;
    var knownAttendance = 0;
    var unknownAttendance = 0;
    var invalidAttendance = 0;
    var unaccountedAttendance = 0;
    var markers = [];
    var markerWindows = [];

    setDataTables();
    setTextButton();

    var center = { lat: centerLat, lng: centerLng };
    var map = new google.maps.Map(document.getElementById('map'), {
        styles: mapStyle,
        zoom: 16,
        center: center,
        mapTypeId: google.maps.MapTypeId.MAP
    });

    console.log('logging musterData at top');
    console.log(musterData);

    //Loop through the array containing all the muster points and associated counts					 
    for (i = 0; i < musterData.length; i++) {
        console.log('logging musterData');
        console.log(musterData);
        var lat = musterData[i].lat;
        var lng = musterData[i].lng;
        console.log('logging lat and lng');
        console.log(lat);
        console.log(lng);
        var count = musterData[i].count;
        var pointID = musterData[i].PointID;
        //VARIABLES showing the musterData.PointID and musterData.Count for each element of the
        //resz2 array should be inserted here.   Presumably this should be inside the loop
        var windowString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<div id="firstHeading" class="firstHeading" style="color:#000">' + musterData[i].PointID + ' |   <span style = "font-weight: bold">' + musterData[i].count + '</span></div>' +
            '<div id="bodyContent">' +
            '</div>' +
            '</div>';

        try {

            console.log('logging lat and lng');
            console.log(lat);
            console.log(lng);

            if (lat && lng) {
                var marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: map,
                    title: 'count'
                });
            }


        } catch (e) {
            console.log(e);
        }



        var markerWindow = new SnazzyInfoWindow({
            marker: marker,
            content: windowString,
            showCloseButton: false,
            offset: {
                top: '-50px',
            }
        });

        markerWindow.open();

        markers.push(marker);
        markerWindows.push(markerWindow);
    }

    setInterval(function () {

        console.log('set interval function called');
        console.log(musterID);

        getUnknowns();

    }, 5000);


    function getTotalAttendance() {

        //THIRD FUNCTION CALLED

        var xhr = new XMLHttpRequest();

        if (!xhr) {

            console.log('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var attendanceData = JSON.parse(xhr.responseText);


                knownAttendance = attendanceData.length - unknownAttendance - invalidAttendance;
                totalAttendance = knownAttendance + unknownAttendance + invalidAttendance;

                var knownsLabel = document.getElementById('knowns');
                knownsLabel.innerText = knownAttendance;

                var totalCountedLabel = document.getElementById('totalCounted');
                totalCountedLabel.innerText = totalAttendance;

                getUnaccounted();

                for (var i = 0; i < attendanceData.length; i++) {

                    var entryBadge = document.getElementById('badge ' + attendanceData[i].iClassNumber);
                    var entryFirst = document.getElementById('first ' + attendanceData[i].iClassNumber);
                    var entryLast = document.getElementById('last ' + attendanceData[i].iClassNumber);

                    try {

                        entryBadge.remove();
                        entryFirst.remove();
                        entryLast.remove();

                    } catch (e) {
                        console.log(e);
                    }
                }


            }
        }

        xhr.open("GET", "https://convoyer.mobsscmd.com/musterAttendance/" + musterID, true);
        xhr.send(null);

    }

    function getUnknowns() {

        //FIRST FUNCTION CALLED

        var xhr = new XMLHttpRequest();

        if (!xhr) {

            console.log('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var data = JSON.parse(xhr.responseText);

                unknownAttendance = data.length;

                var unknownsLabel = document.getElementById('unknowns');

                unknownsLabel.innerText = data.length;

                console.log('logging unknownAttendance')
                console.log(unknownAttendance)

                getInvalids();
            }

        }

        xhr.open("GET", "https://convoyer.mobsscmd.com/musterUnknowns/" + musterID, true);
        xhr.send(null);
    }

    function getInvalids() {

        //SECOND FUNCTION CALLED

        var xhr = new XMLHttpRequest();

        if (!xhr) {

            console.log('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var data = JSON.parse(xhr.responseText);

                invalidAttendance = data.length;

                console.log('logging invalidAttendance')
                console.log(invalidAttendance)

                var invalidsLabel = document.getElementById('invalids');
                invalidsLabel.innerText = invalidAttendance;
                getTotalAttendance();
            }

        }

        xhr.open("GET", "https://convoyer.mobsscmd.com/musterInvalids/" + musterID, true);
        xhr.send(null);
    }

    function getUnaccounted() {


        //FOURTH FUNCTION CALLED

        var xhr = new XMLHttpRequest();

        if (!xhr) {

            console.log('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var data = JSON.parse(xhr.responseText);

                evacuationLength = data.length;

                console.log('logging evacuationLength');
                console.log(evacuationLength);

                unaccountedAttendance = evacuationLength - totalAttendance;

                var unaccountedLabel = document.getElementById('unaccounted');
                unaccountedLabel.innerText = unaccountedAttendance;

                updateProgressBar();
                updateMarkers();
            }

        }

        xhr.open("GET", "https://convoyer.mobsscmd.com/musterEvacuation/", true);
        xhr.send(null);
    }

    function updateProgressBar() {
        var overallProg = (evacuationLength - unaccountedAttendance) / evacuationLength * 100;
        var overallProgRound = overallProg.toFixed(0);
        var overallProgress = overallProg.toFixed(0) + '%';

        var progressBar = document.getElementById('progressBar');
        progressBar.removeAttribute('style');
        progressBar.style.setProperty('width', overallProgress);
        progressBar.innerText = (overallProgress)

    }

    function setDataTables() {

        const mainTitleContainer = parent.document.querySelector('#mainTitleContainer');
        const mainPS = new PerfectScrollbar(mainTitleContainer);

        const dataContainer = parent.document.querySelector('#dataContainer');
        const datPS = new PerfectScrollbar(dataContainer);

        const titleContainer = parent.document.querySelector('#titleContainer');
        const titlePS = new PerfectScrollbar(titleContainer);

        const evacContainer = parent.document.querySelector('#evacContainer');
        const evacPS = new PerfectScrollbar(evacContainer);


    }

    function updateMarkers() {

        var xhr = new XMLHttpRequest();

        if (!xhr) {

            console.log('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var musterDataNew = JSON.parse(xhr.responseText);

                console.log('logging MusterDataNew');
                console.log(musterDataNew);
                console.log('logging markers');
                console.log(markers);

                for (var i = 0; i < markers.length; i++) {

                    if (markers.length > 1){
                        markers[i].setMap(null);
                        markers = [];
                    }

                }

                for (var i = 0; i < markerWindows.length; i++) {
                    markerWindows[i].close();
                    markerWindows = [];
                }

                for (i = 0; i < musterDataNew.length; i++) {

                    var lat = musterDataNew[i].lat;
                    var lng = musterDataNew[i].lng;
                    var count = musterDataNew[i].count;
                    var pointID = musterDataNew[i].PointID;

                    console.log('logging lat and lng in musterDataNew');
                    console.log(lat);
                    console.log(lng);

                    var windowString = '<div id="content">' +
                        '<div id="siteNotice">' +
                        '</div>' +
                        '<div id="firstHeading" class="firstHeading" style="color:#000">' + musterDataNew[i].PointID + ' |   <span style = "font-weight: bold">' + musterDataNew[i].count + '</span></div>' +
                        '<div id="bodyContent">' +
                        '</div>' +
                        '</div>';
                        try {

                            if (lat && lng) {
                                var marker = new google.maps.Marker({
                                    position: { lat: lat, lng: lng },
                                    map: map,
                                    title: 'count'
                                });
                            }
                
                
                        } catch (e) {
                            console.log(e);
                        }
                

                    var markerWindow = new SnazzyInfoWindow({
                        marker: marker,
                        content: windowString,
                        showCloseButton: false,
                        offset: {
                            top: '-50px',
                        }
                    });

                    markerWindow.open();

                    markers.push(marker);
                    markerWindows.push(markerWindow);
                }


            }

        }

        console.log('logging musterID');

        xhr.open("GET", "https://convoyer.mobsscmd.com/musterGetPoints/" + musterID, true);
        xhr.send(null);




    }

    function setTextButton() {
        var textButton = document.getElementById('textButton');
        textButton.addEventListener('click', function (e) {
            textUnaccounted();
        });
    }

    function textUnaccounted() {
        var xhr = new XMLHttpRequest();

        if (!xhr) {
            alert('Giving up :( Cannot create an XMLHTTP instance');
            return false;
        }

        xhr.open("POST", "https://convoyer.mobsscmd.com/sendsmsalert", true);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "MusterID": musterID
        }));

    }

}
