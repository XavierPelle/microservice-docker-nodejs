import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:5000';

  addToCart(product: Product): Observable<Product[]> {
		return this.http.post<Product[]>(`${this.apiUrl}/cart/create`, product);
	}

  getCart(user_id: number): Observable<Cart[]> {
		return this.http.get<Cart[]>(`${this.apiUrl}/cart/find/${user_id}`);
	}

  deleteItemCart(user_id: number): Observable<Cart[]> {
    console.log(user_id)
		return this.http.delete<Cart[]>(`${this.apiUrl}/cart/delete/${user_id}`);
	}
}
