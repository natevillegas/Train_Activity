// Initialize Firebase
var config = {
  apiKey: "AIzaSyC7qh9dZ6lPqbt345IPS4SC_CTe3crFRPg",
  authDomain: "natevillegas-61d11.firebaseapp.com",
  databaseURL: "https://natevillegas-61d11.firebaseio.com",
  projectId: "natevillegas-61d11",
  storageBucket: "natevillegas-61d11.appspot.com",
  messagingSenderId: "371797858014"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();
  // Grabs user input
  var trainName = $("#train-name").val().trim();
  var trainDestination = $("#destination").val().trim();
  var trainFirst = $("#first-train").val().trim();
  var trainFrequencey = $("#frequencey").val().trim();
  // Creates local "temporary" object for holding train data
  var newTrain = {
    trainName: trainName,
    trainDestination: trainDestination,
    trainFirst: trainFirst,
    trainFrequencey: trainFrequencey
  };
  // Uploads train data to the database
  database.ref().push(newTrain);
  // Alert
  alert("Train successfully added");
  // Clears all of the text-boxes
  $("#train-name").val("");
  $("#destination").val("");
  $("#first-train").val("");
  $("#frequencey").val("");
});

// Create Firebase event for adding train to the database AND THEN a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());
  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var trainDestination = childSnapshot.val().trainDestination;
  var trainFirst = childSnapshot.val().trainFirst;
  var trainFrequencey = childSnapshot.val().trainFrequencey;

  // Conver military time to normal hours
  var normalTrainFrist = moment(trainFirst, "HH:mm").format("hh:mm a");
  // First Time (pushed back 1 year to make sure it comes before current time)
  var trainFirstConverted = moment(trainFirst, "hh:mm").subtract(1, "years");
  // Current Time
  var currentTime = moment();
  // Difference between the times
  var diffTime = moment().diff(moment(trainFirstConverted), "minutes");
  // Time apart (remainder)
  var tRemainder = diffTime % trainFrequencey;
  // Minute Until Train
  var minNextTrain = trainFrequencey - tRemainder;
  // Next Train
  var nextTrain = moment().add(minNextTrain, "minutes").format("hh:mm a");

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + "every " +
  trainFrequencey + " mins</td><td>" + nextTrain + "</td><td>" + minNextTrain + " mins</td></tr>");
});

