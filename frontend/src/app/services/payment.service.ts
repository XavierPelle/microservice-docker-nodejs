import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = 'http://localhost:5000/payement'; // adapte l'URL si besoin

  constructor(private http: HttpClient) {}

  createPayment(payment: any): Observable<any> {
    return this.http.post(this.apiUrl, payment);
  }
}