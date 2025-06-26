import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentService } from '../services/payment.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule,FormsModule, HttpClientModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  payment: { amount: number | null; method: string } = {
  amount: null,
  method: ''
};
  message = '';

  constructor(private router: Router, private paymentService: PaymentService, private http: HttpClient) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { amount?: number };
    if (state?.amount) {
      this.payment.amount = state.amount;
    }
  }

  submitPayment() {
    // 1. Envoi au backend de paiement
    this.paymentService.createPayment(this.payment).subscribe({
      next: (paymentResponse) => {
        // 2. Si succès, envoi au backend de transaction
        this.http.post('http://localhost:5003/transaction-history/create', {
          paymentId: paymentResponse.id_payment,
          amount: this.payment.amount,
          method: this.payment.method,
          // ajoute d'autres infos si besoin
        }).subscribe({
          next: () => {
            this.message = 'Paiement et transaction enregistrés !';
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
}