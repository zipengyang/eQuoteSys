import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyD_dZXyqMZs6wxJNzDKsde8Ff2ZbbnKYP0',
  authDomain: 'pcb-online-quote-system.firebaseapp.com',
  projectId: 'pcb-online-quote-system',
  storageBucket: 'pcb-online-quote-system.appspot.com',
  messagingSenderId: '638572059428',
  appId: '1:638572059428:web:90f72c74f0ad6bc6c571b1',
  measurementId: 'G-R8V6X93EL8',
};
// Initialize Firebase
// firebase.initializeApp( firebaseConfig );
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export default firebase;
