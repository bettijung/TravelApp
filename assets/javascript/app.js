// var searchRadiusInMile = 20;
// var searchLocality;
// var searchBox;
// var searchCoords;

// const sigicApiKey = '3P9NEojUHh6edkJe8BCkP9Z8AAGbr9S57YAFEMqq';
// const sigicURLBase = 'https://api.sygictravelapi.com/1.0/en/places/';

// const KMToDegreesAt0 = 0.008983152841195214;
// const milePerKM = 0.62137;
// const KMPerMile = 1.60934;

// const degreePerKM   = 0.0090090090;
// const degreePerMile = 0.0144927536;

// //https://stackoverflow.com/questions/238260/how-to-calculate-the-bounding-box-for-a-given-lat-lng-location
// function deg2rad(degrees) {
//     return Math.PI * degrees / 180.0;
// }

// function rad2deg(radians) {
//     return 180.0 * radians / Math.PI;
// }

// function createBbKM(coords, deltaKM) {
//     var deltaLat = deltaKM * KMToDegreesAt0;
//     var deltaLng = deltaLat / Math.cos(deg2rad(coords.lat));

//     var A = [
//         coords.lat - deltaLat, // south
//         coords.lng - deltaLng, // west
//         coords.lat + deltaLat, // north
//         coords.lng + deltaLng  // east
//     ];
//     return A.join(',');
// }

// function createBbMile(coords, deltaMi) {
//     return createBbKM(coords, deltaMi * KMPerMile);
// }

// function getCoordsFromTown(town) {
//     const googleAPI =
//         'https://maps.googleapis.com/maps/api/geocode/json?' +
//         $.param({
//             address: town,
//             components: 'locality',
//             key: 'AIzaSyBbdcRWUQOhcj0qb2eCc-bzNBuGOfN_32k'
//         });

//     let request = new XMLHttpRequest();
//     request.open('GET', googleAPI, false); // `false` makes the request synchronous
//     request.send(null);

//     if (request.status === 200) {
//         let Coords=JSON.parse(request.responseText).results[0].geometry.location;
//         //let ret={lat: Coords.lat, lng: Coords.lng };
//         return {lat: Coords.lat, lng: Coords.lng };
//     }
//     return null;
// }

// function callAjax(queryURL, apiKey, addToURL, apiParam, apiSuccess) {
//     var queryURLComplete = queryURL + addToURL + '?' + $.param(apiParam);
//     console.log(queryURLComplete);

//     $.ajax({
//         url: queryURLComplete,
//         beforeSend: function(xhr) {
//             xhr.setRequestHeader('x-api-key', apiKey);
//         },
//         success: apiSuccess
//     });
// }

//["0"].thumbnail_url
// --------------------------------------------------------
// Begin App
// --------------------------------------------------------

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCVaElevwp7UucKLxa8upUiILDGpqSK7c4",
    authDomain: "our-travel.firebaseapp.com",
    databaseURL: "https://our-travel.firebaseio.com",
    projectId: "our-travel",
    storageBucket: "our-travel.appspot.com",
    messagingSenderId: "1005789384165"
};

firebase.initializeApp(config);

let dbRef = firebase.database().ref('TravelerInputs/users');

// =========================================================
let actMap 
const sigicURLBase = "https://api.sygictravelapi.com/1.0/en/places/list?"
var city = null;
var gate = 0;
let cityInput = null
const sigicApiKey = "3P9NEojUHh6edkJe8BCkP9Z8AAGbr9S57YAFEMqq"

$(document).ready(function(){
    
    //modal trigger
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('#modal1').modal();
    $("#map-card").hide()

});

$(".googSubmit").on("click", function() {

    let email = $("#email").val().trim();
    let password = $("#password").val().trim();

    $("#log-in").html("Switch User");

    $("#email").val("");
    $("#password").val("");

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    });

    firebase.auth().onAuthStateChanged(function(user) {

      if (user) {

        var user = firebase.auth().currentUser;
        var name, email, uid;
        // emailVerified

            if (user != null) {
              // name = user.displayName;
              email = user.email;
              // emailVerified = user.emailVerified;
              uid = user.uid;
            }

        console.log(uid);
        dbRef = dbRef + '/' + uid;
        console.log(dbRef);

        $(document).on("click", "#cityButton", citySearchInput)

      }

      else {


        $('#modal2').modal();

        console.log("No user is signed in.");
      }
    
    });
});


function startSearch () {
    $('html, body').animate({
        scrollTop: $(".city-card").offset().top
    }, 1000);
}


