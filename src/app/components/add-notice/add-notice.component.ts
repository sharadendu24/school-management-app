import { Component } from '@angular/core';
import { baseUrl } from '../../constants/urls';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { NgIf } from '@angular/common';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-add-notice',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    DialogModule,
    NgIf,
    ToastModule
  ],
  templateUrl: './add-notice.component.html',
  styleUrl: './add-notice.component.scss',
  providers: [MessageService],
})
export class AddNoticeComponent {
  displayAddNotice = false;
  today = new Date();
  noticeForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.noticeForm = this.fb.group({
      subject: ['', Validators.required],
      content: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });
  }

  get f() {
    return this.noticeForm.controls;
  }

  showAddNoticeDialog() {
    this.submitted = false;
    this.noticeForm.reset();
  }

  onSubmit() {
    this.submitted = true;

    if (this.noticeForm.invalid) return;

    this.http
      .post(`${baseUrl}api/notices/save`, this.noticeForm.value)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Notice created successfully',
            life: 3000,
          });
          this.noticeForm.reset();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.errors[0]?.errorMessage || 'Failed to create notice',
            life: 5000,
          });
        },
      });
  }
}
