import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBUApjJcWZccjvjbmT0MekNTW42isfskDo",
    authDomain: "twittr-28691.firebaseapp.com",
    projectId: "twittr-28691",
    storageBucket: "twittr-28691.appspot.com",
    messagingSenderId: "855595516223",
    appId: "1:855595516223:web:677ddabe0d0dfd9832138a",
    measurementId: "G-41EV43GPRH"
  }


firebase.initializeApp(firebaseConfig)

var db = firebase.firestore()

export default db
