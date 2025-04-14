import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Exam, ExamResult, GetMarksResponse, GroupedMark } from '../../interfaces/common';
import { HttpClient } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { TabPanel, TabsModule } from 'primeng/tabs';
import { CommonModule, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { baseUrl } from '../../constants/urls';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-marks-management',
  imports: [
    DropdownModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    TableModule,
    TabsModule,
    FormsModule,
    NgIf,
    DialogModule,
    TabViewModule,
    ToastModule,
    ConfirmDialogModule,
    CheckboxModule,
  ],
  templateUrl: './marks-management.component.html',
  styleUrls: ['./marks-management.component.scss'],
  providers: [MessageService]
})
export class MarksManagementComponent implements OnInit {
  uploadForm: FormGroup;
  examList: Exam[] = [];
  subjects: any[] = []; // Sample subject codes
  marksResult: GetMarksResponse[] = [];
  searchUsername: string = '';

  groupedMarks: any[] = [];
  examColumns: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.uploadForm = this.fb.group({
      examId: [null, Validators.required],
      subjectCode: [null, Validators.required],
      markFields: this.fb.array([this.createMarkField()])
    });
  }

  ngOnInit(): void {
    this.loadExams();
    this.loadSubjects();

    this.uploadForm.get('examId')?.valueChanges.subscribe(() => this.checkSelections());
    this.uploadForm.get('subjectCode')?.valueChanges.subscribe(() => this.checkSelections());
  }

  // Create a mark field FormGroup
  createMarkField(): FormGroup {
    return this.fb.group({
      username: ['', Validators.required],
      marksObtained: [null, [ Validators.min(0)]],
      maxMarks: [null, [Validators.min(0)]],
      isPresent: [true]
    });
  }

  // Getter for markFields FormArray
  get markFields(): FormArray {
    return this.uploadForm.get('markFields') as FormArray;
  }

  // Add a new mark field group
  addMarkField(): void {
    this.markFields.push(this.createMarkField());
  }

  // Remove a mark field group by index (ensure at least one exists)
  removeMarkField(index: number): void {
    if (this.markFields.length > 1) {
      this.markFields.removeAt(index);
    }
  }

  // Load exam list for the dropdown
  loadExams() {
    const url = `${baseUrl}exam/`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.examList = res.data;
      },
      error: (err) => {
        console.error('Error loading exams', err);
      },
    });
  }

  // Load subjects list for the dropdown
  loadSubjects() {
    const url = `${baseUrl}standard/subjects/`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.subjects = res.data;
      },
      error: (err) => {
        console.error('Error loading subjects', err);
      },
    });
  }




  private checkSelections(): void {
    const exam = this.uploadForm.get('examId')?.value;
    const subject = this.uploadForm.get('subjectCode')?.value;
    
    if (exam && subject) {
      this.loadExistingMarks(exam.examId, subject.subjectCode);
    }
  }

  // New method to fetch existing marks
  private loadExistingMarks(examId: number, subjectCode: string): void {
    const url = `${baseUrl}exam/exam/${examId}/subject/${subjectCode}`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.populateFormFields(response.data);
        }else{
          this.populateFormFields([]);
        }
      },
      error: (err) => {
        console.error('Error loading existing marks', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load existing marks'
        });
      }
    });
  }

  // New method to populate form fields with existing data
  private populateFormFields(marksData: any[]): void {
    // Clear existing fields
    while (this.markFields.length !== 0) {
      this.markFields.removeAt(0);
    }

    // Add new fields for each existing mark
    marksData.forEach(mark => {
      this.markFields.push(this.fb.group({
        username: [mark.username, Validators.required],
        maxMarks: [mark.maxMarks, ],
        marksObtained: [mark.marksObtained],
        isPresent: [mark.isPresent ?? mark.marksObtained !== null]
      }));
    });

    // Add one empty field if no existing marks
    if (marksData.length === 0) {
      this.addMarkField();
    }
  }






  // Upload marks using the bulk API (sending multiple records in an array)
  uploadMarks() {
    if (this.uploadForm.invalid) {
      return;
    }

    const formValues = this.uploadForm.value;
    const payload = formValues.markFields.map((field: any) => ({
      username: field.username,
      subjectCode: formValues.subjectCode.subjectCode,
      examId: formValues.examId.examId,
      isPresent: field.isPresent,
      marksObtained: field.marksObtained,
      maxMarks: field.maxMarks,
    }));

    const url = `${baseUrl}exam/bulk`;
    this.http.post<any>(url, payload).subscribe({
      next: (response) => {
        console.log('Marks added succesfully!', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Marks have been uploaded successfully.',
        });
        // Reset the form and markFields to one default group
        this.uploadForm.reset();
        this.uploadForm.setControl('markFields', this.fb.array([this.createMarkField()]));
      },
      error: (error) => {
        console.error('Failed to add exam.', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.errors[0].errorMessage || 'Error while uploading Mark.',
        });
      },
    });
  }

  // Get marks for a student using their username
  getMarks() {
    if (!this.searchUsername) {
      return;
    }
    const url = `${baseUrl}exam/student/${this.searchUsername}`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.marksResult = response.data || response;
        this.processData();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Fetched Marks for the student.',
        });
      },
      error: (error) => {
        console.error('Error fetching marks', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.errors[0].errorMessage || 'Error while fetching Mark.',
        });
        this.marksResult = [];
        this.processData();
      },
    });
  }


  // Update your processData function
  processData() {
    const grouped: { [key: string]: GroupedMark } = {};
  
    this.marksResult.forEach(entry => {
      const key = `${entry.subjectCode}-${entry.subjectName}`;
      
      if (!grouped[key]) {
        grouped[key] = {
          subjectName: entry.subjectName,
          subjectCode: entry.subjectCode,
          exams: {}
        };
      }
      
      // Add type assertion for exam result
      grouped[key].exams[entry.examName] = {
        status: entry.status,
        maxMarks: entry.maxMarks,
        marksObtained: entry.marksObtained
      } as ExamResult;
    });
  
    this.groupedMarks = Object.values(grouped);
    this.examColumns = [...new Set(this.marksResult.map(m => m.examName))];
  }
  
  // Update getExamData with proper typing
  getExamData(exams: { [examName: string]: ExamResult }, examName: string): ExamResult | null {
    return exams[examName] || null;
  }







}
