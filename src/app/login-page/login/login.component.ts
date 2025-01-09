import { Component } from '@angular/core';
import { Auth, User, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        console.log('Logged in user:', user.displayName, user.email);
      } else {
        console.log('No user is logged in');
      }
    });
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        console.log('User signed in:', result.user);
      })
      .catch((error) => {
        console.error('Error during Google sign-in:', error);
      });
  }



}