function getActivity () {
    $("#map-card").show()
	event.preventDefault();
    console.log(gate);
    $("#map-id").empty();
    $("#wiki-info").text();
	if (gate === 1) {
        city = getCityKey(cityInput);
        console.log(getCityKey(cityInput));
        console.log(city);
        var activityVal = "eating";

    } else {
        /*if (gate2 === 1) {
            gate2 = 0;
            var city = Math.floor(Math.random() * 10000) + 1;
        } else {*/
        var activityVal = $(this).attr("id").trim();
        var city = Math.floor(Math.random() * 1000) + 1;
        gate2 = 0;
    }

    console.log(city);
	console.log(activityVal);

    $("#img2").attr("src", "assets/images/"+activityVal+".jpeg");
    
	$.ajax({
        url: 'https://api.sygictravelapi.com/1.0/en/places/list?parents=city:'+city+'&categories='+ activityVal +'&limit=20',
        beforeSend: function(xhr) {
             xhr.setRequestHeader("x-api-key", sigicApiKey)
        }, success: function(response){
            console.log(response);
            //process the JSON data etc
            
            //creates an array with all of the points of interested (poi) objects within. Use pois[i].location to get coords
            const placesObj = response.data.places
            
            /*if (response.data.places.length === 0) {
                gate2 = 1
                console.log(response.data.places.length)
                return getActivity ()
            }*/

            var pois = [];

            for (var i = 0; i < placesObj.length; i++) {
                
                 pois[i] = placesObj[i];
            }

            console.log(pois)

            /* const actCoord = response.data.places["0"].location;
            console.log(actCoord)*/
            // placeholder for one poi coords
            latitude = pois[0].location.lat;
            console.log(latitude);

            longitude = pois[0].location.lng;
            console.log(longitude);

            let markerMap = displayActivityMap();

            let popupContent;

            let popupCity;

            //creates marker for each poi
            for (var i=0; i<pois.length; i++) {

                const activityIcon = L.icon({
                    iconUrl: "assets/images/marker.png",
                    iconSize: [38, 38],
                    iconAnchor: [22, 38],
                    popupAnchor: [-3, -76],
                });

                // pois[i].id = pois[i].name;

                console.log(pois[i].thumbnail_url);

                popupPic = pois[i].thumbnail_url;

                popupContent = "<p class=center>" + pois[i].name + "</p>" + "<img alt='' width=100px src=" + popupPic + ">";

                popupCity = pois[i].name_suffix;

                console.log(popupContent);

                L.marker([pois[i].location.lat, pois[i].location.lng], {icon: activityIcon}).addTo(markerMap).bindPopup(popupContent).openPopup();

            }

            // console.log(pois[0].id);
            // $(".leaflet-pane").removeControl(".leaflet-zoom-anim", "leaflet-touch-zoom");

            $(".leaflet-popup-content").css("cursor", "pointer");    

            $(".leaflet-popup-content").on("click", function () {
                console.log($(this).text());
                window.open('http://google.com/search?q='+ $(this).text() + ", " + popupCity);   
            });
  

        // wikipedia ajax call
        var cityName = pois["0"].name_suffix;
        cityName = cityName.split(", ");
        cityName = cityName[0];
        console.log(cityName);

            $.ajax({
            type: "GET",
            url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&redirects&prop=text&section=0&page="+cityName+"&callback=?",
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    
                    

                    var markup = data.parse.text["*"];
                    var blurb = $('<div></div>').html(markup);
         
                    // remove links as they will not work
                    blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
                    blurb.find('img').each(function() { $(this).replaceWith($(this).html()); });
         
                    // remove any references
                    blurb.find('sup').remove()
                        .find('img').remove()
                        .find('link').remove();
         
                    // remove cite error
                    blurb.find('.mw-ext-cite-error').remove();
                    $('#wiki-info').html($(blurb).find('p'));

                    //needs container with ID article
                   
         
                },
                error: function (errorMessage) {
                }
            });

            $('html, body').animate({
                scrollTop: $("#map-card").offset().top
            }, 1000);
        }


    });

    //Getting a (not ordered)cities list
	$.ajax({
        url: 'https://api.sygictravelapi.com/1.0/en/places/list?level=city&limit=50',
        beforeSend: function(xhr) {
             xhr.setRequestHeader("x-api-key", "3P9NEojUHh6edkJe8BCkP9Z8AAGbr9S57YAFEMqq")
        }, success: function(data){
            console.log(data);
            //process the JSON data etc
        }

	});

}

function displayActivityMap () {
    
    if (actMap != undefined) {
    actMap.remove();
    }

    actMap = L.map("map-id").setView([latitude, longitude], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF1bGFwZXJvdXRrYSIsImEiOiJjamN4bDg1b3MxMmNrMnlvNXI4ZjVtZ2gyIn0.8-6Dt5FcrIKpSddbhgUPOQ', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoicGF1bGFwZXJvdXRrYSIsImEiOiJjamN4bDg1b3MxMmNrMnlvNXI4ZjVtZ2gyIn0.8-6Dt5FcrIKpSddbhgUPOQ'
    }).addTo(actMap);

    actMap.scrollWheelZoom.disable();

    return actMap;

}

function citySearchInput() {

    console.log(dbRef);
    
    cityInput = $("#citySearch").val().trim();
    
    // converts the city input into a city code
    

    gate = 1;

    $('html, body').animate({
        scrollTop: $("#map-card").offset().top
    }, 1000);

    getActivity();

}

function getCityKey(searchLocality) {
    let City = 1359; // Timbuktu
    let Url = sigicURLBase +
        $.param({
            query: searchLocality,
            levels: 'city'
        });
    let request = new XMLHttpRequest();
    request.open('GET', Url, false); // `false` makes the request synchronous
    request.setRequestHeader("x-api-key", sigicApiKey);
    request.send(null);
    if (request.status === 200) {
//      console.log(JSON.parse(request.responseText).data.places[0]);
        City = JSON.parse(request.responseText).data.places[0].id.split(":")[1];
    }
    return City;
}


$(document).on("click", "#start-search", startSearch);


$(document).on("click", ".activity-btn", getActivity);


// $(document).on("click", "#cityButton", citySearchInput)


    







