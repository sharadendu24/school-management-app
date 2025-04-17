import { Injectable } from '@angular/core';
import { Amplify } from 'aws-amplify';
import {
  confirmSignIn,
  ConfirmSignInInput,
  confirmSignUp,
  getCurrentUser,
  signIn,
  signOut,
  signUp,
  resetPassword,
  confirmResetPassword
} from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { cognito } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  email = '';
  password = '';

  constructor(private readonly router: Router) {
    Amplify.configure({
      Auth: {
        Cognito: cognito,
      },
    });
  }

  async isUsernameAvailable(user: any): Promise<any> {
    //adminGetUser(user);
  }

  async signUp(user: any): Promise<any> {
    try {
      let signUpObj = {
        username: user.username,
        password: user.password,
        options: {
          userAttributes: {
            name: user.name,
            address: user.address,
            birthdate: user.birthdate,
            gender: user.gender,
            picture: user.picture,
            email: user.email,
            phone_number: '+91' + user.phone_number,
          },
        },
      };
      const res = await signUp(signUpObj);
      console.log('Sign-up successful:', signUpObj, 'returned -> ', res);
      return res;
    } catch (error) {
      console.error('Error signing up:', error);
      return error;
    }
  }

  async confirmSignUp(user: any): Promise<any> {
    await confirmSignUp({
      username: user.username,
      confirmationCode: user.emailOtp,
    });
    console.log({
      username: user.username,
      confirmationCode: user.emailOtp,
    });
  }

  public getCurrentUserName(): string {
    return localStorage.getItem(
      `CognitoIdentityServiceProvider.${cognito.userPoolClientId}.LastAuthUser`
    ) as string;
  }

  public getCurrentUserAccessToken(): string {
    return localStorage.getItem(
      `CognitoIdentityServiceProvider.${
        cognito.userPoolClientId
      }.${this.getCurrentUserName()}.accessToken`
    ) as string;
  }

  public getCurrentUserIdToken(): string {
    return localStorage.getItem(
      `CognitoIdentityServiceProvider.${
        cognito.userPoolClientId
      }.${this.getCurrentUserName()}.idToken`
    ) as string;
  }

  public async signIn(email: string, password: string): Promise<any> {
    try {
      const signInResponse = await signIn({
        username: email,
        password: password,
      }).then(async (user) => {
        return user;
      });

      if (
        signInResponse.nextStep.signInStep ===
          'CONFIRM_SIGN_IN_WITH_SMS_CODE' ||
        signInResponse.nextStep.signInStep ===
          'CONFIRM_SIGN_IN_WITH_EMAIL_CODE' ||
        signInResponse.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE'
      ) {
        // collect OTP from user through screens.
        await confirmSignIn({
          challengeResponse: '123456',
        });
      }

      if (
        signInResponse.nextStep.signInStep ===
        'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
      ) {
        console.log('inside CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED');
        console.log(signInResponse);
        return new Promise((resolve) =>
          resolve('CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED')
        );
      } else if (signInResponse.isSignedIn) {
        console.log(
          'Sign In completely successfull and storing token in localstorage.',
          signInResponse.nextStep.signInStep
        );
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      if (error instanceof Error) {
        if (
          error.name === 'NotAuthorizedException' ||
          error.message.includes('Incorrect username or password.')
        ) {
          throw new Error('Invalid username or password. !');
        }
      }
      return { success: false, message: 'An error occurred while signing in' };
    }
  }

  confirmSignIn(newPassword: string) {
    confirmSignIn({
      challengeResponse: newPassword,
    } as ConfirmSignInInput).then(
      (res) => {
        this.router.navigate(['/home'])
        console.log('result is ', res);
      },
      (err) => {
        console.log('error is', err);
      }
    );
  }

  public async signOut() {
    await signOut().then((res) => {
      console.log(res);
      console.log('Signed out!');
      this.router.navigate(['/login']);
    });
  }

  public isAuthenticated(callback: (isAuthenticated: boolean) => void): void {
    console.log(
      this.getCurrentUserName(),
      this.getCurrentUserAccessToken(),
      this.getCurrentUserIdToken()
    );
    getCurrentUser()
      .then((res) => {
        console.log('User ', res.username, ' is Authenticated.');
        callback(res.username.length > 0);
      })
      .catch((error) => {
        console.error('Error fetching current user:', error);
        callback(false);
      });
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    return false;
  }

public async forgotPassword(username: string): Promise<void> {
  try {
    const data = await resetPassword({username});
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
  
    /**
    * This method is used to confirm the password reset for a user.
    * @param username - The username of the user.
    * @param newPassword - The new password for the user.
    * @param confirmationCode - The confirmation code sent to the user's email or phone.
    */
public async forgotPasswordSubmit(
  username: string,
  newPassword: string,
  confirmationCode: string
): Promise<void> {
  try {
    const data = await confirmResetPassword({username, newPassword, confirmationCode});
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}



  public getUser() {}

  public updateUser(user: any) {}
}
