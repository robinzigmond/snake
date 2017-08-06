  // Initialize Firebase
  var config = {
    apiKey: key,
    authDomain: domain,
    databaseURL: databaseURL,
    projectId: project,
    storageBucket: "",
    messagingSenderId: messengerId
  };
  firebase.initializeApp(config);

  var database = firebase.database();