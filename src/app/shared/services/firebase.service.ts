import { Injectable } from '@angular/core';
import {
  Firestore,
  updateDoc,
  getDoc,
  collection,
  onSnapshot,
  DocumentData,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private fetchedCollectionSubject = new BehaviorSubject<DocumentData[]>([]);
  fetchedCollection$ = this.fetchedCollectionSubject.asObservable();

  constructor(private firestore: Firestore) {}

  getData(db: string) {
    try {
      const colRef = collection(this.firestore, db);

      onSnapshot(colRef, (snapshot) => {
        const fetchedData: DocumentData[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        this.fetchedCollectionSubject.next(fetchedData);

        // console.log('Daten abgerufen:', fetchedData);
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
    }
  }

  async getUser(userId: string) {
    try {
      const userDocRef = doc(this.firestore, `users/${userId}`); // Dokumentreferenz mit spezifischem Benutzer-ID
      const userDocSnap = await getDoc(userDocRef); // Abrufen des Dokuments
      const userData = userDocSnap.data(); // Daten aus dem Dokument
      return console.log(userData);
    } catch (error) {
      console.error('Fehler beim Abrufen der Benutzerdaten:', error);
    }
  }

  async addUser(userInterface: User) {
    let user: any;
    console.log('der userinterface ist das hier: ', userInterface);
    if (userInterface instanceof User) {
      user = userInterface.toJSON();
    } else {
      user = userInterface;
    }

    try {
      const docRef = doc(this.firestore, `users/${user.id}`);
      await setDoc(docRef, user);
      console.log(
        'Dokument mit benutzerdefinierter ID erfolgreich gespeichert:',
        user.id
      );
    } catch (error) {
      console.error('Fehler beim Speichern des Dokuments:', error);
    }
  }

  async changeProfileImage(id: string, image: string) {
    try {
      const docRef = doc(this.firestore, `users/${id}`); // Benutzerdefinierte ID
      await updateDoc(docRef, { image });
    } catch (error) {
      console.error('Fehler beim Speichern des Dokuments:', error);
    }
  }
}
