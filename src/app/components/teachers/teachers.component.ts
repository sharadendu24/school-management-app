import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../constants/urls';
import { CommonTableComponent } from '../common-components/common-table/common-table.component';

@Component({
  selector: 'app-teachers',
  imports: [CommonTableComponent],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss'
})
export class TeachersComponent {
  constructor(private readonly http: HttpClient) {}

  ngOnInit(){
    this.fetchStudents();
  }

  data = [
    { name: "Sharad", std: "5", phoneNumber: "8888888888" },
    { name: "Shubham", std: "4", phoneNumber: "9999999999" },
    { name: "Sharad", std: "4", phoneNumber: "8888888888" },
    { name: "Shubham", std: "5", phoneNumber: "9999999999" },
    { name: "Sharad", std: "4", phoneNumber: "8888888888" },
    { name: "Shubham", std: "5", phoneNumber: "9999999999" },
    { name: "Sharad", std: "9", phoneNumber: "8888888888" },
    { name: "Shubham", std: "5", phoneNumber: "9999999999" },
    { name: "Sharad", std: "5", phoneNumber: "8888888888" },
    { name: "Shubham", std: "5", phoneNumber: "9999999999" },
    { name: "Sharad", std: "7", phoneNumber: "8888888888" },
    { name: "Shubham", std: "5", phoneNumber: "9999999999" },
    { name: "Sharad", std: "5", phoneNumber: "8888888888" },
    { name: "Shubham", std: "5", phoneNumber: "9999999999" }
  ];

  columns = [
    { value: "USERNAME", key: "userName" },
    { value: "ROLL_NO", key: "rollNumber" },
    { value: "NAME", key: "name" },
    { value: "STANDARD", key: "standard" },
    { value: "SECTION", key: "section" },
    { value: "PHONE", key: "phoneNumber" },
    { value: "EMAIL", key: "emailId" },
    { value: "PARENTS_NAME", key: "parentsName" },
    { value: "AADHAR", key: "aadharId" },
  ];

  tableProperties = {};


  fetchStudents(){
    this.getStudents().subscribe(response => {
    this.data = response.data.students;
  }, error => {
    console.error('Error fetching students:', error);
  });

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
      .set('direction', direction);

    if (rollNumber) params = params.set('rollNumber', rollNumber);
    if (std) params = params.set('std', std);
    if (section) params = params.set('section', section);

    return this.http.get<any>(`${baseUrl}student/`, { params });
  }
}
