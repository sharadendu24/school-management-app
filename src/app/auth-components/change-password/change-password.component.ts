// change-password.component.ts
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  imports: [ReactiveFormsModule, NgIf],
})
export class ChangePasswordComponent {
  @Input() useCase: 'changePassword' | 'confirmSignUp' = 'changePassword';
  @Output() closed = new EventEmitter<boolean>();
  registerForm: FormGroup;
  showOtpModal = false;
  otpMode: 'both' | 'phone' | 'email' = 'both';
  emailOtp = '';
  usernameExists = false;
  errorMessage = '';
  private destroyed$ = new Subject<void>();


  constructor(
    private readonly fb: FormBuilder,
    private readonly cognitoService: CognitoService
  ) {
    this.registerForm = this.fb.group(
      {
        currentPassword: [],
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

    this.registerForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.errorMessage = '';
      });
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
  

async changePassword() {
  try {
    await this.cognitoService.changePassword(this.registerForm.get('currentPassword')?.value, this.registerForm.get('password')?.value);

  } catch (error) {
    this.errorMessage = (error as { message?: string })?.message || 'An error occurred while changing the password.';
    console.error(this.errorMessage);
  }
}

  passwordsMatchValidator(
    formGroup: AbstractControl
  ): { [key: string]: any } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }


  closeDialog(){
    this.closed.emit(true);
  }


  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
