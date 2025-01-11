import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  arr: User[] = []

  constructor(private fb: FirebaseService) {
    this.loadUsers();
   }

  async loadUsers() {
    try {
      this.arr = await this.fb.getCollection('users');
      console.log('Daten geladen:', this.arr);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
    }
  }
  
}
