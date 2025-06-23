import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cart } from '../models/cart';
import { AuthentificationService } from '../services/authentification.service';
import { RequestBuilderService } from '../services/request-builder.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  cart: Cart[] = [];

  constructor(private authService: AuthentificationService, private requestBuilderService: RequestBuilderService) {}

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    this.requestBuilderService.execute('get', `/cart/find/${userInfo.user_id}`).subscribe({
      next: data => {
        this.cart = data;
      },
      error: () => {
        console.error('Erreur lors du chargement du panier');
      },
    });
  }
  removeFromCart(cart: Cart): void {
    this.requestBuilderService.execute('delete', `/cart/delete/${cart.id_cart}`).subscribe({
      next:() => {
        window.location.reload();
      },
      error: () => {
        console.error('Erreur lors de la supression');
      },
    });
  }
  
  calculateTotal(): number {
    return this.cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }

  buy(): void {
    const userInfo = this.authService.getUserInfo();
    this.requestBuilderService.execute('post', `/transaction-history/create/${userInfo.user_id}`).subscribe({
      next: data => {
        this.cart = data;
      },
      error: () => {
        console.error('Erreur lors de l achat');
      },
    });
  }
}
