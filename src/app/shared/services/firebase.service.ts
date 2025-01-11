import { Injectable } from '@angular/core';
import {
  Firestore,
  updateDoc,
  getDoc,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot
} from '@angular/fire/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  async getCollection(col: string): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, col));
      const dataArr = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return dataArr;
    } catch (error) {
      console.error('Fehler beim Abrufen der Collection:', error);
      throw error;
    }
  }

  async getSingleDoc(col: string, id: string) {
    try {
      const docRef = doc(this.firestore, col, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  //// Test

  async updateSingleDoc(col: string, id: string, status:string) {
    const washingtonRef = doc(this.firestore, col, id);
    await updateDoc(washingtonRef, {
      status: status,
    });
  }

  subscribeToSingleDoc(col: string, id: string, callback: (data: any) => void): () => void {
    try {
      const docRef = doc(this.firestore, col, id);
  
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Live Document Data:', data);
          callback(data); // Callback aufrufen und Daten übergeben
        } else {
          console.log('No such document!');
          callback(null); // Keine Daten vorhanden
        }
      });
  
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up listener:', error);
      return () => {};
    }
  }
  
  
  ////

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
