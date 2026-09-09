import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { ComplaintService } from '../../services/complaint';


@Component({
  selector: 'app-user-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './user-dashboard.html',

  styleUrl: './user-dashboard.css'
})


export class UserDashboard implements OnInit {

  complaints: any[] = [];

  private complaintService =
    inject(ComplaintService);

  private cdr =
    inject(ChangeDetectorRef);


  ngOnInit(): void {

    console.log('USER DASHBOARD STARTED');

    const userId =
      localStorage.getItem('userId');

    console.log(
      'USER ID:',
      userId
    );


    if (!userId) {

      console.error(
        'No user ID found'
      );

      return;

    }


    this.loadComplaints(
      Number(userId)
    );

  }


  loadComplaints(userId: number): void {

    this.complaintService
      .getUserComplaints(userId)
      .subscribe({

        next: (data: any[]) => {

          console.log(
            'USER COMPLAINTS:',
            data
          );

          this.complaints = data;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'FAILED TO LOAD COMPLAINTS:',
            error
          );

        }

      });

  }

}