import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComplaintService } from '../../services/complaint';


@Component({
  selector: 'app-department-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './department-dashboard.html',
  styleUrl: './department-dashboard.css'
})
export class DepartmentDashboard implements OnInit {

  complaints: any[] = [];

  department = '';

  private complaintService =
    inject(ComplaintService);

  private cdr =
    inject(ChangeDetectorRef);


  ngOnInit(): void {

    console.log(
      'DEPARTMENT DASHBOARD STARTED'
    );


    /*
      IMPORTANT

      Your login.ts saves the department role
      in localStorage as "role".

      Example:

      WATER
      DRAINAGE
      GARBAGE
      STREETLIGHT_ROAD
    */

    const role =
      localStorage.getItem('role');


    console.log(
      'LOGGED USER ROLE:',
      role
    );


    if (
      !role ||
      role === 'USER' ||
      role === 'ADMIN'
    ) {

      console.error(
        'No department role found'
      );

      return;

    }


    this.department = role;


    console.log(
      'Fetching complaints for:',
      this.department
    );


    this.loadComplaints();

  }


  // ==========================================
  // LOAD DEPARTMENT COMPLAINTS
  // ==========================================

  loadComplaints(): void {

    this.complaintService
      .getDepartmentComplaints(
        this.department
      )
      .subscribe({

        next: (data: any[]) => {

          console.log(
            'API RESPONSE:',
            data
          );


          this.complaints = Array.isArray(data)
            ? [...data]
            : [];


          console.log(
            'COMPLAINTS STORED:',
            this.complaints
          );


          console.log(
            'TOTAL:',
            this.complaints.length
          );


          this.cdr.detectChanges();

        },


        error: (err) => {

          console.error(
            'API ERROR:',
            err
          );

        }

      });

  }


  // ==========================================
  // CHANGE STATUS
  // ==========================================

  updateStatus(
    id: number,
    status: string
  ): void {

    console.log(
      'STATUS UPDATE:',
      id,
      status
    );


    this.complaintService
      .updateStatus(id, status)
      .subscribe({

        next: (updatedComplaint: any) => {

          console.log(
            'UPDATED COMPLAINT:',
            updatedComplaint
          );


          const index =
            this.complaints.findIndex(
              (complaint: any) =>
                complaint.id === id
            );


          if (index !== -1) {

            this.complaints[index] =
              updatedComplaint;

          }


          this.cdr.detectChanges();

        },


        error: (err) => {

          console.error(
            'STATUS UPDATE ERROR:',
            err
          );


          alert(
            'Unable to update complaint status'
          );


          // Reload the original data
          this.loadComplaints();

        }

      });

  }


  // ==========================================
  // UPLOAD RESOLVED IMAGE + COMPLETE
  // ==========================================

  completeComplaint(
    id: number,
    files: FileList | null
  ): void {

    console.log(
      'COMPLETE COMPLAINT:',
      id
    );


    // No file selected

    if (
      !files ||
      files.length === 0
    ) {

      alert(
        'Please select the resolved image first.'
      );

      return;

    }


    const file =
      files[0];


    console.log(
      'RESOLVED IMAGE:',
      file.name
    );


    this.complaintService
      .completeComplaint(
        id,
        file
      )
      .subscribe({

        next: (updatedComplaint: any) => {

          console.log(
            'COMPLETED COMPLAINT:',
            updatedComplaint
          );


          const index =
            this.complaints.findIndex(
              (complaint: any) =>
                complaint.id === id
            );


          if (index !== -1) {

            this.complaints[index] =
              updatedComplaint;

          }


          alert(
            'Complaint completed successfully!'
          );


          this.cdr.detectChanges();

        },


        error: (err) => {

          console.error(
            'COMPLETE COMPLAINT ERROR:',
            err
          );


          alert(
            'Unable to complete complaint'
          );

        }

      });

  }

}