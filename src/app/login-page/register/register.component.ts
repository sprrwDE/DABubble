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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }


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
