import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  setCartItems(data: Cart[]) {
    throw new Error('Method not implemented.');
  }
  private cartItems = new BehaviorSubject<Cart[]>([]);
  cartItems$ = this.cartItems.asObservable();

  updateCart(items: Cart[]) {
    this.cartItems.next(items);
  }

  addItem(item: Cart) {
    const current = this.cartItems.value;
    this.cartItems.next([...current, item]);
  }

  clearCart() {
    this.cartItems.next([]);
  }
}
