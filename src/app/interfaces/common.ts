export interface ResponseTo<T>{
    error:boolean,
    errors:[{
        errorCode:string,
        errorMessage:string
    }]
    data:T
}

export interface Enquiry {
    id?: number;
    question: string;
    answer?: string;
    raisedBy?: string;
    answeredBy?: string;
    raisedOn?: Date;
    answeredOn?: Date;
    isDeleted?: boolean;
  }



  export interface ICardUserData {
    username: string;
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    dob: string;
    gender?: string;
    profilePic?: string;
    role: string;
    std?: string | null;
    section?: string | null;
    rollNo?: number | null;
  }




  export interface Exam {
    examId: number;
    examName: string;
  }
  
  export interface GetMarksResponse {
    markId: number;
    username: string;
    subjectName: string;
    subjectCode: string;
    examName: string;
    marksObtained?: number;
    maxMarks?: number;
    status?: string;
    isPassed: boolean;
    isDeleted: boolean;
    isPresent?: boolean; // Optional field for attendance
  }


  export interface ExamResult {
    status: string;
    maxMarks: number | null;
    marksObtained: number | null;
  }
  
  export interface GroupedMark {
    subjectName: string;
    subjectCode: string;
    exams: { [examName: string]: ExamResult };
  }

  export interface Student {
    username: string;
    name: string;
    rollNo: number;
    isPresent: boolean;
    status?: string;
    comment?: string;
  }
  