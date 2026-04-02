import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB11Do3r1p59ITDCsz_kgxf5xAdozGE2WY",
  authDomain: "investpercent.firebaseapp.com",
  projectId: "investpercent",
  storageBucket: "investpercent.firebasestorage.app",
  messagingSenderId: "1004946276963",
  appId: "1:1004946276963:web:dfe950c029f24c4819ee56",
  measurementId: "G-1V4L60RZZP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
