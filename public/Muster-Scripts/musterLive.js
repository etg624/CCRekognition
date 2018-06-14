/**
 
    h6 Manual check-ins of unknowns: #{resTotalUnknown} //need to do api call
    h6 Check-ins with invalid cards: #{resTotalInvalid} //need to do api call
    h6 Known from Evac List: #{resTotalFromEvacList} // total - unknown - invalid 

 */

function initMap() {

    const evacContainer = parent.document.querySelector('#evacContainer');
    const evacPS = new PerfectScrollbar(evacContainer);
    const dataContainer = parent.document.querySelector('#dataContainer');
    const dataPS = new PerfectScrollbar(dataContainer);
    const titleContainer = parent.document.querySelector('#titleContainer');
    const titlePS = new PerfectScrollbar(titleContainer);
    const mainTitleContainer = parent.document.querySelector('#mainTitleContainer');
    const mainTitlePS = new PerfectScrollbar(mainTitleContainer);    
    

    // PARAMETERIZE the map center so that customer can set this up when they 
    // define a muster
    //var center = {lat: 34.0259013, lng: -118.3755216};
    var center = {lat: centerLat, lng: centerLng};

    var map = new google.maps.Map(document.getElementById('map'), {
    styles: mapStyle,
    zoom: 16,
    center: center,
    mapTypeId: google.maps.MapTypeId.MAP
    });

    //Loop through the array containing all the muster points and associated counts					 
    for (i = 0 ; i < data.length ; i++){
        var lat = data[i].Lat;
        var lng = data[i].Lng;
        var count = data[i].count;
        var pointID = data[i].PointID;


        //VARIABLES showing the data.PointID and data.Count for each element of the
        //resz2 array should be inserted here.   Presumably this should be inside the loop
        var windowString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<div id="firstHeading" class="firstHeading" style="color:#000">'+data[i].PointID+' |   <span style = "font-weight: bold">'+ data[i].count + '</span></div>'+
        '<div id="bodyContent">'+
        '</div>'+
        '</div>';
        
        var marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        title: 'count'
        });
        
        var markerWindow = new SnazzyInfoWindow({
        marker: marker,
        content: windowString,
        showCloseButton: false,
        offset: {
        top: '-50px',
        }
        });

        markerWindow.open(map, marker);						
        }

    setTextButton();

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
        
        //###### Tue June 05 08:29:13 PDT 2018 - parameterize server address for sms
        xhr.open("POST", serverAddress + "/sendsmsalert", true); // Works


        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "MusterID": musterID
        }));

    }

}