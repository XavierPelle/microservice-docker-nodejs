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
  
  registerWithoutPassword(email: string, firstName: string, lastName: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register/withoutpassword`, { email, firstName, lastName });
  }

  sendHashedPassword(userEmail: string, hashedPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/hashedpassword`, { userEmail, hashedPassword });
  }

  login(email: String): Observable<UserSigninDTO> {
    return this.http.post<UserSigninDTO>(`${this.apiUrl}/login/salt`, email);
  }

  loginWithPassword(email: string, hashedPassword: string): Observable<UserSigninDTO> {
    return this.http.post<UserSigninDTO>(`${this.apiUrl}/login`, { email, password: hashedPassword });
  }
  

  async hashPassword(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
