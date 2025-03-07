import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';
import { Firestore, setDoc, doc } from '@angular/fire/firestore';
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
      name: ['', [Validators.required, this.nameValidator]],  // Hier ist es korrekt
      email: ['', [Validators.required, Validators.email, this.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, Validators.requiredTrue],
      id: '',
      avatar: '/imgs/avatar/elias_neumann.svg',
      status: 'offline',
    });
  }


  nameValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value?.trim() || '';

    if (value.length <= 0) {
      return null
    }

    if (value.length < 3) {
      return { nameTooShort: 'Der Name muss mindestens 3 Zeichen lang sein' };
    }

    if (/^\d+$/.test(value)) {
      return { onlyNumbers: 'Der Name darf nicht nur aus Zahlen bestehen' };
    }

    return null; // Kein Fehler
  }


  get nameErrorMessage(): string | null {
    const control = this.contactForm.get('name');
    if (!control || !control.errors || !control.touched || control == null) return null;

    if (control.errors['nameTooShort']) return 'Der Name muss mindestens 3 Zeichen lang sein';
    if (control.errors['onlyNumbers']) return 'Der Name darf nicht nur aus Zahlen bestehen';

    return null;
  }

  get passwordErrorMessage(): string | null {
    const control = this.contactForm.get('password');
    const value = control?.value || '';

    if (value.length < 6 && value.length > 0) {
      return 'Bitte mindestens 6 Zeichen';
    }

    if (value.length > 6) {
      if (!/[A-Z]/.test(value)) {
        return 'Das Passwort muss mindestens einen Großbuchstaben enthalten';
      }

      if (!/\d/.test(value)) {
        return 'Das Passwort muss mindestens eine Zahl enthalten';
      }
    }


    return null; // Kein Fehler
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

      await this.addUserToFirebase(user);
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

  resetError() {
    this.errorMessage = null
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
