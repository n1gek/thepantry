var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("path/to/serviceAccountKey.json");

// Initialize the app with a custom auth variable, limiting the server's access
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://https://console.firebase.google.com/u/0/project/pantry-7a5a4/overview.firebaseio.com",
  databaseAuthVariableOverride: {
    uid: "my-service-worker"
  }
});

// Example usage: Reading data with limited access
var db = admin.database();
var ref = db.ref("/some_resource");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});
