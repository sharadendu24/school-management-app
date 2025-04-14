import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../constants/urls';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { NgClass, NgIf } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { TeacherService } from '../../service/teacher-service/teacher.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ResponseTo } from '../../interfaces/common';

@Component({
  selector: 'app-onboard-teacher',
  templateUrl: './onboard-teacher.component.html',
  styleUrls: ['./onboard-teacher.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    DatePickerModule,
    NgIf,
    SelectModule,
    MultiSelectModule,
    NgClass,
    InputTextModule,
    ToastModule
  ],
  providers:[MessageService]
})
export class OnboardTeacherComponent {
  @Input() teacherData: any;
  @Output() formSubmit = new EventEmitter<any>();

  teacherForm: FormGroup;
  usernameAvailability: { available: boolean; message: string } | null = null;
  checkingUsername = false;
  subjects: any[] = [];
  isSubmitting=false;
  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private teacherService:TeacherService, private messageService:MessageService) {
    this.teacherForm = this.fb.group({
      username: ['', [Validators.required]],
      name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      birthdate: [null, [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      profileLink: ['', [Validators.required]],
      subjectIds: [[]],
      expInMonths: [null],
      expInRelSubjectInMonths: [null],
    });
  }

  ngOnInit(): void {
    if (this.teacherData) {
      this.teacherForm.patchValue({
        ...this.teacherData,
        birthdate: new Date(this.teacherData.birthdate),
      });
    }
    this.setupUsernameValidation();
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
  

  private setupUsernameValidation(): void {
    this.teacherForm
      .get('username')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((username) => {
          this.usernameAvailability = null;
          if (!username) return of(null);

          this.checkingUsername = true;
          return this.checkUsernameAvailability(username).pipe(
            map((response) => ({
              exists: response.data,
              error: response.error,
              message: response.error
                ? response.errors?.[0]?.message || 'Error checking username'
                : null,
            })),
            catchError((error) =>
              of({
                exists: null,
                error: true,
                message:
                  error.error?.errors?.[0]?.message ||
                  error.message ||
                  'Failed to check username availability',
              })
            )
          );
        })
      )
      .subscribe((response) => {
        this.checkingUsername = false;
        if (!response) return;

        this.usernameAvailability = response.error
          ? {
              available: false,
              message: response.message,
            }
          : {
              available: !response.exists,
              message: response.exists
                ? '! Username is already taken.'
                : 'Username is available.',
            };
      });
  }

  private checkUsernameAvailability(username: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}users/check-username`, {
      params: { username },
    });
  }

  onSubmit() {
    if (this.teacherForm.invalid) {
      console.log("Inside invalid form......................")
      this.markFormGroupTouched(this.teacherForm);
      return;
    }
  
    this.isSubmitting = true;
  
    const formData = {
      ...this.teacherForm.value
    };
    console.log("Data are ................ ",this.isSubmitting," and formdata is ",formData);
    const operation$ = this.teacherData 
      ? this.teacherService.updateTeacher(formData)
      : this.teacherService.saveTeacher(formData);
  
    operation$.subscribe({
      next: (response: ResponseTo<any>) => {
        console.log("data is", response.data);
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.data as string || (this.teacherData ? 'Teacher updated successfully' : 'Teacher have been onboarded Successfully.')
        });
        this.formSubmit.emit(formData);
        if (!this.teacherData) this.teacherForm.reset();
      },
      error: (error) => {
        this.isSubmitting = false;
        console.log("error is ", error.error.errors[0].errorMessage);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.errors[0].errorMessage || 'Error while onboarding teacher.'
        });
      }
    });
  }
}
