import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { UserSigninDTO, UserSignupDTO } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private apiUrl = 'http://localhost:5000';
  private readonly _authState = new BehaviorSubject<boolean>(false);  

  private readonly state = {
    $authState: signal<boolean>(false)
  } as const;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  get authState$(): Observable<boolean> {
    return this._authState.asObservable();
  }

  private setAuthState(authState: boolean): void {
    this._authState.next(authState);
  }

  registerWithoutPassword(email: string, firstName: string, lastName: string, role: string): Observable<UserSignupDTO> {
  return this.http.post<UserSignupDTO>(`${this.apiUrl}/register`, { email, firstName, lastName, role });
  }

  sendHashedPassword(email: string, password: string): Observable<UserSignupDTO> {
    return this.http.post<UserSignupDTO>(`${this.apiUrl}/register_up`, { email, password });
  }

  login(email: String): Observable<UserSigninDTO> {
    return this.http.post<UserSigninDTO>(`${this.apiUrl}/login_send`, { email });
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

  verifyToken(token: string, userId: number): Observable<object> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/verify-token`, { token, user_id: userId })
  }

  getUserInfo(): Token {
    const token = this.getToken();
    const decodedToken = this.decodeToken(token)
    return decodedToken;
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.getToken();
    const decodedToken = this.decodeToken(token);
    const userId = decodedToken?.user_id;

    if (!token || !userId) {
      this.setAuthState(false);
      return of(false);
    }
    return this.verifyToken(token, userId).pipe(
      map(() => {
        this.setAuthState(true);
        return true;
      }),
      catchError(() => {
        this.setAuthState(false);
        return of(false);
      })
    );
  }

  decodeToken(token: string): any {
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken;
    } catch (error) {
      console.error('Erreur lors du décodage du token', error);
      return null;
    }
  }

  getToken(): string {
    return localStorage.getItem('access_token') ?? '';
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.setAuthState(false);
  }
}
