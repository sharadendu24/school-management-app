import { HttpInterceptorFn } from '@angular/common/http';
import { cognito } from './constants/constants';


export const myInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const username=localStorage.getItem(`CognitoIdentityServiceProvider.${cognito.userPoolClientId}.LastAuthUser`) as string;
  const authToken = localStorage.getItem(`CognitoIdentityServiceProvider.${cognito.userPoolClientId}.${username}.accessToken`) as string;
  const idToken = localStorage.getItem(`CognitoIdentityServiceProvider.${cognito.userPoolClientId}.${username}.idToken`) as string;
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: authToken ? `Bearer ${authToken}` : '',
      idToken
    }
  });
  return next(clonedRequest);
};
