import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {

    const userId = localStorage.getItem('userId');

    if (!userId) {
      return;
    }

    this.complaintService.getUserComplaints(Number(userId))
      .subscribe(data => {

        this.complaints = [...data];

        this.cdr.detectChanges();

      });

  }

}