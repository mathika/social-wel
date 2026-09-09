import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name = '';
  password = '';
  phone = '';

  role = 'USER';

  // Common password for protected roles
  departmentAccessPassword = '';

  // Whether protected role has been verified
  accessVerified = false;

  private userService = inject(UserService);
  private router = inject(Router);

  roleChanged() {

    // USER does not need access password
    if (this.role === 'USER') {
      this.accessVerified = false;
      this.departmentAccessPassword = '';
      return;
    }

    // Any other role needs verification
    this.accessVerified = false;
    this.departmentAccessPassword = '';
  }

  verifyRoleAccess() {

    if (!this.departmentAccessPassword.trim()) {
      alert('Please enter the access password');
      return;
    }

    /*
     * TEMPORARY:
     * We will move this password verification
     * to Spring Boot in the next step.
     */
    const commonPassword = 'Department@123';

    if (this.departmentAccessPassword === commonPassword) {

      this.accessVerified = true;

      alert('Access verified successfully');

    } else {

      this.accessVerified = false;

      alert('Invalid access password');

    }
  }

  register() {

    if (this.role !== 'USER' && !this.accessVerified) {
      alert('Please verify the department access password first');
      return;
    }

    if (!this.name.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!this.password.trim()) {
      alert('Please enter your password');
      return;
    }

    if (!this.phone.trim()) {
      alert('Please enter your phone number');
      return;
    }

    console.log('REGISTER ROLE:', this.role);

    this.userService.register({
      name: this.name,
      password: this.password,
      phone: this.phone,
      role: this.role
    }).subscribe({

      next: (response: any) => {

        alert('Registration Successful!');

        console.log(response);

        this.router.navigate(['/']);

      },

      error: (error) => {

        console.log(error);

        if (error.error?.message) {
          alert(error.error.message);
        } else {
          alert('Registration Failed');
        }

      }

    });
  }
}