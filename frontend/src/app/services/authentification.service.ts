import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSigninDTO, UserSignupDTO } from '../DTOs/UserDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}
  
  register(email: String, firstName: String, lastName: String): Observable<UserSignupDTO>{
    return this.http.post<UserSignupDTO>(`${this.apiUrl}/register`, {email,firstName,lastName});
  }

  sendHashedPassword(userEmail: string, hashedPassword: string) {
    return this.http.post(`${this.apiUrl}/register/hashedpassword`, { userEmail, hashedPassword });
  }

  login(email: String): Observable<UserSigninDTO> {
    return this.http.post<UserSigninDTO>(`${this.apiUrl}/login`, email);
  }
}
