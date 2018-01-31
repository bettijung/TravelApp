//["0"].thumbnail_url



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

const dbRef = firebase.database().ref('TravelerInputs/traveler');

// =========================================================

var city = null
var gate = 0
$(document).ready(function(){
      
    //modal trigger
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('#modal1').modal();
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

})



function getActivity () {


	event.preventDefault();
console.log(gate)
	if (gate === 1) {

        city = cityKey()
        console.log(cityKey())
        console.log(city)
        var activityVal = "eating"


    } else {

        var activityVal = $(this).attr("id").trim()
        var city = Math.floor(Math.random() * 10000) + 1;
	   }
    console.log(city)
	console.log(activityVal);

    $("#img2").attr("src", "assets/images/"+activityVal+".jpeg");
    

	$.ajax({
        url: 'https://api.sygictravelapi.com/1.0/en/places/list?parents=city:'+city+'&categories='+ activityVal +'&limit=20',
        beforeSend: function(xhr) {
             xhr.setRequestHeader("x-api-key", "3P9NEojUHh6edkJe8BCkP9Z8AAGbr9S57YAFEMqq")
        }, success: function(response){
            console.log(response);
            //process the JSON data etc
            
            //creates an array with all of the points of interested (poi) objects within. Use pois[i].location to get coords
            const placesObj = response.data.places
            
            if (placesObj === undefined) {

                return getActivity ()
            }

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

                popupContent = pois[i].name;

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
        cityName = cityName.split(", ")
        cityName = cityName[0]
        console.log(cityName)

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
        }

	})

//Getting a (not ordered)cities list
	$.ajax({
        url: 'https://api.sygictravelapi.com/1.0/en/places/list?level=city&limit=50',
        beforeSend: function(xhr) {
             xhr.setRequestHeader("x-api-key", "3P9NEojUHh6edkJe8BCkP9Z8AAGbr9S57YAFEMqq")
        }, success: function(data){
            console.log(data);
            //process the JSON data etc
        }

	})



}

function displayActivityMap () {
    
    let actMap = L.map("map-id").setView([latitude, longitude], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF1bGFwZXJvdXRrYSIsImEiOiJjamN4bDg1b3MxMmNrMnlvNXI4ZjVtZ2gyIn0.8-6Dt5FcrIKpSddbhgUPOQ', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: 'pk.eyJ1IjoicGF1bGFwZXJvdXRrYSIsImEiOiJjamN4bDg1b3MxMmNrMnlvNXI4ZjVtZ2gyIn0.8-6Dt5FcrIKpSddbhgUPOQ'
    }).addTo(actMap);

    actMap.scrollWheelZoom.disable();

    return actMap;

}



$(document).on("click", ".activity-btn", getActivity);

$(document).on("click", "#cityButton", function(){

cityInput = $("#citySearch").val().trim();
// converts the city input into a city code


cityKey()

gate = 1

getActivity()



});


function cityCode(a) {

    city = a.data.places["0"].id
        city = city.split(":")
        city = city[1]
        console.log(city)

        return city
        
}

function cityKey() {
        $.ajax({
        url: 'https://api.sygictravelapi.com/1.0/en/places/list?query='+cityInput,
        beforeSend: function(xhr) {
             xhr.setRequestHeader("x-api-key", "3P9NEojUHh6edkJe8BCkP9Z8AAGbr9S57YAFEMqq")
        }, success: function convertToCode(response){
            console.log(response);
            //process the JSON data etc
        cityCode(response)
        console.log(city)
        
        
        },
        async: false

    })
        return city
}







