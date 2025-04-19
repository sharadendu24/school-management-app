import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule, NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { baseUrl } from '../../constants/urls';
import { StandardService } from '../../service/standard.service';
import { finalize } from 'rxjs';

interface ClassData {
  name: string;
  sections: string[];
}

export interface SubjectData {
  subjectName: string;
  subjectCode: string;
}

@Component({
  selector: 'app-class-section-subject-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  ],
  templateUrl: './class-section-subject-management.component.html',
  styleUrl: './class-section-subject-management.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ClassSectionSubjectManagementComponent implements OnInit {
  // Classes
  classes: ClassData[] = [];
  selectedClass: ClassData | null = null;
  classDialog: boolean = false;
  classForm: FormGroup;

  // Sections
  sections: string[] = [];
  selectedClassForSections: string | null = null;
  // Example sections options; in a real app these might come from a constant or API
  sectionsOptions: string[] = [];
  classesOptions: string[] = [];

  // Subjects
  subjectList: SubjectData[] = [];
  selectedClassForSubjects: ClassData | null = null;
  selectedSectionForSubjects: string | null = null;
  subjectDialog: boolean = false;
  subjectForm: FormGroup;
  editingSubjectIndex: number | null = null;

  sectionsOptionsForSubject: string[] | undefined = [];

  availableSections: any[] = [];

  exams: any[] = [];

  examForm: FormGroup;

  // API Base URL (adjust as necessary)
  baseUrl2: string = baseUrl + 'standard';

  constructor(
    private readonly http: HttpClient,
    private readonly fb: FormBuilder,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly standardService: StandardService
  ) {
    this.classForm = this.fb.group({
      name: ['', Validators.required],
      sections: [[], Validators.required],
    });

    this.subjectForm = this.fb.group({
      subjectName: ['', Validators.required],
      subjectCode: [''],
    });

    this.examForm = this.fb.group({
      examName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchAndSetBasics();
    this.getAllClasses();
    this.getExams();
  }

  //**********************
  // Basic Setup
  // ***********************

  fetchAndSetBasics() {
    // Fetch possible sections
    this.http.get<any>(`${this.baseUrl2}/possibleSections`).subscribe({
      next: (res) => {
        this.sectionsOptions = res.data;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching possibleSections API.',
        });
      },
    });

    // Fetch possible standards
    this.http.get<any>(`${this.baseUrl2}/possibleStd`).subscribe({
      next: (res) => {
        this.classesOptions = res.data;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Fetched Classes.',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching possibleStd API.',
        });
      },
    });
  }

  // ************************
  // Classes Management
  // ************************

  getAllClasses() {
    this.standardService.getAllClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
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

  openNewClass() {
    this.classForm.reset();
    this.classDialog = true;
    this.selectedClass = null;
  }

  editClass(cls: ClassData) {
    this.classForm.patchValue({
      name: cls.name,
      sections: cls.sections,
    });
    this.selectedClass = cls;
    this.classDialog = true;
  }

  saveClass() {
    if (this.classForm.invalid) {
      return;
    }
    const payload = this.classForm.value;
    if (this.selectedClass) {
      // Update existing class (using PUT)
      this.http.put<any>(`${this.baseUrl2}/`, payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Class updated',
          });
          this.getAllClasses();
          this.classDialog = false;
          this.selectedClass = null;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while updating class.',
          });
        },
      });
    } else {
      // Add new class (using POST)
      this.http.post<any>(`${this.baseUrl2}/`, payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Class added',
          });
          this.getAllClasses();
          this.classDialog = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while adding class.',
          });
        },
      });
    }
  }

  deleteClass(cls: ClassData) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + cls.name + '?',
      accept: () => {
        this.http.delete<any>(`${this.baseUrl2}/${cls.name}`).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Class deleted',
            });
            this.getAllClasses();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error while deleting class.',
            });
          },
        });
      },
    });
  }

  onClassChange() {
    this.sectionsOptionsForSubject = this.selectedClassForSubjects?.sections;
    this.loadSubjects();
  }

  // ************************
  // Sections Management
  // ************************

  addSection(event: Event) {
    //to be implemented
  }

  loadSections() {
    if (this.selectedClassForSections) {
      this.http
        .get<any>(`${this.baseUrl2}/${this.selectedClassForSections}`)
        .subscribe((res) => {
          this.sections = res.data;
        });
    }
  }

  updateSections() {
    if (!this.selectedClassForSections) {
      return;
    }
    // We use the PATCH endpoint to update the list of sections for the class.
    const payload = {
      name: this.selectedClassForSections,
      sections: this.sections,
    };
    this.http.patch<any>(`${this.baseUrl2}/`, payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Sections updated',
        });
        this.getAllClasses();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while updating sections.',
        });
      },
    });
  }

  deleteSection(section: string) {
    if (!this.selectedClassForSections) {
      return;
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete section ' + section + '?',
      accept: () => {
        this.http
          .delete<any>(
            `${this.baseUrl2}/${this.selectedClassForSections}/${section}`
          )
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Section deleted',
              });
              this.loadSections();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error while deleting section.',
              });
            },
          });
      },
    });
  }

  // ************************
  // Subjects Management
  // ************************

  loadSubjects() {
    if (this.selectedClassForSubjects) {
      this.standardService
        .getSubjectsByStandard(this.selectedClassForSubjects.name)
        .subscribe({
          next: (res) => {
            this.subjectList = res.data;
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                err.errors?.[0]?.message || 'Error while fetching subjects.',
            });
          },
        });
    }
  }

  openNewSubject() {
    this.subjectForm.reset();
    this.editingSubjectIndex = null;
    this.subjectDialog = true;
  }

  editSubject(subject: SubjectData, index: number) {
    this.subjectForm.patchValue({
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
    });
    this.editingSubjectIndex = index;
    this.subjectDialog = true;
  }

  saveSubject() {
    if (this.subjectForm.invalid) {
      return;
    }
    const subjectData: SubjectData = this.subjectForm.value;
    if (this.editingSubjectIndex !== null) {
      this.subjectList[this.editingSubjectIndex] = subjectData;
    } else {
      this.subjectList.push(subjectData);
    }
    this.subjectDialog = false;
  }

  deleteSubject(index: number) {
    this.subjectList.splice(index, 1);
  }

  updateSubjects() {
    if (this.selectedClassForSubjects) {
      this.http
        .post<any>(
          `${this.baseUrl2}/subjects/${this.selectedClassForSubjects.name}`,
          this.subjectList
        )
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Subjects updated',
            });
            this.loadSubjects();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.errors?.message || 'Error while updating subjects.',
            });
          },
        });
    }
  }

  /**Exam related issues begins here................................ */

  getExams() {
    const url = `${baseUrl}exam/`;

    this.http
      .get<any>(url)
      .pipe(
        finalize(() => {
          // Any cleanup logic can go here
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Response of get Exam is ', response);
          this.exams = response.data;
        },
        error: (error) => {
          console.log('The error inside adding Exam is ', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              error.error.errors[0]?.errorMessage ||
              'Failed to add exam. Please try again.',
            life: 7000,
          });
          console.error('API Error:', error);

          // Optional: Handle specific error cases
          if (error.status === 409) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Conflict',
              detail: 'Exam already exists',
              life: 7000,
            });
          }
        },
      });
  }

  addExam() {
    const url = `${baseUrl}exam/`;
    let params = new HttpParams();
    params = params.append('examName', this.examForm.value.examName);

    this.http
      .post<any>(url, params)
      .pipe(
        finalize(() => {
          // Any cleanup logic can go here
        })
      )
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Exam added successfully!',
            life: 5000,
          });
          this.getExams();
          // Update local state if needed
        },
        error: (error) => {
          console.log('The error inside adding Exam is ', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              error.error.errors[0]?.errorMessage ||
              'Failed to add exam. Please try again.',
            life: 7000,
          });
          console.error('API Error:', error);

          // Optional: Handle specific error cases
          if (error.status === 409) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Conflict',
              detail: 'Exam already exists',
              life: 7000,
            });
          }
        },
      });
    
  }
}