// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpV9jvHSQXiMsPlrNpqjXvz2ZpnFZsPwI",
  authDomain: "financely-12.firebaseapp.com",
  projectId: "financely-12",
  storageBucket: "financely-12.appspot.com",
  messagingSenderId: "665322399440",
  appId: "1:665322399440:web:5a3911c61406957df320d5",
  measurementId: "G-KMN9RWTCG9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc};