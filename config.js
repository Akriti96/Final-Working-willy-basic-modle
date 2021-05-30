import firebase from "firebase"
require("@firebase/firestore")
var firebaseConfig = {
  apiKey: "AIzaSyCa8oXWEf8a2mTmrcyF0RKHzrmfSLeJlVE",
  authDomain: "eric-willy-class.firebaseapp.com",
  projectId: "eric-willy-class",
  storageBucket: "eric-willy-class.appspot.com",
  messagingSenderId: "880695393542",
  appId: "1:880695393542:web:71e6a2f8b8fe56a393b287"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
export default firebase.firestore();  