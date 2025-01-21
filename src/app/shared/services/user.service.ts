import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth, User as FirebaseUser } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  allUsers: User[] = [];
  fetchedCollection$: Observable<any[]>;
  loggedInUser: any = new User();

  constructor(private fb: FirebaseService, private auth: Auth) {
    this.fetchedCollection$ = this.fb.fetchedCollection$;
    fb.getData('users');
    this.fetchedCollection$.subscribe((data) => {
      this.allUsers = data.map((rawData) => new User({ ...rawData }));
      /* if (this.allUsers.length > 0) {
        console.log('ALLE USER GLOBAL', this.allUsers);
      } */
    });

    // state listener for logged in user ( logged in / logged out )
    this.auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        await this.fb.updateStateUser(firebaseUser.uid, 'online');
        const newUser = await this.fb.getSingleDoc('users', firebaseUser.uid);
        this.setLoggedInUser(newUser);
      } else {
        if (this.loggedInUser) {
          this.loggedInUser$.subscribe((firebaseUser) => {
            if (firebaseUser === null) {
              // console.log('test');
            } else {
              this.fb.updateStateUser(firebaseUser.id, 'offline');
            }
            // console.log('loggedout user: ', firebaseUser);
          });
        }
      }
    });
  }

  private loggedInUserSubject = new BehaviorSubject<any>(null); // Default ist null
  loggedInUser$ = this.loggedInUserSubject.asObservable(); // Observable zum Abonnieren

  setLoggedInUser(user: any) {
    this.loggedInUserSubject.next(user); // Aktuellen Wert setzen
  }

  sortUsers(): User[] {
    let loggedInUserId = '';
    this.loggedInUser$.subscribe((user) => {
      if (user) {
        loggedInUserId = user.id;
      }
    });

    return this.allUsers.sort((a, b) => {
      // Logged in user kommt zuerst
      if (a.id === loggedInUserId) return -1;
      if (b.id === loggedInUserId) return 1;

      // Prüfe ob name existiert
      const nameA = a.name || '';
      const nameB = b.name || '';

      // Alphabetische Sortierung für alle anderen
      if (nameA.toLowerCase() < nameB.toLowerCase()) return -1;
      if (nameA.toLowerCase() > nameB.toLowerCase()) return 1;
      return 0;
    });
  }
}
