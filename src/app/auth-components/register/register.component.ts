import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CognitoService } from '../../service/cognito.service';
import { NgIf } from '@angular/common';
import { OtpComponent } from '../otp/otp.component';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgIf, OtpComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  showOtpModal = false;
  otpMode: 'both' | 'phone' | 'email' = 'both';
  emailOtp="";
  usernameExists=false;

  constructor(private readonly fb: FormBuilder, private readonly cognitoService: CognitoService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      username:['', [
        Validators.required, 
        Validators.pattern(/^\S*$/)
      ]],
      password:['',[Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)]],
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      picture: [null],
      emailOTP: [''],
      phoneOTP: ['']
    });
  }

  ngOnInit(): void {
    
  }


  sendEmailOTP(): void {
    const email = this.registerForm.get('email')?.value;
    // You can use AWS Amplify's API to send OTP to the email
    this.cognitoService.signUp({
      username: email,
      password: 'temporaryPassword1!',
      //attributes: { email }
    })
    .then(() => alert('Email OTP sent'))
    .catch((err) => console.error('Error sending email OTP:', err));
  }

  async onSubmit(): Promise<any> {
    if (this.registerForm.valid) {
      
      const formData = this.registerForm.value;
      console.log('Form Data:', formData);
      localStorage.setItem("signUpUser",formData.username)
      const res=await this.cognitoService.signUp(formData);
      console.log("Inside onsubmit ====================", res);
      if(res.nextStep.signUpStep==="CONFIRM_SIGN_UP"){
        this.openOtpModal();
      }
      if(res==="UsernameExistsException: User already exists"){
        console.log("*****************************************");
        this.usernameExists=true;
      }
    
      
    } else {
      console.error('Form is not valid');
    }
  }





  //================================ BELLOW METHODS ARE RELATED TO OTP MODAL ================================================


  openOtpModal() {
    this.showOtpModal = true;
  }



  
}

