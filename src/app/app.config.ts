import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyDtBq05NJzrYhjDjxIa2InQ-7a813XNGJo',
        authDomain: 'dabubble-850f6.firebaseapp.com',
        projectId: 'dabubble-850f6',
        storageBucket: 'dabubble-850f6.firebasestorage.app',
        messagingSenderId: '82369633954',
        appId: '1:82369633954:web:96dff6939085e5482281fb',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    importProvidersFrom(BrowserAnimationsModule),
  ],
};
