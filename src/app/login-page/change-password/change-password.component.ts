import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, MinLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth, confirmPasswordReset } from '@angular/fire/auth';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  mode: string | null = null;
  oobCode: string | null = null;
  newPassword: string = '';
  message: string = '';
  error: string = '';
  changePasswordForm: FormGroup;
  @Output() notification = new EventEmitter<string>();

  constructor(private route: ActivatedRoute, private auth: Auth, private router: Router, private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group({
      password1: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
    }, {
      validators: this.passwordsMatchValidator // Inline-Validator hier
    });

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.mode = params['mode'];
      this.oobCode = params['oobCode'];
      if (this.mode !== 'resetPassword' || !this.oobCode) {
        this.error = 'Ungültige Anfrage.';
        return;
      }
    });
  }

  passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password1 = group.get('password1')?.value;
    const password2 = group.get('password2')?.value;

    return password1 === password2 ? null : { passwordsDontMatch: true };
  }


  async resetPassword(): Promise<void> {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    if (!this.oobCode || !this.newPassword) {
      this.error = 'Bitte geben Sie ein gültiges neues Passwort ein.';
      return;
    }
    const newPassword = this.changePasswordForm.get('password1')?.value;

    try {
      this.notification.emit("Anmelden")
      await confirmPasswordReset(this.auth, this.oobCode, newPassword);
      this.message = 'Passwort erfolgreich geändert.';
      this.error = '';
      this.router.navigate(['/login']); // Weiterleitung zur Login-Seite
    } catch (error) {
      console.error('Fehler beim Zurücksetzen des Passworts:', error);
      this.error = 'Das Zurücksetzen des Passworts ist fehlgeschlagen.';
      this.message = '';
    }
  }
}
