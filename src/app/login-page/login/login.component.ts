import { Component, OnInit } from '@angular/core';
import {
  Auth,
  User,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import { FirebaseService } from '../../shared/services/firebase.service';
import { User as AppUser } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  failed: boolean = false;

  constructor(
    private auth: Auth,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.logOutUser();
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });


  }

  ngOnInit(): void {
    this.logOutUser();
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then((result) => {
        this.updateFirebase(result.user);
        this.goToMainPage();
      })
      .catch((error) => {
        console.error('Error during Google sign-in:', error);
      });
  }

  updateFirebase(user: any) {
    this.firebaseService.addUser(this.getUserInfosFromGoogle(user));
  }

  getUserInfosFromGoogle(user: any): AppUser {
    return new AppUser({
      email: user.email,
      id: user.uid,
      image: user.photoURL,
      name: user.displayName,
      status: 'online',
      isNotGoogle: false,
    });
  }

  logOutUser() {
    this.authService.logout();
  }

  async onLogin() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        const userCredentail = await this.authService.login(email, password);
        if (userCredentail) {
          this.goToMainPage();
        } else {
          this.failed = true;
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  async guestLogin() {
    const userCredentail = await this.authService.login("gast@gast.de", "qweqwe")
    if (userCredentail) {
      this.goToMainPage();
    } else {
      this.failed = true
    }
  }

  goToMainPage() {
    this.router.navigate(['/main']);
  }
}
