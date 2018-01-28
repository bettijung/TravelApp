
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
$(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    

    $('#modal1').modal();
  });

$("#googSubmit").on("click", function() {

email = $("#email").val().trim()
password = $("#password").val().trim()

firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

})

var activityVal

function getActivity () {

	event.preventDefault();

	activityVal = $(this).attr("id").trim()

	randCity = Math.floor(Math.random() * 10) + 1;

	console.log(activityVal);

    $(activityVal+"1").attr("src", "assets/images/"+activityVal+ "1.jpeg");
    $(activityVal+"2").attr("src", "assets/images/"+activityVal+ "2.jpeg");
    $(activityVal+"3").attr("src", "assets/images/"+activityVal+ "3.jpeg");

	$.ajax({
        url: 'https://api.sygictravelapi.com/1.0/en/places/list?parents=city:'+randCity+'&categories='+ activityVal +'&limit=20',
        beforeSend: function(xhr) {
             xhr.setRequestHeader("x-api-key", "3P9NEojUHh6edkJe8BCkP9Z8AAGbr9S57YAFEMqq")
        }, success: function(response){
            console.log(response);
            //process the JSON data etc
            
            //creates an array with all of the points of interested (poi) objects within. Use pois[i].location to get coords
            const placesObj = response.data.places
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

            //creates marker for each poi
            for (var i=0; i<pois.length; i++) {

                const activityIcon = L.icon({
                    iconUrl: "assets/images/marker.png",
                    iconSize: [38, 38],
                    iconAnchor: [22, 38],
                    popupAnchor: [-3, -76],
                });

                L.marker([pois[i].location.lat, pois[i].location.lng], {icon: activityIcon}).addTo(markerMap);
            }


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
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoicGF1bGFwZXJvdXRrYSIsImEiOiJjamN4bDg1b3MxMmNrMnlvNXI4ZjVtZ2gyIn0.8-6Dt5FcrIKpSddbhgUPOQ'
    }).addTo(actMap);

    return actMap;

}

$(document).on("click", ".activity-btn", getActivity);








