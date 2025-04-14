import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { baseUrl } from '../../constants/urls';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, Observable, of, switchMap } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { StandardService } from '../../service/standard.service';

@Component({
  selector: 'app-register-students',
  imports: [
    InputTextModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    DatePickerModule,
    CardModule,
    ReactiveFormsModule,
    CommonModule,
    InputNumberModule
  ],
  templateUrl: './register-students.component.html',
  providers: [MessageService],
  styleUrl: './register-students.component.scss',
})
export class RegisterStudentsComponent {

  @Input() studentData: any;
  @Output() formSubmit = new EventEmitter<any>();

  studentForm: FormGroup;
  usernameAvailability: { available: boolean; message: string } | null = null;
  checkingUsername = false;
  isSubmitting = false;

  loadingSections=false;
  loadingStandards=false;

  // Options for dropdowns
  standardOptions : [{name?:string,sections?:[string]}]=[{}];
  sectionOptions = [];
  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  // Password validation pattern
  passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService,
    private standardService:StandardService
  ) {
    this.studentForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      name: ['', [Validators.required]],
      rollNumber: [null, [Validators.required]],
      aadharId: ['', [Validators.required, Validators.pattern(/^\d{12}$|^\d{16}$/)]],
      gender: ['', [Validators.required]],
      birthdate: [null, [Validators.required]],
      address: ['', [Validators.required]],
      profileLink: ['', [Validators.required]],
      standard: [null, [Validators.required]],
      section: [null, [Validators.required]],
      parentsName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (this.studentData) {
      this.studentForm.patchValue({
        ...this.studentData,
        birthdate: new Date(this.studentData.birthdate)
      });
    }
    this.setupUsernameValidation();
    this.getAllClasses();

  }

  getAllClasses() {
    this.loadingStandards = true;
    this.standardService.getAllClasses().pipe(
      finalize(() => (this.loadingStandards = false))
    ).subscribe({
      next: (classes) => {
        this.standardOptions = classes;
        
        // Update sectionOptions based on the current form's standard selection.
        const selectedStandard = this.studentForm.get('standard')?.value;
        if (selectedStandard && selectedStandard.sections) {
          this.sectionOptions = selectedStandard.sections;
        } else if (classes && classes.length) {
          // Optionally, set a default standard (first in the list) and update sections.
          this.studentForm.patchValue({ standard: classes[0] });
          this.sectionOptions = classes[0].sections;
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while fetching classes.' });
      }
    });
  }

  private setupUsernameValidation(): void {
    this.studentForm.get('username')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(username => {
        this.usernameAvailability = null;
        if (!username) return of(null);

        this.checkingUsername = true;
        return this.checkUsernameAvailability(username).pipe(
          map(response => ({
            exists: response.data,
            error: response.error,
            message: response.error 
              ? response.errors?.[0]?.message || 'Error checking username'
              : null
          })),
          catchError(error => of({
            exists: null,
            error: true,
            message: error.error?.errors?.[0]?.message || 
                   error.message || 
                   'Failed to check username availability'
          }))
        );
      })
    ).subscribe(response => {
      this.checkingUsername = false;
      if (!response) return;

      this.usernameAvailability = response.error ? {
        available: false,
        message: response.message
      } : {
        available: !response.exists,
        message: response.exists ? 'Username is already taken' : 'Username is available'
      };
    });
  }

  private checkUsernameAvailability(username: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}users/check-username`, { 
      params: { username } 
    });
  }

  onSubmit() {
    if (this.studentForm.invalid) {
      this.markFormGroupTouched(this.studentForm);
      return;
    }

    this.isSubmitting = true;
    const formData = this.prepareFormData();

    const operation$ = this.studentData 
      ? this.http.put(`${baseUrl}users/update/student`, formData)
      : this.http.post(`${baseUrl}users/register/student`, formData);

    operation$.subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message || 'Student registration successful'
        });
        this.formSubmit.emit(formData);
        if (!this.studentData) this.studentForm.reset();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Registration failed. Please try again.'
        });
      }
    });
  }

  private prepareFormData() {
    return {
      ...this.studentForm.value,
      birthdate: this.studentForm.value.birthdate?.toISOString()?.split('T')[0],
      standard: this.studentForm.value.standard.name
    };
  }


  private loadStandards(): void {
    this.loadingStandards = true;
    this.http.get<any>(`${baseUrl}standard/possibleStd`)
      .pipe(
        catchError(error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load standards'
          });
          return of(null);
        })
      )
      .subscribe(response => {
        this.loadingStandards = false;
        if (response?.data) {
          this.standardOptions = response.data.map((std: string) => ({
            label: std,
            value: std
          }));
        }
      });
  }

  private loadSections(): void {
    this.loadingSections = true;
    this.http.get<any>(`${baseUrl}standard/possibleSections`)
      .pipe(
        catchError(error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load sections'
          });
          return of(null);
        })
      )
      .subscribe(response => {
        this.loadingSections = false;
        if (response?.data) {
          this.sectionOptions = response.data.map((section: string) => ({
            label: section,
            value: section
          }));
        }
      });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onStdChange(){
    const selectedStandard = this.studentForm.get('standard')?.value;
    this.sectionOptions = selectedStandard.sections;
        
  }
  
}
