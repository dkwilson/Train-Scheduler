// Initialize Firebase
var config = {
  apiKey: "AIzaSyBN8IMv9NXVfxNsdj79Lg9iicTsBnGPLus",
  authDomain: "trainspotting-3584f.firebaseapp.com",
  databaseURL: "https://trainspotting-3584f.firebaseio.com",
  projectId: "trainspotting-3584f",
  storageBucket: "trainspotting-3584f.appspot.com",
  messagingSenderId: "504117210103"
};
firebase.initializeApp(config);

var trainData = firebase.database();

// Get info from form
$("#goTrains").on("click", function(event) {
  // Prevent the default form submit behavior
  event.preventDefault();

  // User input
  var trainName = $("#trainName")
    .val()
    .trim();
  var destination = $("#trainDestination")
    .val()
    .trim();
  var firstTrain = $("#trainTime")
    .val()
    .trim();
  var frequency = $("#trainFrequency")
    .val()
    .trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // Uploads train data to the database
  trainData.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  // Alert
  $("#message").text("Train successfully added");

  // Clears all of the text-boxes
  $("#trainName").val("");
  $("#trainDestination").val("");
  $("#trainTime").val("");
  $("#trainFrequency").val("");
});

trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());

  // Create Snapshot.
  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().frequency;
  var tFirstTrain = childSnapshot.val().firstTrain;

  var timeArr = tFirstTrain.split(":");
  var trainTime = moment()
    .hours(timeArr[0])
    .minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tMinutes;
  var tArrival;

  // If the first train is later than the current time, sent arrival to the first train time
  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {
    // Calculate the minutes until arrival using hardcore math
    // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
    // and find the modulus between the difference and the frequency.
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;
    // To calculate the arrival time, add the tMinutes to the current time
    tArrival = moment()
      .add(tMinutes, "m")
      .format("hh:mm A");
  }
  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);

  // Add each train's data into the table
  $("#trainOutput > tbody").append(
    $("<tr>").append(
      $("<td>").text(tName),
      $("<td>").text(tDestination),
      $("<td>").text(tFrequency),
      $("<td>").text(tArrival),
      $("<td>").text(tMinutes)
    )
  );
});
