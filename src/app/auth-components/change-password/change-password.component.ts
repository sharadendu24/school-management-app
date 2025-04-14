// change-password.component.ts
import { Component, Input, NgModule } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CognitoService } from '../../service/cognito.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  imports: [ReactiveFormsModule, NgIf],
})
export class ChangePasswordComponent {
  @Input() useCase: 'changePassword' | 'confirmSignUp' = 'changePassword';
  registerForm: FormGroup;
  showOtpModal = false;
  otpMode: 'both' | 'phone' | 'email' = 'both';
  emailOtp = '';
  usernameExists = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly cognitoService: CognitoService
  ) {
    this.registerForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
            ),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
            ),
          ],
        ],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  async onSubmit(): Promise<any> {
    if (this.useCase === 'confirmSignUp') {
      this.confirmSignUp();
    }
    if (this.useCase === 'changePassword') {
      this.changePassword();
    }
  }

  confirmSignUp() {
    
    const password = this.registerForm.get('password')?.value;
    this.cognitoService.confirmSignIn(password);
  }
  

  changePassword() {
    //have to implement it later.
  }

  private passwordsMatchValidator(
    formGroup: AbstractControl
  ): { [key: string]: any } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
