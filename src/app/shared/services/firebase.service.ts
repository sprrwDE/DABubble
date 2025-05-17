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
        this.fetchedSingleSubject.next(data);
        return data;
      } else {
        return null;
      }
    } catch (error) {
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
          callback(data);
        } else {
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
    if (userInterface instanceof User) {
      user = userInterface.toJSON();
    } else {
      user = userInterface;
    }

    try {
      const docRef = doc(this.firestore, `users/${user.id}`);
      await setDoc(docRef, user);
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
      const docRef = doc(this.firestore, `users/${id}`);
      await updateDoc(docRef, { image });
    } catch (error) {
      console.error('Fehler beim Speichern des Dokuments:', error);
    }
  }

  async updateUserName(id: string, input: string) {
    try {
      const docRef = doc(this.firestore, `users/${id}`);
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
    channelId: string,
    chat: string
  ) {
    try {
      const docRef = doc(
        this.firestore,
        `${chat}/${channelId}/messages/${messageId}`
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let updatedLikes = reaction[messageId] || [];
        updatedLikes = updatedLikes.filter((r) => r.count > 0);
        await updateDoc(docRef, { likes: updatedLikes });
      }
    } catch (error) {
      console.error('Fehler beim Speichern in Firebase:', error);
    }
  }

  async updateEmojiCountReplies(
    reaction: Record<
      string,
      { emoji: string; count: number; userIds: string[] }[]
    >,
    messageId: string,
    channelId: string,
    replyId: string,
    chat: string
  ) {
    try {
      const docRef = doc(
        this.firestore,
        `${chat}/${channelId}/messages/${messageId}/replies/${replyId}`
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const docData = docSnap.data() as {
          likes?: { emoji: string; count: number; userIds: string[] }[];
        };
        let updatedLikes = reaction[replyId] || [];
        updatedLikes = updatedLikes.filter((r) => r.count > 0);
        await updateDoc(docRef, { likes: updatedLikes });
      } else {
        console.error('❌ Kein Dokument gefunden für', messageId, channelId);
      }
    } catch (error) {
      console.error('🔥 Fehler beim Speichern in Firebase:', error);
    }
  }
}
