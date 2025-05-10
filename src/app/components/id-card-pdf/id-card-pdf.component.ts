import { CommonModule } from '@angular/common';
import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QrCodeComponent } from 'ng-qrcode';
import { InputTextModule } from 'primeng/inputtext';

// Still have to do modification regarding showing image when printing pdf and also the boundary around the card has to be change according to the role.

@Component({
  standalone: true,
  selector: 'app-id-card-pdf',
  templateUrl: './id-card-pdf.component.html',
  styleUrls: ['./id-card-pdf.component.scss'],
  imports: [
    InputTextModule,
    FormsModule,
    CommonModule,
    QrCodeComponent
  ]
})
export class IdCardPdfComponent implements AfterViewInit {
  @Input() userData: any;
  @ViewChild('idCardContainer') idCardContainer!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => this.generatePDF(), 1000);
  }

  // Updated generatePDF() method
async generatePDF() {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [54, 86] // Credit card size in portrait
  });

  // Capture profile page
  const profilePage = this.idCardContainer.nativeElement.querySelector('.profile-page');
  const profileCanvas = await html2canvas(profilePage);
  const profileImg = profileCanvas.toDataURL('image/png');
  
  // Add profile page
  pdf.addImage(profileImg, 'PNG', 0, 0, 54, 86);

  // Add QR page
  const qrPage = this.idCardContainer.nativeElement.querySelector('.qr-page');
  const qrCanvas = await html2canvas(qrPage);
  const qrImg = qrCanvas.toDataURL('image/png');
  
  pdf.addPage([54, 86], 'portrait');
  pdf.addImage(qrImg, 'PNG', 0, 0, 54, 86);

  pdf.save(`${this.userData.username}_IDCard.pdf`);
}
}