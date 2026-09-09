import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { ComplaintService } from '../../services/complaint';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  complaints: any[] = [];

  totalComplaints = 0;
  pendingComplaints = 0;
  inProgressComplaints = 0;
  completedComplaints = 0;

  private complaintService = inject(ComplaintService);

  private cdr = inject(ChangeDetectorRef);


  ngOnInit(): void {

    console.log('ADMIN DASHBOARD STARTED');

    this.loadComplaints();

  }


  loadComplaints(): void {

    console.log(
      'CALLING: http://localhost:8080/api/complaints'
    );


    this.complaintService.getAllComplaints().subscribe({

      next: (response: any) => {

        console.log(
          'ADMIN API RESPONSE:',
          response
        );


        if (Array.isArray(response)) {

          this.complaints = response;

        } else {

          console.error(
            'INVALID API RESPONSE:',
            response
          );

          this.complaints = [];

        }


        this.calculateCounts();


        console.log(
          'COMPLAINTS STORED:',
          this.complaints
        );

        console.log(
          'TOTAL:',
          this.totalComplaints
        );


        // IMPORTANT
        // Force Angular to update the HTML

        this.cdr.detectChanges();

      },


      error: (error) => {

        console.error(
          'ADMIN API ERROR:',
          error
        );

      }

    });

  }


  calculateCounts(): void {

    this.totalComplaints =
      this.complaints.length;


    this.pendingComplaints =
      this.complaints.filter(
        complaint =>
          complaint.status === 'PENDING'
      ).length;


    this.inProgressComplaints =
      this.complaints.filter(
        complaint =>
          complaint.status === 'IN_PROGRESS' ||
          complaint.status === 'IN PROGRESS'
      ).length;


    this.completedComplaints =
      this.complaints.filter(
        complaint =>
          complaint.status === 'COMPLETED'
      ).length;


    console.log(
      'COUNT VALUES:',
      this.totalComplaints,
      this.pendingComplaints,
      this.inProgressComplaints,
      this.completedComplaints
    );

  }

}