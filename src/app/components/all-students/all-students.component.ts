import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonTableComponent } from '../common-components/common-table/common-table.component';
import { filter, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { baseUrl } from '../../constants/urls';
import { TableModule } from 'primeng/table';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { StandardService } from '../../service/standard.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-all-students',
  imports: [CommonTableComponent, TableModule, ToastModule],
  templateUrl: './all-students.component.html',
  styleUrl: './all-students.component.scss',
  providers: [MessageService],
})
export class AllStudentsComponent implements OnInit {

  constructor(
    private readonly http: HttpClient,
    private readonly standardService: StandardService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAllClasses();
    this.fetchStudents();
  }

  students = [];

  columns = [
    {
      value: 'USERNAME',
      key: 'userName',
      filterable: true,
      filterType: 'menu',
    },
    { value: 'ROLL_NO', key: 'rollNumber', sortable: true },
    { value: 'NAME', key: 'name' },
    {
      value: 'STANDARD',
      key: 'standard',
      filterable: true,
      filterType: 'dropdown',
      filterOptions: [] as {
        name: string;
        sections: string[];
      }[],
      filterOptionLabel: 'name',
      filterOptionValue: 'name',
    },
    {
      value: 'SECTION',
      key: 'section',
      filterable: true,
      filterType: 'dropdown',
      filterOptions: [] as string[],
    },
    { value: 'PHONE', key: 'phoneNumber' },
    { value: 'EMAIL', key: 'emailId' },
    { value: 'PARENTS_NAME', key: 'parentsName' },
    { value: 'AADHAR', key: 'aadharId' },
  ];

  tableProps: any = {
    rows: 10,
    first: 0,
    sortField: 'rollNumber',
    sortOrder: 1,
    totalRecords: 0,
  };
  loading = false;

  totalRecords = 0;
  currentPage = 0;
  pageSize = 10;
  sortField = 'rollNumber';
  sortOrder = 1; // 1 for asc, -1 for desc
  filters: any = {};

  getAllClasses() {
    this.standardService.getAllClasses().subscribe({
      next: (classes) => {
        this.columns[3].filterOptions = classes;
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

  fetchStudents() {
    this.getStudents().subscribe(
      (response) => {
        this.students = response.data.students;
      },
      (error) => {
        console.error('Error fetching students:', error);
      }
    );
  }

  getStudents(
    rollNumber?: string,
    std?: string,
    section?: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'rollNumber',
    direction: string = 'asc'
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction)
      .set('std', std ?? '')
      .set('section', section ?? '');

    if (rollNumber) params = params.set('rollNumber', rollNumber);
    if (std) params = params.set('std', std);
    if (section) params = params.set('section', section);

    return this.http.get<any>(`${baseUrl}student/`, { params });
  }

  // Handle events from the table component
  handleTableEvent(event: any) {
    console.log('Event received:', event);
    switch (event.type) {
      case 'load':
        this.loadStudents(event.data);
        break;
      case 'globalSearch':
        this.handleGlobalSearch(event.data.value);
        break;
      case 'columnFilter':
        this.handleColumnFilter(event.data);
        break;
      case 'clearFilters':
        this.clearAllFilters();
        break;
    }
  }

  // Load students based on the provided parameters
  private loadStudents(params: LazyLoadEvent) {
    // calculate paging + sort params
    const page = (params.first ?? 0) / (params.rows ?? this.pageSize);
    const size = params.rows ?? this.pageSize;
    const sortBy = params.sortField ?? 'rollNumber';
    const direction = params.sortOrder === 1 ? 'asc' : 'desc';

    // pull out any filter values you care about
    const rollNumber = this.filters['rollNumber'];
    const std = this.filters['standard'];
    const section = this.filters['section'];

    // now call your getStudents() abstraction
    this.getStudents(
      rollNumber,
      std,
      section,
      page,
      size,
      sortBy,
      direction
    ).subscribe(
      (response) => {
        this.students = response.data.students;
        this.totalRecords = response.data.totalElements;
        this.tableProps.totalRecords = response.data.totalElements;
        console.log('Now students are :', this.students);
      },
      (err) => {
        // optionally handle error
        console.error('Error loading students', err);
      }
    );
  }

  private handleGlobalSearch(value: string) {
    this.filters['global'] = value;
    this.loadStudents({
      first: 0,
      rows: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    });
  }

  // Handle column filter changes
  private handleColumnFilter(filterData: any) {

    this.filters[filterData.column] = filterData.value;

    if (filterData.column === 'standard') {
      const selectedStandard = filterData.value;
      const standardColumn = this.columns.find((col) => col.key === 'standard');
      const sectionColumn = this.columns.find((col) => col.key === 'section');

      if (selectedStandard && standardColumn?.filterOptions) {
        const selectedStandardObj = standardColumn.filterOptions.find(
          (std: any) => std.name === selectedStandard
        );

        // Type-safe section column update
        if (sectionColumn) {
          sectionColumn.filterOptions =
            typeof selectedStandardObj === 'object' &&
            selectedStandardObj?.sections
              ? selectedStandardObj.sections
              : [];
        }
      }

      // Clear section filter only if section column exists
      if (sectionColumn) {
        this.filters['section'] = null;
      }
    }

    this.loadStudents({
      first: 0,
      rows: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    });
  }

  // Clear all filters and reload students
  private clearAllFilters() {
    this.filters = {};
    this.loadStudents({
      first: 0,
      rows: this.pageSize,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
    });
  }
}
