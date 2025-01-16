import { Component, OnInit } from '@angular/core';
import { Auth, User, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { FirebaseService } from '../../shared/services/firebase.service';
import { User as AppUser } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private auth: Auth, private firebaseService: FirebaseService, private authService: AuthService, private router: Router, private fb: FormBuilder, private user: UserService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        this.user.loggedInUser = {email: user.email, id: user.uid}
      } else {
      }
    });
  }

  ngOnInit(): void {
    this.logOutUser()
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        this.updateFirebase(result.user)
        this.goToMainPage()
      })
      .catch((error) => {
        console.error('Error during Google sign-in:', error);
      });
  }

  updateFirebase(user: any) {
    this.firebaseService.addUser(this.getUserInfosFromGoogle(user))
  }

  getUserInfosFromGoogle(user: any): AppUser {
    return new AppUser({
      email: user.email,
      id: user.uid,
      image: user.photoURL,
      name: user.displayName,
      status: 'online',
    });
  }

  logOutUser() {
    this.authService.logout()
  }


  onLogin() {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
    }

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
      this.goToMainPage()
    }

  }


  goToMainPage() {
    this.router.navigate(['/main'])
  }
}
