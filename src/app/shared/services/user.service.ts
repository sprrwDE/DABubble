import { HostListener, Injectable } from '@angular/core';
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
      console.log('All Users Array', this.allUsers);
    });

    this.auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        await this.fb.updateStateUser(firebaseUser.uid, 'online');
        const newUser = await this.fb.getSingleDoc('users', firebaseUser.uid);
        this.setLoggedInUser(newUser);
      } else {
        if (this.loggedInUser) {
          this.loggedInUser$.subscribe((firebaseUser) => {
            if (firebaseUser === null) {
              console.log('test');
            } else {
              this.fb.updateStateUser(firebaseUser.id, 'offline');
            }
            console.log('loggedout user: ', firebaseUser);
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

  // test
  // updateStatus(id: string) {
  //   setTimeout(() => {
  //     this.fb.updateSingleDoc('users', id, 'online');
  //   }, 15000);
  // }
}
