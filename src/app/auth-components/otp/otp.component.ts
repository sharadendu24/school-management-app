import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CognitoService } from '../../service/cognito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent {
  @Input() mode: 'both' | 'phone' | 'email' = 'both'; // Input to set the mode
  //@Output() submitOtp = new EventEmitter<{ emailOtp?: string, phoneOtp?: string }>();

  otpForm: FormGroup;
  isWrongOtp = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly cognitoService: CognitoService,
    private readonly router: Router
  ) {
    this.otpForm = this.fb.group({
      emailOtp: ['', [Validators.pattern(/^\d{6}$/)]], // 6-digit OTP for email
      phoneOtp: ['', [Validators.pattern(/^\d{6}$/)]], // 6-digit OTP for phone
    });
  }

  ngOnInit() {
    if (this.mode === 'email') {
      this.otpForm.get('phoneOtp')?.disable();
      this.otpForm
        .get('emailOtp')
        ?.setValidators([Validators.required, Validators.pattern(/^\d{6}$/)]);
    } else if (this.mode === 'phone') {
      this.otpForm.get('emailOtp')?.disable();
      this.otpForm
        .get('phoneOtp')
        ?.setValidators([Validators.required, Validators.pattern(/^\d{6}$/)]);
    } else if (this.mode === 'both') {
      this.otpForm
        .get('emailOtp')
        ?.setValidators([Validators.required, Validators.pattern(/^\d{6}$/)]);
      this.otpForm
        .get('phoneOtp')
        ?.setValidators([Validators.required, Validators.pattern(/^\d{6}$/)]);
    }
    this.otpForm.updateValueAndValidity();
  }

  async onSubmit() {
    if (this.otpForm.valid) {
        const otpData = {
          username: localStorage.getItem('signUpUser'),
          emailOtp: this.otpForm.get('emailOtp')?.value,
          phoneOtp: this.otpForm.get('phoneOtp')?.value,
        };
        console.log('OTP Submitted:', otpData);

        try{
          const res = await this.cognitoService.confirmSignUp(otpData);
          console.log(res);
          this.router.navigate(['/login']);
        }
        catch (error) {
          console.log(error);
          this.isWrongOtp = true;
        }        
    }
  }
  abortRegistration() {
    //have to implement the logic to delete user from cognito as well.
    this.router.navigate(['/..']);
  }
}
