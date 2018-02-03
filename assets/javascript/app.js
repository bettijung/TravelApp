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

// Create an array to save the saved city searches
const newSave = {};

//set Firebase reference path
let dbRef = firebase.database().ref('TravelerInputs');

// =========================================================
//Activity map
let actMap;
//For firebase storage, capture saved city from different inputs
let savedCity;

//API url for retrieve city with activities
const sygicURLBase = "https://api.sygictravelapi.com/1.0/en/places/list?"
var city = null;
var gate = 0;

//No city selected for call
let cityInput = null
//API key for Sygic
const sygicApiKey = "3P9NEojUHh6edkJe8BCkP9Z8AAGbr9S57YAFEMqq"

//First load
$(document).ready(function(){
    
    //modal trigger
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('#modal1').modal();
    $("#map-card").hide();
    $(".save-button").hide();
    $("#quote-scroll").hide();
    resetQuote();


//Change the navbar color on scrolling
    $(window).scroll(function() { 
        if ($(document).scrollTop() > 50) {
            $("nav").css({
            background: "white",
            opacity: 0.90,
          });
        }

        else {
          $("nav").css("background-color", "transparent");
        }
      });

});

//When user signs in, enable saves to firebase
$(".googSubmit").on("click", function() {

    email = $("#email").val().trim();
    password = $("#password").val().trim();

    $("#email").val("");
    $("#password").val("");

    if (email !="" && password !="") {

        $("#log-in").html("Switch User");

        $(".save-button").show();

//Create user with email and password
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

        });
//If a user is signed in, allow storage to firebase
        firebase.auth().onAuthStateChanged(function(user) {
//For use with mutliple user, user-specific saves
            // if (user) {
            //     var user = firebase.auth().currentUser;
            //     var email, uid;
            //     // emailVerified

            //     if (user != null) {
            //         // name = user.displayName;
            //         email = user.email;
            //         // emailVerified = user.emailVerified;
            //         uid = user.uid;   

//On save button click, push save to DB
                    $(".save-button").on("click", function () {

                        event.preventDefault();

                        console.log(savedCity);
                        
                        const newSave = {
                            name: savedCity
                        }

                        dbRef.push(newSave);

                    });

//On child-added, take DB snapshot
                    dbRef.on("child_added", function(childSnapshot, prevChildKey) {

                        const newSave = childSnapshot.val();

                        $(".saved-searches").append(createButtons(newSave));
                    }, 

//Handle errors
                    function(errorObject) {
                        console.log("Errors handled; " + errorObject.code);
                    });

                    function createButtons(cities) {
                        const savedButtons = $(".saved-searches");
                        const savedCityBtn = $("<a>" + cities.name + "</a>");
                        savedCityBtn.addClass("btn waves-effect waves-light saved-city-btn");
                        savedButtons.append(savedCityBtn);
                    }
//For use with multiple users, user-specific saves
                // }

    //             else {
    //             // $('#modal2').modal();
    //             console.log("No user is signed in.");
    //             }
        
    //         }    
        });
    }
    // else {
    //     console.log("Email or password not entered.");
    // }

});


//On start button, auto scroll function
function startSearch () {
    $('html, body').animate({
        scrollTop: $("#start").offset().top
    }, 1000);
}

//Main app function, retrieves city data and populates info and map divs
function getActivity () {

    resetQuote();
    quote = getQuote();
    console.log(quote);
    $("#quotes").val("");
    $("#quotes").append(quote);
    $("#quote-scroll").show();

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
       
        var activityVal = $(this).attr("id").trim();
        activityVal = activityVal.split('-')
        activityVal = activityVal[0]
        console.log(activityVal)
        if (actMap === undefined) {
        let randomIndex = Math.floor(Math.random() * SygicCities.length);
        console.log(`randomIndex: ${randomIndex}`);
        let randomCity = SygicCities[randomIndex][0];
        console.log(`randomCity: ${randomCity}`);
        city = randomCity
        }
    }


    $("#img2").attr("src", "assets/images/"+ activityVal +".jpeg");
    
