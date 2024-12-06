import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut, GoogleAuthProvider,signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy,  doc, getDocs
    , updateDoc,setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";



const firebaseConfig = {
    apiKey: "AIzaSyCt5dfTaSblljR7BTcnspa5xEuCW_ENohQ",
    authDomain: "hackathon-blog-1f102.firebaseapp.com",
    projectId: "hackathon-blog-1f102",
    storageBucket: "hackathon-blog-1f102.firebasestorage.app",
    messagingSenderId: "1032609861061",
    appId: "1:1032609861061:web:18a0529a069b5596b44fac",
    measurementId: "G-P7ZFXN60QX"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

const provider = new GoogleAuthProvider()
const db = getFirestore(app);



export { 
    auth, 
    GoogleAuthProvider,
    provider,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    db, 
    doc, 
    setDoc, 
    collection, 
    addDoc, 
    serverTimestamp, 
    query, 
    orderBy, 

getDocs ,
 signInWithPopup

};