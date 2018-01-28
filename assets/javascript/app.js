
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
var activityVal

let geoCoordLat;

let geoCoordLng;
//
$(".btn").on("click", function(event) {

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
            const actCoord = response.data.places["0"].location;
            console.log(actCoord)

            let geoCoordLat = response.data.places["0"].location.lat;
            console.log(geoCoordLat);

            let geoCoordLng = response.data.places["0"].location.lng;
            console.log(geoCoordLng);
        }


	})

displayMap ();


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

})


function displayMap() {

    let mymap = L.map("map-id").setView([geoCoordLat, geoCoordLng], 13);
    // let mymap = L.map("map-id").setView([51.505, -0.09], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF1bGFwZXJvdXRrYSIsImEiOiJjamN4bDg1b3MxMmNrMnlvNXI4ZjVtZ2gyIn0.8-6Dt5FcrIKpSddbhgUPOQ', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicGF1bGFwZXJvdXRrYSIsImEiOiJjamN4bDg1b3MxMmNrMnlvNXI4ZjVtZ2gyIn0.8-6Dt5FcrIKpSddbhgUPOQ'
}).addTo(mymap);


}




