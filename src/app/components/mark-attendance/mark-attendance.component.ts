import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { Student } from '../../interfaces/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { baseUrl } from '../../constants/urls';
import { NgFor, NgIf } from '@angular/common';
import { StandardService } from '../../service/standard.service';

@Component({
  selector: 'app-mark-attendance',
  imports: [
    TabsModule,
    TabViewModule,
    ToastModule,
    DatePickerModule,
    TableModule,
    CheckboxModule,
    SelectModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    NgFor,
    NgIf,
  ],
  templateUrl: './mark-attendance.component.html',
  styleUrl: './mark-attendance.component.scss',
  providers: [MessageService],
})
export class MarkAttendanceComponent {
  students: any[] = [];
  attendences: any[] =[];
  selectedDate: Date = new Date();
  statusOptions = ['Late', 'Absent', 'Leave', 'Other'];
  cols = [
    { field: 'name', header: 'Name' },
    { field: 'rollNumber', header: 'Roll No' },
    { field: 'isPresent', header: 'Present' },
    { field: 'status', header: 'Status' },
    { field: 'comment', header: 'Comment' },
  ];

  colsForShow = [
    { field: 'userName', header: 'Username' },
    { field: 'name', header: 'Name' },
    { field: 'rollNumber', header: 'Roll No' },
    { field: 'isPresent', header: 'Present' },
    { field: 'status', header: 'Status' },
    { field: 'comment', header: 'Comment' },
  ];

  standardOptions: any[] = [];
  sectionOptions: any[] = [];

  selectedStandard: any;
  selectedSection: string = '';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private stdService: StandardService
  ) {}

  ngOnInit() {
    // this.fetchStudents('FIRST', 'A');
    this.fetchStandards();
  }

  fetchStudents(std: string, section: string) {
    this.http
      .get<any>(`${baseUrl}student/?std=${std}&section=${section}`)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.students = res.data.students;
        },
        error: (err) => this.showError('Failed to fetch students'),
      });
  }

  fetchStandards() {
    this.stdService.getAllClasses().subscribe({
      next: (std) => {
        this.standardOptions = std;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching classes.',
        });
      },
    });
  }


  onStandardChange(){
    this.sectionOptions=this.selectedStandard.sections;
    this.selectedSection=""
  }

  onSectionChange(){
    this.fetchStudents(this.selectedStandard.name, this.selectedSection);
  }


  onStandardChangeForFetch(){
    this.sectionOptions=this.selectedStandard.sections;
    this.selectedSection=""
  }

  onSectionChangeForFetch(){
    this.fetchAttendence(this.selectedStandard.name, this.selectedSection, this.formatDate(this.selectedDate));
  }


  fetchAttendence(std: string, section: string, date:any) {
    this.http
      .get<any>(`${baseUrl}attendance/fetch/${std}/${section}/${date}`)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.attendences = res.data;
          console.log(this.attendences);
        },
        error: (err) =>{
          this.showError('Failed to fetch students');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while fetching students.',});
        }
      });
  }




  uploadAttendance() {
    const attendanceData = this.students.map((student) => ({
      username: student.userName,
      date: this.formatDate(this.selectedDate),
      present: student.isPresent,
      status: student.status ?? '',
      comment: student.comment ?? '',
    }));
    console.log("The attendence data which will be save is :",attendanceData);

    this.http.post(`${baseUrl}attendance/markBulk`, attendanceData).subscribe({
      next: () =>
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Attendence have been uploaded successfully.',
        }),
      error: () => this.showError('Failed to upload attendance'),
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private showError(message: string) {}
}
