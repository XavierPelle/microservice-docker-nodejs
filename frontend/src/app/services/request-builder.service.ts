import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  execute(httpRequest: string, url: string, payload?: any, skipConnectionCheck: boolean = false): Observable<any> {
    const finalUrl = this.buildUrl(url);

    if (!skipConnectionCheck) {
      const token = this.authService.getToken();
      const userInfo = this.authService.getUserInfo();

      if (!userInfo || !userInfo.user_id) {
        console.error('User info is null or missing user_id');
        this.router.navigate(['/login']);
        return new Observable(subscriber => subscriber.error('User info is null'));
      }

      return this.authService.verifyToken(token, userInfo.user_id).pipe(
        tap({
          error: () => {
            console.error('Token verification failed');
            this.router.navigate(['/login']);
          },
        }),
        switchMap(() => this.makeHttpRequest(httpRequest, finalUrl, payload))
      );
    } else {
      return this.makeHttpRequest(httpRequest, finalUrl, payload);
    }
  }

  private buildUrl(url: string): string {
    return `${this.baseUrl}${url}`;
  }

  private makeHttpRequest(httpRequest: string, url: string, payload?: any): Observable<any> {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    switch (httpRequest) {
      case 'get':
        return this.http.get(url, { params: payload, headers });
      case 'post':
        return this.http.post(url, payload, { headers });
      case 'put':
        return this.http.put(url, payload, { headers });
      case 'delete':
        return this.http.delete(url, { body: payload, headers });
      default:
        throw new Error('Unsupported HTTP request type');
    }
  }
}
