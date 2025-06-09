import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';
import {getAuth} from 'firebase/auth'


// const firebaseConfig = {
//   apiKey: `${'AIzaSyCaKjG8FJsvbN30ZlvDSJi23qQbsyi6LHY'}`,
//   authDomain: `${'whatsapp-f7e8b.firebaseapp.com'}`,
//   projectId: `${'whatsapp-f7e8b'}`,
//   storageBucket: `whatsapp-f7e8b.appspot.com`,
//   messagingSenderId: `${process.env.FIREBASE_MESSAGE_ID}`,
//   appId: `${process.env.FIREBASE_APP_ID}`,
//   measurementId: `${process.env.FIREBASE_MEASUREMENT_ID}`
// };

const firebaseConfig = {
    apiKey: "AIzaSyCaKjG8FJsvbN30ZlvDSJi23qQbsyi6LHY",
    authDomain: "whatsapp-f7e8b.firebaseapp.com",
    databaseURL: "https://whatsapp-f7e8b-default-rtdb.firebaseio.com",
    projectId: "whatsapp-f7e8b",
    storageBucket: "whatsapp-f7e8b.appspot.com",
    messagingSenderId: "414801914637",
    appId: "1:414801914637:web:e982ad20d5a501a6e79e44",
    measurementId: "G-FRP6YB4FS4"
  };





// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage();