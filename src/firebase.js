import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDqPrel2q-GHoHWgAYcpTLR_Hvou-XphIY",
    authDomain: "hjwedding-a7674.firebaseapp.com",
    projectId: "hjwedding-a7674",
    storageBucket: "hjwedding-a7674.firebasestorage.app",
    messagingSenderId: "189631736454",
    appId: "1:189631736454:web:8b3b0ce172b85f75b4bf07",
    measurementId: "G-Y1S7Q5CBQG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { app, analytics, database };
