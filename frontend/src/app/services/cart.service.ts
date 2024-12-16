import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:5000';

  addToCard(cart: Cart): Observable<Cart[]> {
		return this.http.post<Cart[]>(`${this.apiUrl}/cart/create`, cart);
	}
}
