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
  var ref = database.ref('scores');
  var user;
  var displayName;
  var photoURL;
  var uid;

var data = {
    name: displayName
};

  var provider = new firebase.auth.GoogleAuthProvider();
  
  function signIn() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        user = result.user;
        showProfile();
        
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });  

  }

  function showProfile(){
    $("#playername").replaceWith(user.displayName);
    $("#photo").attr("src", user.photoURL);
    $("#login").hide();
    $("#logout").removeClass("hide");
    $("#highscoreText").addClass("hide");
    $("#highscore").addClass("hide");
  }

  $(document).ready(function(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            uid = user.uid;
            var providerData = user.providerData;
            var token = firebase.auth().currentUser.uid;
            $("#playername").replaceWith(user.displayName);
            $("#photo").attr("src", user.photoURL);
            $("#login").remove();
            $("#logout").removeClass("hide");
            $("#highscoreText").removeClass("hide");
            $("#highscore").removeClass("hide");
        } else {            
            $("#login").show();
            $("#logout").addClass("hide");
            $("#highscoreText").addClass("hide");
            $("#highscore").addClass("hide");
        }
      });
  });

  function signOut(){
  firebase.auth().signOut().then(function() {
    bootbox.alert("You have signed out as " + displayName);
  }).catch(function(error) {
    console.log(error);
  });
}