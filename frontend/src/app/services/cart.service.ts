import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Cart } from '../models/cart';
import { Product } from '../models/product';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:5000';
  
  // Local cart tracking
  private cartItems = new BehaviorSubject<Cart[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) {}

  // Fetch cart from API and update local state
  getCart(user_id: number): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}/cart/find/${user_id}`).pipe(
      tap(cart => this.cartItems.next(cart))  // Update local cart state
    );
  }

  // Add item to cart and update state
  addToCart(product: Product): Observable<Product[]> {
    const userId = product.user_id ?? 0;  // Use 0 or another valid fallback if user_id is undefined
    return this.http.post<Product[]>(`${this.apiUrl}/cart/create`, product).pipe(
      tap(() => {
        this.getCart(userId).subscribe();  // Ensure userId is a number
      })
    );
  }
  

  // Delete item from cart and update state
  deleteItemCart(user_id: number): Observable<Cart[]> {
    return this.http.delete<Cart[]>(`${this.apiUrl}/cart/delete/${user_id}`).pipe(
      tap(cart => this.cartItems.next(cart))  // Update cart after deletion
    );
  }

  // Get current cart item count
  getCartItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  // Get total cart price
  getTotalCartPrice(): number {
    return this.cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
