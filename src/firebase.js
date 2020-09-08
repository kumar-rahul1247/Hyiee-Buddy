import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAVLOSDFE_Ly3PqWqdQJwF3aZgDXhlPsKA",
    authDomain: "hyiee-buddy.firebaseapp.com",
    databaseURL: "https://hyiee-buddy.firebaseio.com",
    projectId: "hyiee-buddy",
    storageBucket: "hyiee-buddy.appspot.com",
    messagingSenderId: "956314114617",
    appId: "1:956314114617:web:e7ab74521539384c150be8",
    measurementId: "G-E827Q0C87H"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  
  export { db, auth, storage};