import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintService } from '../../services/complaint';

@Component({
  selector: 'app-my-complaints',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-complaints.html',
  styleUrl: './my-complaints.css'
})
export class MyComplaints implements OnInit {

  complaints: any[] = [];

  private complaintService = inject(ComplaintService);

  ngOnInit(): void {

    console.log('MY COMPLAINTS LOADED');

    const userId = localStorage.getItem('userId');

    console.log('USER ID:', userId);

    if (!userId) {
      console.error('NO USER ID');
      return;
    }

    this.complaintService
      .getUserComplaints(Number(userId))
      .subscribe({
        
        next: (response: any[]) => {

          console.log('BACKEND RESPONSE:', response);

          this.complaints = response;

        },

        error: (error: any) => {

          console.error('API ERROR:', error);

        }

      });
  }
}