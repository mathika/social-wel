import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplaintService } from '../../services/complaint';

@Component({
  selector: 'app-submit-complaint',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './submit-complaint.html',
  styleUrl: './submit-complaint.css'
})
export class SubmitComplaint {

  description = '';

  image: File | null = null;

  latitude: number | null = null;

  longitude: number | null = null;

  private complaintService = inject(ComplaintService);

  private router = inject(Router);


  // ================================
  // IMAGE
  // ================================

  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      this.image = input.files[0];

      console.log(
        'IMAGE SELECTED:',
        this.image.name
      );

    }

  }


  // ================================
  // LOCATION
  // ================================

  getLocation(): void {

    if (!navigator.geolocation) {

      alert(
        'Geolocation is not supported by your browser.'
      );

      return;

    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        this.latitude =
          position.coords.latitude;

        this.longitude =
          position.coords.longitude;


        console.log(
          'LATITUDE:',
          this.latitude
        );

        console.log(
          'LONGITUDE:',
          this.longitude
        );


        alert(
          'Location Captured Successfully!'
        );

      },

      (error) => {

        console.error(
          'LOCATION ERROR:',
          error
        );

        alert(
          'Unable to get your location. Please allow location permission.'
        );

      }

    );

  }


  // ================================
  // SUBMIT COMPLAINT
  // ================================

  submitComplaint(): void {

    const userId =
      localStorage.getItem('userId');


    console.log(
      'USER ID:',
      userId
    );


    // CHECK USER LOGIN

    if (!userId) {

      alert(
        'User session not found. Please login again.'
      );

      this.router.navigate(['/']);

      return;

    }


    // CHECK LOCATION

    if (
      this.latitude === null ||
      this.longitude === null
    ) {

      alert(
        'Please click "Get Current Location" first.'
      );

      return;

    }


    // CREATE FORMDATA

    const formData =
      new FormData();


    formData.append(
      'userId',
      userId
    );


    formData.append(
      'description',
      this.description
    );


    formData.append(
      'latitude',
      this.latitude.toString()
    );


    formData.append(
      'longitude',
      this.longitude.toString()
    );


    // IMAGE

    if (this.image) {

      formData.append(
        'image',
        this.image
      );

    }


    console.log(
      'SUBMITTING COMPLAINT...'
    );


    // API CALL

    this.complaintService
      .submitComplaint(formData)
      .subscribe({

        next: (response) => {

          console.log(
            'COMPLAINT CREATED:',
            response
          );


          alert(
            'Complaint Submitted Successfully! 🎉'
          );


          this.router.navigate([
            '/my-complaints'
          ]);

        },


        error: (error) => {

          console.error(
            'COMPLAINT SUBMISSION ERROR:',
            error
          );


          alert(
            'Complaint Submission Failed ❌'
          );

        }

      });

  }

}