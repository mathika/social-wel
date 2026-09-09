import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  name = '';
  password = '';

  private userService = inject(UserService);
  private router = inject(Router);


  login(): void {

    this.userService.login({
      name: this.name,
      password: this.password
    }).subscribe({

      next: (response: any) => {

        console.log('LOGIN RESPONSE:', response);


        // Save common user information

        localStorage.setItem(
          'userId',
          String(response.id)
        );

        localStorage.setItem(
          'userName',
          response.name
        );

        localStorage.setItem(
          'role',
          response.role
        );


        // --------------------------------
        // SAVE DEPARTMENT
        // --------------------------------

        if (
          response.role === 'WATER' ||
          response.role === 'GARBAGE' ||
          response.role === 'DRAINAGE' ||
          response.role === 'STREETLIGHT'
        ) {

          localStorage.setItem(
            'department',
            response.role
          );

        } else {

          // USER and ADMIN do not need a department

          localStorage.removeItem('department');

        }


        // --------------------------------
        // DEBUG LOGS
        // --------------------------------

        console.log(
          'SAVED USER ID:',
          localStorage.getItem('userId')
        );

        console.log(
          'SAVED USER NAME:',
          localStorage.getItem('userName')
        );

        console.log(
          'SAVED ROLE:',
          localStorage.getItem('role')
        );

        console.log(
          'SAVED DEPARTMENT:',
          localStorage.getItem('department')
        );


        alert('Login Successful!');


        // --------------------------------
        // NAVIGATION
        // --------------------------------

        if (response.role === 'USER') {

          this.router.navigate(['/dashboard']);

        }

        else if (response.role === 'ADMIN') {

          this.router.navigate(['/admin']);

        }

        else {

          // WATER / GARBAGE / DRAINAGE /
          // STREETLIGHT

          this.router.navigate(['/department']);

        }

      },


      error: (error) => {

        console.error(
          'LOGIN ERROR:',
          error
        );

        alert('Invalid Username or Password');

      }

    });

  }

}