//Sygic API call for city data
	$.ajax({
        url: 'https://api.sygictravelapi.com/1.0/en/places/list?parents=city:'+ city +'&categories='+ activityVal +'&limit=20',
        beforeSend: function(xhr) {
             xhr.setRequestHeader("x-api-key", sygicApiKey)
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
                    iconAnchor: [19, 38],
                    popupAnchor: [-3, -76],
                });

                /*let poisRating = pois[i].rating
                console.log(poisRating)
                let ratingRadius = poisRating * 10*/
                
               /* <svg id="mySVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"/>
                let svgCont = $("<svg>")
                svgCont.attr({
                                target:"nw", 
                                title:"Opens in a new window"
                            });*/
               /* let svgNS = "http://www.w3.org/2000/svg";  
                let myCircle
                        function createCircle()
                        {
                            var myCircle = document.createElementNS(svgNS,"circle"); //to create a circle. for rectangle use "rectangle"
                            myCircle.setAttributeNS(null,"id","mycircle");
                            myCircle.setAttributeNS(null,"cx",100);
                            myCircle.setAttributeNS(null,"cy",100);
                            myCircle.setAttributeNS(null,"r",ratingRadius);
                            myCircle.setAttributeNS(null,"fill","black");
                            myCircle.setAttributeNS(null,"stroke","none");

                        }   */
                
                console.log(pois[i].thumbnail_url);
                console.log(pois[i].name);

// Saving city text for firebase storage
                savedCity = pois[i].name_suffix;
                console.log(savedCity);

//popUps on map, add to markers on leaflet tile
                let popupPic;

                if (pois[i].thumbnail_url != null) {
                    popupPic = pois[i].thumbnail_url;
                }

                else {
                    popupPic = "assets/images/tourism.png";
                }

                popupContent = "<p class=center>" + pois[i].name + "</p>" + "<img alt='' width=100px src=" + popupPic + /*"rating" + myCircle + */">";

                popupCity = pois[i].name_suffix;

                console.log(popupContent);

                L.marker([pois[i].location.lat, pois[i].location.lng], {icon: activityIcon}).addTo(markerMap).bindPopup(popupContent).openPopup();

            }

            // console.log(pois[0].id);
            // $(".leaflet-pane").removeControl(".leaflet-zoom-anim", "leaflet-touch-zoom");

            $(".leaflet-popup-content").css("cursor", "pointer");

            $(".leaflet-popup-content").addClass("center");

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
            url: "https://en.wikipedia.org/w/api.php?action=parse&format=json&redirects&prop=text&section=0&page="+ cityName +"&callback=?",
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
                scrollTop: $(".scroll-to").offset().top
            }, 1000);

        }


    });

    //Getting a (not-ordered) cities list
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

//Use leaflet and mapbox to display a map using the lat/lon from the Sygic call
function displayActivityMap () {
    
    if (actMap != undefined) {
        actMap.remove();
    }

    actMap = L.map("map-id").setView([latitude, longitude], 15);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF1bGFwZXJvdXRrYSIsImEiOiJjamN4bDg1b3MxMmNrMnlvNXI4ZjVtZ2gyIn0.8-6Dt5FcrIKpSddbhgUPOQ', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoicGF1bGFwZXJvdXRrYSIsImEiOiJjamN4bDg1b3MxMmNrMnlvNXI4ZjVtZ2gyIn0.8-6Dt5FcrIKpSddbhgUPOQ'
    }).addTo(actMap);

    actMap.scrollWheelZoom.disable();

    return actMap;

}

//Capture city name from user input in city search
function citySearchInput() {

    resetQuote();
    
    cityInput = $("#citySearch").val().trim();

    savedCity = $("#citySearch").val().trim();
    console.log(savedCity);
    // converts the city input into a city code
    gate = 1;

    $('html, body').animate({
        scrollTop: $(".scroll-to").offset().top
    }, 1000);

    getActivity();

}

//Attach numeric city value to city for Sygic call
function getCityKey(searchLocality) {
    let City = 1359; // Timbuktu
    let Url = sygicURLBase +
        $.param({
            query: searchLocality,
            levels: 'city'
        });
    let request = new XMLHttpRequest();
    request.open('GET', Url, false); // `false` makes the request synchronous
    request.setRequestHeader("x-api-key", sygicApiKey);
    request.send(null);
    if (request.status === 200) {
//      console.log(JSON.parse(request.responseText).data.places[0]);
        City = JSON.parse(request.responseText).data.places[0].id.split(":")[1];
    }
    return City;
}

//Get a random quote from quotes.js file 
function getQuote () {

    let rQ = Math.floor((Math.random() * quotesArray.length));
    let quote = quotesArray[rQ];

    console.log(quote);
    return quote;
}

//Empty quote div for repopulation
function resetQuote () {
    $("#quotes").html("");
}

//Auto scroll to first user input
$(document).on("click", "#start", startSearch);

//API Calls, map population after user input
$(document).on("click", ".activity-btn", getActivity);

//Capture city if user input is through search instead of click
$(document).on("click", "#cityButton", citySearchInput);

//Repopulate search field and auto scroll if saved city button clicked
$(document).on("click", ".saved-city-btn", function () {
    console.log($(this).text());
    let reSearch = $(this).text();
    $("#citySearch").val(reSearch);

    $('html, body').animate({
        scrollTop: $(".card-content").offset().top
    }, 1000);

});

// ------------------------------------


//Firebase rules for use with mutliple users, user-specific save
// {
//   "rules": {
//     "users": {
//       "$user_id": {
//         ".read": "auth != null",
//         ".write": "auth != null"
//       }
//     },
//     "city": {
//       ".read": "auth != null",
//       ".write": "auth != null"
//     }
//   }
// }


// var searchRadiusInMile = 20;
// var searchLocality;
// var searchBox;
// var searchCoords;

// const sygicApiKey = '3P9NEojUHh6edkJe8BCkP9Z8AAGbr9S57YAFEMqq';
// const sygicURLBase = 'https://api.sygictravelapi.com/1.0/en/places/';

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