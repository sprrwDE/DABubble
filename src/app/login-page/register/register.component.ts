import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';
import { Firestore, setDoc, doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required], // Name ist erforderlich
      email: ['', [Validators.required, Validators.email]], // E-Mail muss gültig sein
      password: ['', [Validators.required, Validators.minLength(6)]], // Passwort min. 6 Zeichen
      terms: [false, Validators.requiredTrue], // Checkbox muss ausgewählt sein
      id: '',
      avatar: '/imgs/avatar/elias_neumann.svg',
      status: 'offline',
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.registerUser();
    } else {
      console.error('Form is invalid');
    }
  }

  createUserOnFirebase() {}

  async registerUser() {
    try {
      const userCredential = await this.authService.register(
        this.contactForm.value.email,
        this.contactForm.value.password
      );
      const user = new User({
        id: userCredential.user?.uid,
        email: userCredential.user?.email || '',
        name: this.contactForm.value.name,
        image: '/imgs/avatar/profile.svg',
        status: 'offline',
        isNotGoogle: true,
      });
      console.log("user ist: ", user)
      this.addUserToFirebase(user);
      this.routeId(user.id);
    } catch (error) {
      console.error('Fehler bei der Anmeldung:', error);
    }
  }

  routeId(userId: string) {
    this.router.navigate(['/login/avatar/', userId]);
  }

  async addUserToFirebase(userInterface: User) {
    const user = userInterface.toJSON();
    try {
      const docRef = doc(this.firestore, `users/${user.id}`); // Benutzerdefinierte ID
      await setDoc(docRef, user);
    } catch (error) {
      console.error('Fehler beim Speichern des Dokuments:', error);
    }
  }
}
