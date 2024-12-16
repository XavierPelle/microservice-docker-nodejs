import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:5000';

  addToCard(product: Product): Observable<Product[]> {
		return this.http.post<Product[]>(`${this.apiUrl}/cart/create`, product);
	}
}
