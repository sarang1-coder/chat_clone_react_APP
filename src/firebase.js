import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from 'firebase/storage'; 


 

const firebaseConfig = {
  apiKey: "AIzaSyBEgVolmLkhae34qPPW256fvKlVBKskawc",
  authDomain: "chatapp-clone-51ec7.firebaseapp.com",
  projectId: "chatapp-clone-51ec7",
  storageBucket: "chatapp-clone-51ec7.appspot.com",
  messagingSenderId: "441479288036",
  appId: "1:441479288036:web:67337eeeb77a57e0ca08f1"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

// DB connection 
const db=firebaseApp.firestore();

// Enable Auth 
const auth = firebase.auth();


// Auth Provider - here Google 
const provider=new firebase.auth.GoogleAuthProvider();

const storage=getStorage(firebaseApp);

export {auth,provider,storage};

export default db;