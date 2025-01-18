import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  allUsers: User[] = [];
  fetchedCollection$: Observable<any[]>;
  loggedInUser: any;

  constructor(private fb: FirebaseService) {
    this.fetchedCollection$ = this.fb.fetchedCollection$;
    fb.getData('users');
    this.fetchedCollection$.subscribe((data) => {
      this.allUsers = data.map((rawData) => new User({ ...rawData }));
      console.log('All Users Array', this.allUsers);
    });
  }

  // test
  updateStatus(id: string) {
    setTimeout(() => {
      this.fb.updateSingleDoc('users', id, 'online');
    }, 5000);
  }
}
