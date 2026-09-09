import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private api = 'https://social-wel.onrender.com/api/users';

  register(user: any) {
    return this.http.post(`${this.api}/register`, user);
  }

  login(user: any) {
    return this.http.post(`${this.api}/login`, user);
  }
}
