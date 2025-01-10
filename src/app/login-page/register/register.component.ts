import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  contactForm: FormGroup;


  constructor(private fb: FormBuilder, private firestore: Firestore) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required], // Name ist erforderlich
      email: ['', [Validators.required, Validators.email]], // E-Mail muss gültig sein
      password: ['', [Validators.required, Validators.minLength(6)]], // Passwort min. 6 Zeichen
      terms: [false, Validators.requiredTrue], // Checkbox muss ausgewählt sein
      id: '',
      avatar: '/imgs/avatar/elias_neumann.svg',
      status: 'offline'
    });
  }


  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form data:', this.contactForm.value);
      this.upload()
    } else {
      console.error('Form is invalid');
    }
  }

  async upload() {
    const contact = this.contactForm.value
    const contactsCollection = collection(this.firestore, 'users')

    try {
      await addDoc(contactsCollection, contact)
    } catch (error) {
      console.error(error)
    }

  }

}
