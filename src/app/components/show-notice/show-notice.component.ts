import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { baseUrl } from '../../constants/urls';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-show-notice',
  imports: [DatePipe, NgFor, ToastModule],
  templateUrl: './show-notice.component.html',
  styleUrl: './show-notice.component.scss',
  providers:[MessageService]
})
export class ShowNoticeComponent implements OnInit{
  notices: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private http: HttpClient, private messageService:MessageService) {}

  ngOnInit(): void {
    this.fetchNotices();
  }

  fetchNotices(): void {
    const apiUrl = `${baseUrl}api/notices/fetch`; // Replace with actual API URL

    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        if (!response.error && response.data) {
          this.notices = response.data;
        } else {
          this.error = 'Failed to load notices.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'An error occurred while fetching notices.';
        this.loading = false;
        console.error(err);
      }
    });
  }

}
