import { Routes } from '@angular/router';
import { LoginComponent } from './auth-components/login/login.component';
import { RegisterComponent } from './auth-components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { FrontPageComponent } from './components/front-page/front-page.component';
import { ForgotPasswordComponent } from './auth-components/forgot-password/forgot-password.component';

export const routes: Routes = [
    {path: '', component:FrontPageComponent},
    {path: 'login', component:LoginComponent},
    {path: 'register', component:RegisterComponent},
    {path: 'home', component:HomeComponent},
    {path: 'forgot-password', component:ForgotPasswordComponent} // Redirect to home if no route is matched
];
