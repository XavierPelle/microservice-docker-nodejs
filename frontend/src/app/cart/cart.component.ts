import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  cart: Cart[] = [];

  constructor(private cartService: CartService, private authService: AuthentificationService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token)
    const userId = decodedToken.id;
    this.cartService.getCart(userId).subscribe({
      next: data => {
        console.log(data)
        this.cart = data;
      },
      error: () => {
        console.error('Erreur lors du chargement du panier');
      },
    });
  }
  removeFromCart(cart: Cart): void {
    this.cartService.deleteItemCart(cart.id_cart).subscribe({
      next:() => {
        console.log('gg')
      },
      error: () => {
        console.error('Erreur lors du chargement du panier');
      },
    });
  }
  
  calculateTotal(): number {
    return this.cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }

  buy(): void {
    console.log('Achat effectué', this.cart);
  }
}
