import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { HttpClientModule } from '@angular/common/http';
import { RequestBuilderService } from '../services/request-builder.service';
import { AuthentificationService } from '../services/authentification.service';
import { Cart } from '../models/cart';
import { forkJoin } from 'rxjs';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  payment: { amount: number | null; method: string } = {
    amount: null,
    method: ''
  };
  message = '';

  cart: Cart[] = [];

  constructor(private cartService: CartService,private router: Router, private paymentService: PaymentService, private authService: AuthentificationService, private requestBuilderService: RequestBuilderService) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { amount?: number };
    if (state?.amount) {
      this.payment.amount = state.amount;
    }
  }

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    this.requestBuilderService.execute('get', `/cart/find/${userInfo.user_id}`, null, false).subscribe({
      next: data => {
        this.cart = data;
        console.log(this.cart)

      },
      error: () => {
        console.error('Erreur lors du chargement du panier');
      },
    });
  }

  submitPayment() {
    const userInfo = this.authService.getUserInfo();

    const paymentData = {
      user_id: userInfo?.user_id,
      amount: this.payment.amount,
      method: this.payment.method
    };
    this.paymentService.createPayment(paymentData).subscribe({
      next: () => {
        this.requestBuilderService.execute(
          'post',
          '/transaction-history/create',
          {
            userId: userInfo.user_id,
            price: this.payment.amount,
            quantity: this.cart[0]?.quantity,
            productReference: this.cart[0]?.productReference,
            productName: this.cart[0]?.name,
          }
        ).subscribe({
          next: () => {
            const deleteRequests = this.cart.map(item =>
              this.requestBuilderService.execute('delete', `/cart/delete/${item.id_cart}`)
            );

            forkJoin(deleteRequests).subscribe({
              next: () => {
                this.cartService.clearCart();
                this.router.navigate(['/user-dashboard']);
              },
              error: (err) => {
                console.error('Erreur lors de la suppression du panier :', err);
                this.message = 'Paiement OK, mais erreur lors de la suppression du panier.';
              }
            });
          },
          error: () => {
            this.message = 'Paiement OK, mais erreur transaction.';
          }
        });
      },
      error: () => {
        this.message = 'Erreur lors du paiement.';
      }
    });
  }
  removeFromCart(cart: Cart): void {
    this.requestBuilderService.execute('delete', `/cart/delete/${cart.id_cart}`).subscribe({
      next: () => {
        window.location.reload();
      },
      error: () => {
        console.error('Erreur lors de la supression');
      },
    });
  }
}