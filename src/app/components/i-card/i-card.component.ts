import { Component, OnInit } from '@angular/core';
import { ICardUserData } from '../../interfaces/common';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { QrCodeComponent } from 'ng-qrcode';
import { baseUrl } from '../../constants/urls';
import {NgxPrintModule} from 'ngx-print';

@Component({
  selector: 'app-i-card',
  providers:[DatePipe],
  imports: [InputTextModule, FormsModule, NgIf, QrCodeComponent, CommonModule, NgxPrintModule ],
  templateUrl: './i-card.component.html',
  styleUrl: './i-card.component.scss'
})
export class ICardComponent implements OnInit{
  username: string = '';
  userData: ICardUserData | null = null;
  loading: boolean = false;
  error: string | null = null;


  

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Removed initial fetch
  }

  fetchUserData() {
    if (!this.username.trim()) return;
    
    this.loading = true;
    this.userData = null;
    this.error = null;

    this.http.get<any>(`${baseUrl}users/iCard`, { 
      params: { username: this.username } 
    }).subscribe({
      next: (response) => {
        if (response.error) {
          this.error = 'User not found';
          return;
        }
        this.userData = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error fetching user data';
        this.loading = false;
      }
    });
  }

  printCard(cardId: string) {
    window.print();

    //Still have to complete the print logic............
  }
  
  

}
