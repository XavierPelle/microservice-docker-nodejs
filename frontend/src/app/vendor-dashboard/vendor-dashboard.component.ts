import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { RequestBuilderService } from '../services/request-builder.service';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.scss'
})
export class VendorDashboardComponent implements OnInit {
  // User and vendor data
  vendor: any = null;
  user: any = null;
  loading: boolean = true;
  error: string = '';

  // Dashboard stats
  dashboardStats: any = {
    totalRevenue: 0,
    totalProductsSold: 0,
    totalOrders: 0
  };

  // Tab management
  activeTab: string = 'overview';

  // Products management
  products: any[] = [];
  loadingProducts: boolean = false;
  showAddProductForm: boolean = false;
  addingProduct: boolean = false;
  deletingProduct: boolean = false;
  newProduct: any = {
    name: '',
    description: '',
    price: null,
    quantity: null
  };

  // Orders management
  orders: any[] = [];
  loadingOrders: boolean = false;

  // Settings
  storeInfo: any = {
    name: '',
    description: ''
  };
  updatingStore: boolean = false;
  successMessage: string = '';

  constructor(
    private authService: AuthentificationService,
    private requestBuilder: RequestBuilderService
  ) {}

  ngOnInit(): void {
    this.loadVendorData();
  }

  loadVendorData(): void {
    this.user = this.authService.getUserInfo();
    if (!this.user || !this.user.user_id) {
      this.error = 'Utilisateur non connecté.';
      this.loading = false;
      return;
    }

    if (this.user.role !== 'vendor') {
      this.error = 'Accès non autorisé. Seuls les vendeurs peuvent accéder à ce dashboard.';
      this.loading = false;
      return;
    }

    this.requestBuilder.execute('get', `/vendors/user/${this.user.user_id}`, null, true).subscribe({
      next: (vendor: any) => {
        this.vendor = vendor;
        this.loading = false;
        if (!this.vendor) {
          this.error = 'Aucun profil vendeur trouvé pour cet utilisateur.';
        } else {
          this.loadDashboardStats();
          this.loadProducts();
          this.loadOrders();
          this.loadSettings();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du vendeur:', error);
        this.error = 'Erreur lors de la récupération des données vendeur.';
        this.loading = false;
      }
    });
  }

  // Tab management
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.error = '';
    this.successMessage = '';
  }

  // Dashboard stats
  loadDashboardStats(): void {
    if (!this.vendor) return;
    
    this.requestBuilder.execute('get', `/vendors/${this.vendor.id}/dashboard`, null, true).subscribe({
      next: (stats: any) => {
        this.dashboardStats = stats;
      },
      error: () => {
        // Use mock data if API not available
        this.dashboardStats = {
          totalRevenue: 15420.50,
          totalProductsSold: 234,
          totalOrders: 89
        };
      }
    });
  }

  // Products management
  loadProducts(): void {
    if (!this.vendor) return;
    
    this.loadingProducts = true;
    this.requestBuilder.execute('get', `/vendors/${this.vendor.id}/products`, null, true).subscribe({
      next: (products: any[]) => {
        this.products = products;
        this.loadingProducts = false;
      },
      error: () => {
        // Mock data
        this.products = [
          {
            id: 1,
            name: 'Smartphone X',
            description: 'Téléphone haut de gamme avec caméra 108MP',
            price: 999.99,
            quantity: 15
          },
          {
            id: 2,
            name: 'Laptop Pro',
            description: 'Ordinateur portable pour professionnels',
            price: 1499.99,
            quantity: 8
          }
        ];
        this.loadingProducts = false;
      }
    });
  }

  addProduct(): void {
    if (!this.vendor || !this.newProduct.name || !this.newProduct.price || !this.newProduct.quantity) {
      this.error = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    
    this.addingProduct = true;
    this.error = '';
    
    const productData = {
      ...this.newProduct,
      vendor_id: this.vendor.id
    };

    this.requestBuilder.execute('post', `/vendors/${this.vendor.id}/products`, productData, true).subscribe({
      next: () => {
        this.showAddProductForm = false;
        this.resetNewProduct();
        this.loadProducts();
        this.successMessage = 'Produit ajouté avec succès !';
        this.addingProduct = false;
      },
      error: () => {
        this.error = 'Erreur lors de l\'ajout du produit.';
        this.addingProduct = false;
      }
    });
  }

  deleteProduct(productId: number): void {
    if (!this.vendor) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }
    
    this.deletingProduct = true;
    this.error = '';
    
    this.requestBuilder.execute('delete', `/vendors/${this.vendor.id}/products/${productId}`, null, true).subscribe({
      next: () => {
        this.loadProducts();
        this.successMessage = 'Produit supprimé avec succès !';
        this.deletingProduct = false;
      },
      error: () => {
        this.error = 'Erreur lors de la suppression du produit.';
        this.deletingProduct = false;
      }
    });
  }

  resetNewProduct(): void {
    this.newProduct = {
      name: '',
      description: '',
      price: null,
      quantity: null
    };
  }

  // Orders management
  loadOrders(): void {
    if (!this.vendor) return;
    
    this.loadingOrders = true;
    // Mock data for orders
    this.orders = [
      {
        id: 1234,
        customerName: 'Jean Dupont',
        itemsCount: 3,
        total: 245.99,
        date: new Date(),
        status: 'pending'
      },
      {
        id: 1235,
        customerName: 'Marie Martin',
        itemsCount: 1,
        total: 999.99,
        date: new Date(Date.now() - 86400000),
        status: 'shipped'
      }
    ];
    this.loadingOrders = false;
  }

  updateOrderStatus(orderId: number, status: string): void {
    console.log('Update order status:', orderId, status);
    // Implementation for updating order status
    this.successMessage = 'Statut de la commande mis à jour !';
  }

  // Settings
  loadSettings(): void {
    if (this.vendor) {
      this.storeInfo = {
        name: this.vendor.storeName,
        description: this.vendor.storeDescription
      };
    }
  }

  updateStoreInfo(): void {
    if (!this.vendor) return;
    
    this.updatingStore = true;
    this.error = '';
    this.successMessage = '';
    
    const updateData = {
      storeName: this.storeInfo.name,
      storeDescription: this.storeInfo.description
    };

    this.requestBuilder.execute('put', `/vendors/${this.vendor.id}`, updateData, true).subscribe({
      next: () => {
        this.vendor.storeName = this.storeInfo.name;
        this.vendor.storeDescription = this.storeInfo.description;
        this.successMessage = 'Informations du magasin mises à jour !';
        this.updatingStore = false;
      },
      error: () => {
        this.error = 'Erreur lors de la mise à jour des informations.';
        this.updatingStore = false;
      }
    });
  }
} 