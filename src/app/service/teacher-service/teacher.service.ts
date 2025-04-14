import { Injectable } from "@angular/core";
import { baseUrl } from "../../constants/urls";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ResponseTo } from "../../interfaces/common";

@Injectable({
  providedIn: 'root',
})
export class TeacherService {


  constructor(private readonly http: HttpClient) { }

  saveTeacher(teacherData: any): Observable<any> {
    return this.http.post(
      `${baseUrl}users/register/teacher`,
      teacherData,
      { responseType: 'json' }
    );
  }

  updateTeacher(teacherData: any): Observable<any> {
    return this.http.put(
      `${baseUrl}users/update/teacher`,
      teacherData,
      { responseType: 'json' }
    );
  }
}