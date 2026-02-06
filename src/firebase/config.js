import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
// IMPORTANTE: Substitua os valores abaixo pelas suas chaves do Console do Firebase
// Ou defina variáveis de ambiente .env para maior segurança
const firebaseConfig = {
    apiKey: "AIzaSyDveH49cdjlOSPqgNGAbYhuN81KBwmQ-Y0",
    authDomain: "portfoliovitor-60e55.firebaseapp.com",
    projectId: "portfoliovitor-60e55",
    storageBucket: "portfoliovitor-60e55.firebasestorage.app",
    messagingSenderId: "1060073976335",
    appId: "1:1060073976335:web:0ea4b21eeefe9c54ab697a",
    measurementId: "G-1NZDX8FCB7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
