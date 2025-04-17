import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CognitoService } from '../../service/cognito.service';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf, DialogModule, ToastModule, ChangePasswordComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers:[ DialogService]
})
export class LoginComponent {
  isEmailLogin: boolean = false; // Boolean to toggle between email and username login
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showNewPasswordDialogue=false;

  constructor(
    private readonly cognitoService: CognitoService,
    private readonly router: Router,
    private readonly dialogService:DialogService
  ) {}

  ngOnInit() {
    this.cognitoService.isAuthenticated((isAuthenticated) => {
      isAuthenticated ? this.router.navigate(['/home']) : console.log('Good to go for login.');
    });
  }

  toggleLoginMethod() {
    this.isEmailLogin = !this.isEmailLogin;
    this.username = '';
    this.email = '';
    this.password = '';
  }

  async onSubmit() {
    console.log(this.email, this.username, this.password);
    if (this.isEmailLogin && !this.email) {
      this.errorMessage = 'Please enter your email address.';
    } else if (!this.isEmailLogin && !this.username) {
      this.errorMessage = 'Please enter your username.';
    } else if (!this.password) {
      this.errorMessage = 'Please enter your password.';
    } else {
      try {
        await this.cognitoService.signIn(
          this.isEmailLogin ? this.email : this.username,
          this.password
        ).then(res=>{
          if(res==="CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"){
            console.log("*********************************************")
            this.showNewPasswordDialogue=true;
          }
        })
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error message in login component is ", error);
          this.errorMessage = error.message;
        }
      }
    }
  }

  clearErrorMessage() {
    this.errorMessage = '';
  }


}
