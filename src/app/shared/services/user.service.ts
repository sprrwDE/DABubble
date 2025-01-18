import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  allUsers: User[] = [];
  fetchedCollection$: Observable<any[]>;
  loggedInUser: any = new User();

  constructor(private fb: FirebaseService) {
    this.fetchedCollection$ = this.fb.fetchedCollection$;
    fb.getData('users');
    this.fetchedCollection$.subscribe((data) => {
      this.allUsers = data.map((rawData) => new User({ ...rawData }));
      console.log('All Users Array', this.allUsers);
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
