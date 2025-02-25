import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';
import { Firestore, setDoc, doc } from '@angular/fire/firestore';
import { FirebaseError } from 'firebase/app';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  contactForm: FormGroup;
  errorMessage: string | null = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailValidator]], // Eigener Validator
      password: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, Validators.requiredTrue],
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

  emailValidator(control: AbstractControl) {
    const validTLDs = ['com', 'net', 'org', 'de', 'edu', 'gov', 'io', 'ai', 'co', 'us', 'uk']; // Liste der erlaubten TLDs
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,})$/;

    const match = control.value.match(emailRegex);
    if (!match) {
      return { invalidEmail: true }; // Falls das Format grundsätzlich nicht passt
    }

    const tld = match[1].toLowerCase();
    if (!validTLDs.includes(tld)) {
      return { invalidTLD: true }; // Falls die TLD nicht erlaubt ist
    }

    return null;
  }


  async registerUser() {
    this.errorMessage = null;  // Fehler zurücksetzen

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

      console.log("user ist: ", user);
      this.addUserToFirebase(user);
      this.routeId(user.id);
    } catch (error: any) {
      if (error?.code === 'auth/email-already-in-use') {
        this.errorMessage = '*Diese E-Mail-Adresse wird bereits verwendet.';
      } else if (error?.code === 'auth/invalid-email') {
        this.errorMessage = 'Ungültige E-Mail-Adresse.';
      } else if (error?.code === 'auth/weak-password') {
        this.errorMessage = 'Das Passwort ist zu schwach.';
      } else {
        this.errorMessage = 'Registrierung fehlgeschlagen. Versuche es erneut.';
      }
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
