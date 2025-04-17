import { Component } from '@angular/core';
import { Enquiry, ResponseTo } from '../../interfaces/common';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, NgModel } from '@angular/forms';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { baseUrl } from '../../constants/urls';

@Component({
  selector: 'app-enquiry',
  imports: [
    CardModule,
    InputTextModule,
    NgIf,
    ScrollPanelModule,
    FormsModule,
    DatePipe,
    ButtonModule,
    ToastModule,
    NgForOf
  ],
  templateUrl: './enquiry.component.html',
  styleUrl: './enquiry.component.scss',
  providers:[MessageService, DatePipe]
})
export class EnquiryComponent {
  enquiries: Enquiry[] = [];
  newQuestion: string = '';

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchMyEnquiry();
  }

  fetchMyEnquiry() {
    this.http.get<ResponseTo<any[]>>(`${baseUrl}enquiry/raisedByMe`)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.enquiries = data.data.map(e => ({
            ...e,
            raisedOn: new Date(e.raisedOn),
            answeredOn: e.answeredOn ? new Date(e.answeredOn) : null
          }));
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch enquiries'
          });
        }
      });
  }

  submitEnquiry() {
    if (!this.newQuestion.trim()) return;

    const encodedQuestion = encodeURIComponent(this.newQuestion.trim());
    const apiUrl = `${baseUrl}enquiry/raise?question=${encodedQuestion}`;

    this.http.post(apiUrl, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.newQuestion = '';
        this.fetchMyEnquiry();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Enquiry submitted successfully',
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to submit enquiry',
        });
      },
    });
  }
}
