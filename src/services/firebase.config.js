import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAarU0BSUwwJBPxzzUsI0z-P6Zf5L4w0z0",
    authDomain: "to-do-af2b5.firebaseapp.com",
    projectId: "to-do-af2b5",
    storageBucket: "to-do-af2b5.appspot.com",
    messagingSenderId: "1023388319037",
    appId: "1:1023388319037:web:9e66531a62149059955954"
  };

  const app = initializeApp(firebaseConfig);

  export const db = getFirestore(app);