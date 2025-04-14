import { Component } from '@angular/core';
import { Enquiry, ResponseTo } from '../../interfaces/common';
import { baseUrl } from '../../constants/urls';
import { StandardService } from '../../service/standard.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { map } from 'rxjs';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-enquiry-response',
  imports: [
    CardModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    NgFor,
    NgIf,
    MessageModule,
    ProgressSpinnerModule,
    DividerModule,
    ToastModule
  ],
  templateUrl: './enquiry-response.component.html',
  styleUrl: './enquiry-response.component.scss',
  providers: [MessageService],
})
export class EnquiryResponseComponent {
  selectedStandard: { name: string; sections: string[] } | null = null;
  selectedSection: string | null = null;
  selectedEnquiry: Enquiry | null = null;
  standards: { name: string; sections: string[] }[] = [];
  enquiries: Enquiry[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private standardService: StandardService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadStandards();
    this.fetchUnAnsweredEnquiries();
  }

  get sections(): string[] {
    return this.selectedStandard?.sections || [];
  }

  private loadStandards(): void {
    this.standardService.getAllClasses().subscribe({
      next: (standards: { name: string; sections: string[] }[]) =>
        (this.standards = standards),
      error: (error: any) => {
        console.error('Error loading standards:', error);
        this.errorMessage = 'Failed to load standards. Please try again later.';
      },
    });
  }

  fetchUnAnsweredEnquiries(): void {
    this.loading = true;
    this.errorMessage = '';
  
    const apiUrl = `${baseUrl}enquiry/fetch`;
  
    // Build query parameters
    let params = new HttpParams();
    if (this.selectedStandard) {
      params = params.set('standard', this.selectedStandard.name);
    }
    if (this.selectedSection) {
      params = params.set('section', this.selectedSection);
    }
  
    // Make the API call with query parameters
    this.http.get<ResponseTo<Enquiry[]>>(apiUrl, { params }).subscribe({
      next: (response) => {
        this.enquiries = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching enquiries:', error);
        this.errorMessage = 'Failed to load enquiries. Please try again.';
        this.loading = false;
      }
    });
    console.log(this.enquiries);
  }
  

  onStandardChange(): void {
    this.selectedSection = null; // Reset section when standard changes
    this.fetchUnAnsweredEnquiries();
  }

  onSectionChange(): void {
    this.fetchUnAnsweredEnquiries();
  }

  toggleSelection(enquiry: Enquiry): void {
    this.selectedEnquiry = this.selectedEnquiry === enquiry ? null : enquiry;
  }

  submitResponse(enquiry: Enquiry): void {
    if (!enquiry.answer?.trim()) return;

    // TODO: Implement actual answer submission
    let params = new HttpParams();
    params = params.set('answer', enquiry.answer);

    this.http.patch(`${baseUrl}enquiry/answer/${enquiry.id}`, params).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Answer for the enquiry has been submitted.',
        });
        this.fetchUnAnsweredEnquiries();
        this.selectedEnquiry = null;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while submitting answer to the Enquiry.',
        });
        console.error('Error submitting answer:', error);
        this.errorMessage = 'Failed to submit answer. Please try again.';
      }
    });
  }
}
