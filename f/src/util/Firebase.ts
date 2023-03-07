import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDsN54mOF59ofTfb1I4K0JafzmvTh0WYqE",
  authDomain: "tpa-web-4ab90.firebaseapp.com",
  projectId: "tpa-web-4ab90",
  storageBucket: "tpa-web-4ab90.appspot.com",
  messagingSenderId: "655057573156",
  appId: "1:655057573156:web:adc49d474656c436e9cfb1",
  measurementId: "G-43Y1FD0D1N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
export default storage
