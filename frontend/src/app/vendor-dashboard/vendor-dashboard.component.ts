import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthentificationService } from '../services/authentification.service';
import { RequestBuilderService } from '../services/request-builder.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.scss'
})
export class VendorDashboardComponent implements OnInit {
  vendor: any = null;
  user: any = null;
  loading: boolean = true;
  error: string = '';
  // Pour le formulaire d'ajout de produit
  showProductForm: boolean = false;
  productForm = {
    name: '',
    description: '',
    price: null,
    quantity: null
  };
  productMessage: string = '';
  // Pour la liste des produits
  products: any[] = [];
  loadingProducts: boolean = false;

  constructor(
    private authService: AuthentificationService,
    private requestBuilder: RequestBuilderService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserInfo();
    if (!this.user || !this.user.user_id) {
      this.error = 'Utilisateur non connecté.';
      this.loading = false;
      return;
    }
    this.requestBuilder.execute('get', '/vendors', null, true).subscribe({
      next: (vendors: any[]) => {
        this.vendor = vendors.find(v => v.userId === this.user.user_id);
        this.loading = false;
        if (!this.vendor) {
          this.error = 'Aucun profil vendeur trouvé pour cet utilisateur.';
        } else {
          this.loadProducts();
        }
      },
      error: () => {
        this.error = 'Erreur lors de la récupération des vendeurs.';
        this.loading = false;
      }
    });
  }

  // Charger la liste des produits du vendeur
  loadProducts() {
    if (!this.vendor) return;
    this.loadingProducts = true;
    this.requestBuilder.execute('get', `/vendors/${this.vendor.id}/products`, null, true).subscribe({
      next: (products: any[]) => {
        this.products = products;
        this.loadingProducts = false;
      },
      error: () => {
        this.products = [];
        this.loadingProducts = false;
      }
    });
  }

  // Afficher/masquer le formulaire
  toggleProductForm() {
    this.showProductForm = !this.showProductForm;
    this.productMessage = '';
    this.productForm = { name: '', description: '', price: null, quantity: null };
  }

  // Soumettre le formulaire d'ajout de produit
  submitProduct() {
    if (!this.vendor) return;
    const payload = {
      ...this.productForm,
      price: Number(this.productForm.price),
      quantity: Number(this.productForm.quantity)
    };
    this.requestBuilder.execute('post', `/vendors/${this.vendor.id}/products`, payload, true).subscribe({
      next: () => {
        this.productMessage = 'Produit ajouté avec succès !';
        this.toggleProductForm();
        this.loadProducts();
      },
      error: () => {
        this.productMessage = 'Erreur lors de l\'ajout du produit.';
      }
    });
  }
} 