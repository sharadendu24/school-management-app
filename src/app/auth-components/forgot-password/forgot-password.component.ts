import { Component, NgModule } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CognitoService } from '../../service/cognito.service';
import { CommonModule, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
// Import your Cognito service here

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    NgIf,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    CommonModule,
  ],
  providers: [MessageService],
})
export class ForgotPasswordComponent {
  step: number = 1;
  loading: boolean = false;
  username: string = '';
  resetForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: MessageService,
    private readonly cognitoService: CognitoService
  ) {
    this.resetForm = this.fb.group(
      {
        newPassword: ['', [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ]],
        confirmationCode: ['', Validators.required],
        confirmNewPassword: ['', Validators.required],
      },
      {
        validators: [
          // Add cross-field validation for password matching
          (formGroup: FormGroup) => {
            const newPassword = formGroup.get('newPassword')?.value;
            const confirmNewPassword =
              formGroup.get('confirmNewPassword')?.value;

            // Check if passwords match
            return newPassword === confirmNewPassword
              ? null
              : { passwordMismatch: true };
          },
        ],
      }
    );
  }

  async requestResetCode(username: string) {
    this.loading = true;
    try {
      const data = await this.cognitoService.forgotPassword(username);
      this.username = username;
      if (
        data.nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE'
      )
        this.step = 2;
      this.messageService.add({
        severity: 'success',
        summary: 'Code Sent',
        detail: 'A verification code has been sent to your email',
      });
    } catch (err) {
      console.error('Error during requestResetCode:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to send verification code',
      });
      throw err; // Rethrow the error to ensure it's not silently swallowed
    } finally {
      this.loading = false;
    }
  }

  async confirmReset() {
    if (this.resetForm.invalid) return;

    this.loading = true;
    try {
      await this.cognitoService.forgotPasswordSubmit(
        this.username,
        this.resetForm.value.newPassword,
        this.resetForm.value.confirmationCode
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Password Reset',
        detail: 'Your password has been reset successfully',
      });
      this.resetForm.reset();
      this.step = 1;
    } catch (err) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Failed to reset password. Please check the code and try again.',
      });
    } finally {
      this.loading = false;
    }
  }
}
