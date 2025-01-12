import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  email: string = '';
  message: string = '';
  error: string = '';
  @Output() notification = new EventEmitter<string>();

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

 
  async resetPassword(): Promise<void> {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const email = this.resetPasswordForm.value.email;
    this.notification.emit(`<div class="flex gap-4"><img src="imgs/icons/send.svg" alt=""> E-Mail gesendet</div>`)
    try {
      await this.authService.resetPassword(email);
      this.message = 'Passwort-Zurücksetzen-E-Mail wurde gesendet.';
      this.error = '';
    } catch (error) {
      console.error('Fehler beim Zurücksetzen des Passworts:', error);
      this.error = 'Fehler beim Senden der E-Mail.';
      this.message = '';
    }
  }
}


