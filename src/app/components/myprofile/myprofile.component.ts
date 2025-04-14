import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { HttpClient} from '@angular/common/http';
import { baseUrl } from '../../constants/urls';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-myprofile',
  imports: [
    ReactiveFormsModule,
    CalendarModule,
    ButtonModule,
    FormsModule,
    ToggleButtonModule
  ],
  templateUrl: './myprofile.component.html',
  styleUrl: './myprofile.component.scss',
})
export class MyProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userData: any;

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      profilePic: [''],
      gender: [''],
      dob: [''],
    });

    this.getUserData().subscribe(
      (data) => {
        this.userData = data.data;
        console.log('User Data:', data);
  
        this.profileForm.patchValue({
          name: this.userData.name || '',
          email: this.userData.email || '',
          phone: this.userData.phoneNumber || '',
          address: this.userData.address || '',
          dob: this.userData.dob || '',
          gender:this.userData.gender || '',
          profilePic:this.userData.profilePic || ''
        });
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  

  getUserData(): Observable<any> {
    const apiUrl = `${baseUrl}users/getuser`;
    return this.http.get<any>(apiUrl);
  }

  

  // Handle saving the updated profile.
  onSave(): void {
    if (this.profileForm.valid) {
      console.log('Updated Profile:', this.profileForm.value);
      // Add your API call or save logic here.
      // Optionally, turn off edit mode after a successful save.
      
    }
  }
}
