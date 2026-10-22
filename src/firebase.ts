import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./environment";
import {initializeAuth} from "firebase/auth";
import{getFirestore} from "firebase/firestore";

export const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = initializeAuth(firebaseApp);

export const firestore = getFirestore(firebaseApp);

