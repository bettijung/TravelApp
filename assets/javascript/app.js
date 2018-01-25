
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

//