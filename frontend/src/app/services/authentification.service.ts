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
  
  registerWithoutPassword(email: string, firstName: string, lastName: string): Observable<UserSignupDTO> {
    return this.http.post<UserSignupDTO>(`${this.apiUrl}/register`, { email, firstName, lastName });
  }

  sendHashedPassword(email: string, password: string): Observable<UserSignupDTO> {
    return this.http.post<UserSignupDTO>(`${this.apiUrl}/register_up`, { email, password });
  }

  login(email: String): Observable<UserSigninDTO> {
    return this.http.post<UserSigninDTO>(`${this.apiUrl}/login_send`, {email});
  }

  loginWithPassword(email: string, password: string): Observable<UserSigninDTO> {
    return this.http.post<UserSigninDTO>(`${this.apiUrl}/login`, { email, password: password });
  }
  

  async hashPassword(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    const saltData = encoder.encode(salt);
  
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
  
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltData,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
  
    const hashArray = Array.from(new Uint8Array(derivedBits));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashedPassword;
  }
  
}  
