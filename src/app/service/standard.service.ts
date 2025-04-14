import { Injectable } from "@angular/core";
import { baseUrl } from "../constants/urls";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
  })

export class StandardService{

    private readonly baseUrl: string = baseUrl + 'standard';

  constructor(private readonly http: HttpClient) {}

  getAllClasses(): Observable<any> {
    return this.http.get<{ data: any[] }>(`${this.baseUrl}/`).pipe(
      map(response => response.data.map(cls => ({
        name: cls.name,
        sections: cls.sections
      })))
    );
  }


  getSubjectsByStandard(standardName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/subjects/${standardName}`);
  }
  

}