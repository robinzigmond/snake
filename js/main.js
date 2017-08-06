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
  var user;


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
    $("#login").hide();
    $("#logout").removeClass("hide");
    $("#profile").removeClass("hide");
    $("#playername").replaceWith(user.displayName);
    $("#photo").attr("src", user.photoURL);
  }