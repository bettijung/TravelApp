
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
//
$(".btn").on("click", function(event) {

	event.preventDefault();

	activityVal = $(this).attr("id").trim()

	randCity = Math.floor(Math.random() * 10) + 1

	console.log(activityVal)


	$.ajax({
        url: 'https://api.sygictravelapi.com/1.0/en/places/list?parents=city:'+randCity+'&categories='+ activityVal +'&limit=20',
        beforeSend: function(xhr) {
             xhr.setRequestHeader("x-api-key", "3P9NEojUHh6edkJe8BCkP9Z8AAGbr9S57YAFEMqq")
        }, success: function(response){
            console.log(response);
            //process the JSON data etc
            const actCoord = response.data.places["0"].location
            console.log(actCoord)
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
})

