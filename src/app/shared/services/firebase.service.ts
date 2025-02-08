import { Injectable } from '@angular/core';
import {
  Firestore,
  updateDoc,
  getDoc,
  collection,
  doc,
  setDoc,
  onSnapshot,
  DocumentData,
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private fetchedCollectionSubject = new BehaviorSubject<DocumentData[]>([]);
  fetchedCollection$ = this.fetchedCollectionSubject.asObservable();

  private fetchedSingleSubject = new BehaviorSubject<DocumentData>({});
  fetchedSingleData$ = this.fetchedSingleSubject.asObservable();

  constructor(private firestore: Firestore) {}

  getData(db: string) {
    try {
      onSnapshot(collection(this.firestore, db), (list) => {
        const fetchedData: DocumentData[] = [];
        list.docs.forEach((element) => {
          const rawData = {
            ...element.data(),
            id: element.id,
          };
          fetchedData.push(rawData);
        });
        this.fetchedCollectionSubject.next(fetchedData);
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der Daten:', error);
    }
  }

  async getSingleDoc(col: string, id: string) {
    try {
      const docRef = doc(this.firestore, col, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Document data:', data);
        this.fetchedSingleSubject.next(data);
        return data;
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }

  subscribeToSingleDoc(
    col: string,
    id: string,
    callback: (data: any) => void
  ): () => void {
    try {
      const docRef = doc(this.firestore, col, id);

      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Live Document Data:', data);
          callback(data);
        } else {
          console.log('No such document!');
          callback(null);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up listener:', error);
      return () => {};
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

  async updateStateUser(id: string, state: string) {
    try {
      const docRef = doc(this.firestore, `users/${id}`);
      await setDoc(docRef, { status: state }, { merge: true });
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Status:', error);
    }
  }

  async changeProfileImage(id: string, image: string) {
    try {
      const docRef = doc(this.firestore, `users/${id}`); // Benutzerdefinierte ID
      console.log(image);
      await updateDoc(docRef, { image });
    } catch (error) {
      console.error('Fehler beim Speichern des Dokuments:', error);
    }
  }

  async updateUserName(id: string, input: string) {
    try {
      const docRef = doc(this.firestore, `users/${id}`); // Benutzerdefinierte ID
      await updateDoc(docRef, { name: input });
    } catch (error) {
      console.error('Fehler beim Speichern des Dokuments:', error);
    }
  }

  async updateEmojiCount(
    reaction: Record<
      string,
      { emoji: string; count: number; userIds: string[] }[]
    >,
    messageId: string,
    channelId: string
  ) {
    try {
      const docRef = doc(
        this.firestore,
        `channels/${channelId}/messages/${messageId}`
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // 💡 Hier Typumwandlung erzwingen
        const docData = docSnap.data() as {
          likes?: { emoji: string; count: number; userIds: string[] }[];
        };
        const currentLikes = docData.likes || [];
        // Neues Likes-Array erstellen, indem bestehende Likes beibehalten werden
        const updatedLikes = [...currentLikes];
        reaction[messageId].forEach((newReaction) => {
          const existingIndex = updatedLikes.findIndex(
            (r) => r.emoji === newReaction.emoji
          );
          if (existingIndex !== -1) {
            // Falls das Emoji existiert, aktualisieren
            updatedLikes[existingIndex] = newReaction;
          } else {
            // Falls nicht, neu hinzufügen
            updatedLikes.push(newReaction);
          }
        });
        // Speichern in Firebase
        await updateDoc(docRef, { likes: updatedLikes });
        console.log(
          `Updated reactions for message ${messageId} in channel ${channelId}:`,
          updatedLikes
        );
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Dokuments:', error);
    }
  }

  checkDocSnap() {}
}
