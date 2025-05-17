import { effect, inject, Injectable, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth, User as FirebaseUser } from '@angular/fire/auth';
import { GlobalVariablesService } from './global-variables.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  allUsers: User[] = [];
  fetchedCollection$: Observable<any[]>;
  loggedInUser = signal<User | null>(null); // Initialwert: null
  isLoggedIn = signal(false); // Signal für den Login-Status
  loadingData = signal(false);

  constructor(private fb: FirebaseService, private auth: Auth) {
    this.fetchedCollection$ = this.fb.fetchedCollection$;
    this.loadingData.set(true);

    fb.getData('users');

    this.fetchedCollection$.subscribe((data) => {
      this.allUsers = data.map((rawData) => new User({ ...rawData }));
    });

    // state listener for logged in user ( logged in / logged out )
    this.auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      this.loadingData.set(true);

      if (firebaseUser) {
        this.isLoggedIn.set(true); // Login-Status aktualisieren
        await this.fb.updateStateUser(firebaseUser.uid, 'online');
        const newUser = await this.fb.getSingleDoc('users', firebaseUser.uid);
        this.setLoggedInUser(newUser);
      } else {
        if (this.loggedInUser()) {
          this.isLoggedIn.set(false); // Login-Status aktualisieren
          this.fb.updateStateUser(this.loggedInUser()!.id, 'offline');
        }
        this.setLoggedInUser(null);
      }
      this.loadingData.set(false);
    });
  }

  setLoggedInUser(user: any) {
    this.loggedInUser.set(user); // Aktuellen Wert setzen
  }

  sortUsers(): User[] {
    let user = this.loggedInUser();
    let loggedInUserId = '';

    if (user) {
      loggedInUserId = user.id;
    } else {
      loggedInUserId = '';

      return [];
    }

    return this.allUsers.sort((a, b) => {
      // Logged in user kommt zuerst
      if (a.id === loggedInUserId) return -1;
      if (b.id === loggedInUserId) return 1;

      // Online-Benutzer kommen als nächstes
      if (a.status === 'online' && b.status !== 'online') return -1;
      if (a.status !== 'online' && b.status === 'online') return 1;

      // Prüfe ob name existiert
      const nameA = a.name || '';
      const nameB = b.name || '';

      // Alphabetische Sortierung für alle anderen
      if (nameA.toLowerCase() < nameB.toLowerCase()) return -1;
      if (nameA.toLowerCase() > nameB.toLowerCase()) return 1;
      return 0;
    });
  }

  getUserById(userId: string): User | undefined {
    return this.allUsers.find((user) => user.id === userId);
  }

  updateLoggedInUser(updatedUser: Partial<User>) {
    if (this.loggedInUser()) {
      const currentUser = this.loggedInUser()!;
      const updated = new User({
        ...currentUser,
        ...updatedUser, // Aktualisierte Werte übernehmen
      });

      this.setLoggedInUser(updated);
    }
  }
}
