import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "bio-elelmiszer-webshop", appId: "1:534376561555:web:82e8d843ebc600841b8666", storageBucket: "bio-elelmiszer-webshop.firebasestorage.app", apiKey: "AIzaSyApoSaVmOq1AhPq9Exfrd3FigYHuOFlVpE", authDomain: "bio-elelmiszer-webshop.firebaseapp.com", messagingSenderId: "534376561555" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
