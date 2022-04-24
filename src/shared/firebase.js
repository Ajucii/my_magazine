import firebase from "firebase/app";
import "firebase/storage"



const firebaseConfig = {
    apiKey: "AIzaSyAQHdLWUciGZc8Re5Tq7wlVNcsACVualE0",
    authDomain: "mymag-55880.firebaseapp.com",
    projectId: "mymag-55880",
    storageBucket: "mymag-55880.appspot.com",
    messagingSenderId: "714356392022",
    appId: "1:714356392022:web:b079472a85329e60a7fbf7",
    measurementId: "G-QJCH0DHE1M"
};

firebase.initializeApp(firebaseConfig);


const storage = firebase.storage();

export { storage };