import { Injectable } from '@angular/core';
import { Firestore, collection, onSnapshot, DocumentData } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

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
}
