import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { UserDashboard } from './components/user-dashboard/user-dashboard';
import { SubmitComplaint } from './components/submit-complaint/submit-complaint';
import { MyComplaints } from './components/my-complaints/my-complaints';
import { Awareness } from './awareness/awareness';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { DepartmentDashboard } from './components/department-dashboard/department-dashboard';

export const routes: Routes = [

  {
    path: '',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'dashboard',
    component: UserDashboard
  },

  {
    path: 'submit-complaint',
    component: SubmitComplaint
  },

  {
    path: 'my-complaints',
    component: MyComplaints
  },

  {
  path: 'awareness',
  component: Awareness
},

  {
    path: 'admin',
    component: AdminDashboard
  },

  {
    path: 'department',
    component: DepartmentDashboard
  },

  {
    path: '**',
    redirectTo: ''
  }

];