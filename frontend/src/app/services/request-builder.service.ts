import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { AuthentificationService } from './authentification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RequestBuilderService {
  private baseUrl: string = environment.API_URL;

  constructor(
    private http: HttpClient,
    private authService: AuthentificationService,
    private router: Router
  ) {}

  execute(httpRequest: string, url: string, payload?: any): Observable<any> {
    const finalUrl = this.buildUrl(url);
    const token = this.authService.getToken();
    const userInfo = this.authService.getUserInfo();

    return this.authService.verifyToken(token, userInfo.user_id).pipe(
      tap({
        error: () => {
          console.error('Token verification failed');
          this.router.navigate(['/login']);
        },
      }),
      switchMap(() => this.makeHttpRequest(httpRequest, finalUrl, payload))
    );
  }

  private buildUrl(url: string): string {
    return `${this.baseUrl}${url}`;
  }

  private makeHttpRequest(httpRequest: string, url: string, payload?: any): Observable<any> {
    switch (httpRequest) {
      case 'get':
        return this.http.get(url, { params: payload });
      case 'post':
        return this.http.post(url, payload);
      case 'put':
        return this.http.put(url, payload);
      case 'delete':
        return this.http.delete(url, { body: payload });
      default:
        throw new Error('Unsupported HTTP request type');
    }
  }
}
