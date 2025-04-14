import {
  NgClass,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
} from '@angular/common';
import { Component } from '@angular/core';
import { TeachersComponent } from '../teachers/teachers.component';
import { MyProfileComponent } from '../myprofile/myprofile.component';

import { Router } from '@angular/router';

import { CognitoService } from '../../service/cognito.service';
import { EnquiryComponent } from '../enquiry/enquiry.component';
import { EnquiryResponseComponent } from '../enquiry-response/enquiry-response.component';
import { ExtrasComponent } from '../extras/extras.component';
import { AllStudentsComponent } from "../all-students/all-students.component";
import { ClassSectionSubjectManagementComponent } from "../class-section-subject-management/class-section-subject-management.component";
import { MarksManagementComponent } from '../marks-management/marks-management.component';
import { RegisterStudentsComponent } from '../register-students/register-students.component';

import { JwtHelperService } from '@auth0/angular-jwt';
import { tabs } from '../../constants/home-constants';
import { OnboardTeacherComponent } from "../onboard-teacher/onboard-teacher.component";
import { ICardComponent } from "../i-card/i-card.component";
import { ShowNoticeComponent } from "../show-notice/show-notice.component";
import { AddNoticeComponent } from "../add-notice/add-notice.component";
import { MarkAttendanceComponent } from "../mark-attendance/mark-attendance.component";
import { MyPerformanceComponent } from "../my-performance/my-performance.component";

@Component({
  selector: 'app-home',
  imports: [
    NgSwitch,
    NgIf,
    NgFor,
    NgSwitchCase,
    NgSwitchDefault,
    NgClass,
    TeachersComponent,
    MyProfileComponent,
    MarksManagementComponent,
    EnquiryComponent,
    EnquiryResponseComponent,
    ExtrasComponent,
    AllStudentsComponent,
    ClassSectionSubjectManagementComponent,
    ClassSectionSubjectManagementComponent,
    RegisterStudentsComponent,
    OnboardTeacherComponent,
    ICardComponent,
    ShowNoticeComponent,
    AddNoticeComponent,
    MarkAttendanceComponent,
    MyPerformanceComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  username: string = '';
  isMenuVisible: boolean = false;
  selectedComponent: string = 'profile';
  groups:string[]=[];

  constructor(
    private readonly cognitoService: CognitoService,
    private readonly router: Router
  ) {
    this.username = this.cognitoService.getCurrentUserName();
  }


  // Add these in your component class
tabs = tabs;

filteredTabs: any[] = [];


  ngOnInit() {
    this.filteredTabs = this.tabs.filter(tab => 
      tab.children.some(child => this.hasPermission(child.allowedRoles))
    );
    this.cognitoService.isAuthenticated((isAuthenticated) => {
      isAuthenticated /**NOSONAR */
        ? console.log('# User has been logged in succesfully.')
        : this.router.navigate(['/login']);
    });
    this.fetchBasicInfo();
  }


  toggleTab(clickedTab: any) {
    this.tabs.forEach(tab => {
      if (tab !== clickedTab) {
        tab.expanded = false;
      }
    });
    
    clickedTab.expanded = !clickedTab.expanded;
  }
  

  fetchBasicInfo(){
    const helper = new JwtHelperService();
    const token=this.cognitoService.getCurrentUserAccessToken();
    const decodedJwt=helper.decodeToken(token);
    this.groups=decodedJwt['cognito:groups'];
    console.log("Login User having groups as =>  ",this.groups);
  }

  hasPermission(allowedGroups: string[]): boolean {
    if (!this.groups || !Array.isArray(this.groups)) return false;
    if (this.groups.includes('SUPERADMIN')) return true; // Can be removed in future.
    return allowedGroups.some(group => this.groups.includes(group));
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  navigateTo(component: string) {
    console.log(component);
    this.selectedComponent = component;
    this.toggleMenu();
  }

  logout() {
    if (window.confirm('Are you sure you want to log out?').valueOf()) {
      this.cognitoService.signOut();
    }
  }
}
