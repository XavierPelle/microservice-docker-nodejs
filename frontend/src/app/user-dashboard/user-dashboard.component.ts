import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { RequestBuilderService } from '../services/request-builder.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


pdfMake.vfs = pdfFonts.vfs;

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  user: any = null;
  editUser: any = {};
  activeTab: string = 'profile';

  // Panier
  cartItems: any[] = [];
  loadingCart: boolean = false;

  // Historique
  transactions: any[] = [];
  loadingHistory: boolean = false;

  // Statistiques
  totalOrders: number = 0;
  totalSpent: number = 0;
  cartItemsCount: number = 0;
  loadingStats: boolean = false;

  // UI states
  updating: boolean = false;
  deleting: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthentificationService,
    private requestBuilder: RequestBuilderService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.user = this.authService.getUserInfo();
    if (this.user) {
      this.editUser = { ...this.user };
      this.loadCartData();
      this.loadHistoryData();
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.errorMessage = '';
    if (tab === 'cart') this.loadCartData();
    if (tab === 'history') this.loadHistoryData();
    if (tab === 'stats') this.loadStatsData();
  }

  // Panier
  loadCartData(): void {
    if (!this.user?.user_id) return;
    this.loadingCart = true;
    this.requestBuilder.execute('get', `/cart/find/${this.user.user_id}`).subscribe({
      next: (response: any) => {
        this.cartItems = response || [];
        this.cartItemsCount = this.cartItems.length;
        this.loadingCart = false;
      },
      error: (error: any) => {
        this.cartItems = [];
        this.cartItemsCount = 0;
        this.loadingCart = false;
      }
    });
  }

  generatePdf(transaction: any): void {
    const totalPrice = (transaction.price * transaction.quantity).toFixed(2);
  
    // Conversion de la date ISO en format ddmmyyyy
    const date = new Date(transaction.createdAt);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
  
    const docDefinition = {
      content: [
        { text: 'Reçu de commande', style: 'header', alignment: 'center' },
        { text: `Commande N°: ${transaction.id}`, margin: [0, 20, 0, 5] },
        { text: `Date : ${formattedDate}`, margin: [0, 0, 0, 5] },
        { text: `Client : ${this.user.first_name || 'Nom Client'}`, margin: [0, 0, 0, 15] },
  
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Produit', style: 'tableHeader', alignment: 'center' },
                { text: 'Quantité', style: 'tableHeader', alignment: 'center' },
                { text: 'Prix unitaire', style: 'tableHeader', alignment: 'center' },
                { text: 'Total', style: 'tableHeader', alignment: 'center' }
              ],
              [
                { text: transaction.productName, alignment: 'center' },
                { text: transaction.quantity.toString(), alignment: 'center' },
                { text: `${transaction.price.toFixed(2)} €`, alignment: 'center' },
                { text: `${totalPrice} €`, alignment: 'center' }
              ]
            ]
          },
          layout: 'lightHorizontalLines'
        },
  
        { text: `Montant total : ${totalPrice} €`, style: 'total', margin: [0, 15, 0, 30] },
  
        { text: 'Merci pour votre commande !', style: 'footer', alignment: 'center' }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'white',
          fillColor: '#2980b9'
        },
        total: {
          bold: true,
          fontSize: 14
        },
        footer: {
          fontSize: 10,
          italics: true,
          color: 'gray'
        }
      }
    };
  
    pdfMake.createPdf(docDefinition as any).download(`commande-${transaction.id}.pdf`);
  }
  
  // Historique
  loadHistoryData(): void {
    if (!this.user?.user_id) return;
    this.loadingHistory = true;
    this.requestBuilder.execute('get', `/transaction-history/user/${this.user.user_id}`).subscribe({
      next: (response: any) => {
        this.transactions = Array.isArray(response) ? response : (response ? [response] : []);
        this.loadingHistory = false;
        this.loadStatsData();
      },
      error: (error: any) => {
        this.transactions = [];
        this.loadingHistory = false;
        this.loadStatsData();
      }
    });
  }

  // Statistiques
  loadStatsData(): void {
    this.totalOrders = this.transactions.length;
    this.totalSpent = this.transactions.reduce((total, t) => total + ((t.price || 0) * (t.quantity || 0)), 0);
    this.cartItemsCount = this.cartItems.length;
    this.loadingStats = false;
  }

  updateProfile(): void {
    if (!this.user?.user_id) return;

    this.updating = true;
    this.errorMessage = '';

    const updateData = {
      firstName: this.editUser.firstName,
      lastName: this.editUser.lastName,
      email: this.editUser.email
    };

    this.requestBuilder.execute('put', `/users/update/${this.user.user_id}`, updateData).subscribe({
      next: (response: any) => {
        // Update local user data
        this.user = { ...this.user, ...updateData };
        this.updating = false;
        this.errorMessage = '';
        alert('Profil mis à jour avec succès !');
      },
      error: (error: any) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        this.updating = false;
        this.errorMessage = 'Erreur lors de la mise à jour du profil. Veuillez réessayer.';
      }
    });
  }

  deleteAccount(): void {
    if (!this.user?.user_id) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }

    this.deleting = true;
    this.errorMessage = '';

    this.requestBuilder.execute('delete', `/users/delete/${this.user.user_id}`).subscribe({
      next: (response: any) => {
        this.deleting = false;
        alert('Compte supprimé avec succès. Vous allez être déconnecté.');
        this.authService.logout();
        window.location.href = '/';
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression du compte:', error);
        this.deleting = false;
        this.errorMessage = 'Erreur lors de la suppression du compte. Veuillez réessayer.';
      }
    });
  }
}
