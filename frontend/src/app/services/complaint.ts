import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private http =
    inject(HttpClient);


  private api =
    'http://localhost:8080/api/complaints';


  // ==========================================
  // GET ALL COMPLAINTS
  // ==========================================

  getAllComplaints() {

    return this.http.get<any[]>(
      this.api
    );

  }


  // ==========================================
  // GET USER COMPLAINTS
  // ==========================================

  getUserComplaints(
    userId: number
  ) {

    return this.http.get<any[]>(
      `${this.api}/user/${userId}`
    );

  }


  // ==========================================
  // GET DEPARTMENT COMPLAINTS
  // ==========================================

  getDepartmentComplaints(
    department: string
  ) {

    return this.http.get<any[]>(
      `${this.api}/department/${department}`
    );

  }


  // ==========================================
  // UPDATE STATUS
  // ==========================================

  updateStatus(
    id: number,
    status: string
  ) {

    return this.http.put(
      `${this.api}/${id}/status?status=${status}`,
      {}
    );

  }


  // ==========================================
  // SUBMIT COMPLAINT
  // ==========================================

  submitComplaint(
    formData: FormData
  ) {

    return this.http.post(
      this.api,
      formData
    );

  }


  // ==========================================
  // UPLOAD RESOLVED IMAGE
  // ==========================================

  completeComplaint(
    id: number,
    resolvedImage: File
  ) {

    const formData =
      new FormData();


    formData.append(
      'resolvedImage',
      resolvedImage
    );


    return this.http.put(
      `${this.api}/${id}/complete`,
      formData
    );

  }

}