
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDWdgFkygTh1WxpRwb81cCE-EDgKii6WP8",
    authDomain: "ai-resume-screening-syst-52b72.firebaseapp.com",
    projectId: "ai-resume-screening-syst-52b72",
    storageBucket: "ai-resume-screening-syst-52b72.firebasestorage.app",
    messagingSenderId: "288281169332",
    appId: "1:288281169332:web:0ef03689a294bbe379b6e1",
    measurementId: "G-15JZTRL577"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

export default app;
