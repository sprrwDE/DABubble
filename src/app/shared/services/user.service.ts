import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  allUsers: User[] = []

  constructor(private fb: FirebaseService) {
    this.loadUsers();
   }

  async loadUsers() {
    try {
      this.allUsers = await this.fb.getCollection('users');
      console.log('Userdaten geladen:', this.allUsers);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
    }
  }
}
