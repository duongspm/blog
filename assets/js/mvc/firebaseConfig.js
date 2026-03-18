import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnPc_SS_dR0dXl7WPY1FNp_YgKoUyBl-E",
  authDomain: "my-creative-blog.firebaseapp.com",
  projectId: "my-creative-blog",
  storageBucket: "my-creative-blog.firebasestorage.app",
  messagingSenderId: "57335816842",
  appId: "1:57335816842:web:9212c8576d23e534c00373",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
