import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  // Onglets
  activeTab: string = 'dashboard';

  // Stats globales
  stats: any = null;
  loadingStats: boolean = true;
  statsError: string = '';

  // Gestion des admins
  admins: any[] = [];
  loadingAdmins: boolean = true;
  adminsError: string = '';
  showAdminForm: boolean = false;
  adminForm = { userId: '' };
  adminMessage: string = '';
  addingAdmin: boolean = false;

  // Gestion des vendeurs
  vendors: any[] = [];
  loadingVendors: boolean = true;
  vendorsError: string = '';
  selectedVendor: any = null;
  vendorActionMessage: string = '';

  // Gestion des utilisateurs
  users: any[] = [];
  loadingUsers: boolean = true;
  usersError: string = '';
  selectedUser: any = null;
  userActionMessage: string = '';
  showUserForm: boolean = false;
  userForm = { firstName: '', lastName: '', email: '', role: 'user' };

  // Gestion des produits
  products: any[] = [];
  loadingProducts: boolean = true;
  productsError: string = '';
  selectedProduct: any = null;
  productActionMessage: string = '';
  showProductForm: boolean = false;
  productForm = { name: '', description: '', price: 0 };

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadAdmins();
    this.loadVendors();
    this.loadUsers();
    this.loadProducts();
  }

  // Navigation entre onglets
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // ===== DASHBOARD =====
  loadStats() {
    this.loadingStats = true;
    this.adminService.getDashboardStats().subscribe({
      next: (stats: any) => {
        this.stats = stats;
        this.loadingStats = false;
      },
      error: () => {
        this.statsError = 'Erreur lors du chargement des statistiques.';
        this.loadingStats = false;
      }
    });
  }

  // ===== GESTION DES ADMINS =====
  loadAdmins() {
    this.loadingAdmins = true;
    this.adminService.getAllAdmins().subscribe({
      next: (admins: any[]) => {
        this.admins = admins;
        this.loadingAdmins = false;
      },
      error: () => {
        this.adminsError = 'Erreur lors du chargement des admins.';
        this.loadingAdmins = false;
      }
    });
  }

  toggleAdminForm() {
    this.showAdminForm = !this.showAdminForm;
    this.adminMessage = '';
    this.adminForm = { userId: '' };
  }

  createAdmin() {
    this.addingAdmin = true;
    this.adminMessage = '';
    this.adminService.createAdmin(Number(this.adminForm.userId)).subscribe({
      next: () => {
        this.adminMessage = 'Admin créé avec succès !';
        this.addingAdmin = false;
        this.toggleAdminForm();
        this.loadAdmins();
        this.loadStats();
      },
      error: () => {
        this.adminMessage = 'Erreur lors de la création de l\'admin.';
        this.addingAdmin = false;
      }
    });
  }

  deleteAdmin(adminId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet admin ?')) {
      this.adminService.deleteAdmin(adminId).subscribe({
        next: () => {
          this.adminMessage = 'Admin supprimé avec succès !';
          this.loadAdmins();
          this.loadStats();
        },
        error: () => {
          this.adminMessage = 'Erreur lors de la suppression de l\'admin.';
        }
      });
    }
  }

  // ===== GESTION DES VENDEURS =====
  loadVendors() {
    this.loadingVendors = true;
    this.adminService.getAllVendors().subscribe({
      next: (vendors: any[]) => {
        this.vendors = vendors;
        this.loadingVendors = false;
      },
      error: () => {
        this.vendorsError = 'Erreur lors du chargement des vendeurs.';
        this.loadingVendors = false;
      }
    });
  }

  approveVendor(vendorId: number) {
    this.adminService.approveVendor(vendorId).subscribe({
      next: () => {
        this.vendorActionMessage = 'Vendeur approuvé avec succès !';
        this.loadVendors();
        this.loadStats();
      },
      error: () => {
        this.vendorActionMessage = 'Erreur lors de l\'approbation du vendeur.';
      }
    });
  }

  rejectVendor(vendorId: number) {
    this.adminService.rejectVendor(vendorId).subscribe({
      next: () => {
        this.vendorActionMessage = 'Vendeur rejeté avec succès !';
        this.loadVendors();
        this.loadStats();
      },
      error: () => {
        this.vendorActionMessage = 'Erreur lors du rejet du vendeur.';
      }
    });
  }

  // ===== GESTION DES UTILISATEURS =====
  loadUsers() {
    this.loadingUsers = true;
    this.adminService.getAllUsers().subscribe({
      next: (users: any[]) => {
        this.users = users;
        this.loadingUsers = false;
      },
      error: () => {
        this.usersError = 'Erreur lors du chargement des utilisateurs.';
        this.loadingUsers = false;
      }
    });
  }

  toggleUserForm() {
    this.showUserForm = !this.showUserForm;
    this.userActionMessage = '';
    this.userForm = { firstName: '', lastName: '', email: '', role: 'user' };
  }

  editUser(user: any) {
    this.selectedUser = user;
    this.userForm = { ...user };
    this.showUserForm = true;
  }

  updateUser() {
    this.adminService.updateUser(this.selectedUser.id, this.userForm).subscribe({
      next: () => {
        this.userActionMessage = 'Utilisateur mis à jour avec succès !';
        this.showUserForm = false;
        this.loadUsers();
        this.loadStats();
      },
      error: () => {
        this.userActionMessage = 'Erreur lors de la mise à jour de l\'utilisateur.';
      }
    });
  }

  deleteUser(userId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.userActionMessage = 'Utilisateur supprimé avec succès !';
          this.loadUsers();
          this.loadStats();
        },
        error: () => {
          this.userActionMessage = 'Erreur lors de la suppression de l\'utilisateur.';
        }
      });
    }
  }

  // ===== GESTION DES PRODUITS =====
  loadProducts() {
    this.loadingProducts = true;
    this.adminService.getAllProducts().subscribe({
      next: (products: any[]) => {
        this.products = products;
        this.loadingProducts = false;
      },
      error: () => {
        this.productsError = 'Erreur lors du chargement des produits.';
        this.loadingProducts = false;
      }
    });
  }

  toggleProductForm() {
    this.showProductForm = !this.showProductForm;
    this.productActionMessage = '';
    this.productForm = { name: '', description: '', price: 0 };
  }

  editProduct(product: any) {
    this.selectedProduct = product;
    this.productForm = { ...product };
    this.showProductForm = true;
  }

  updateProduct() {
    this.adminService.updateProduct(this.selectedProduct.id, this.productForm).subscribe({
      next: () => {
        this.productActionMessage = 'Produit mis à jour avec succès !';
        this.showProductForm = false;
        this.loadProducts();
        this.loadStats();
      },
      error: () => {
        this.productActionMessage = 'Erreur lors de la mise à jour du produit.';
      }
    });
  }

  deleteProduct(productId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.adminService.deleteProduct(productId).subscribe({
        next: () => {
          this.productActionMessage = 'Produit supprimé avec succès !';
          this.loadProducts();
          this.loadStats();
        },
        error: () => {
          this.productActionMessage = 'Erreur lors de la suppression du produit.';
        }
      });
    }
  }

  // Utilitaires
  getStatusColor(status: string): string {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-100';
      case 'vendor': return 'text-blue-600 bg-blue-100';
      case 'user': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  // Déconnexion admin
  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_role');
    this.router.navigate(['/admin-login']);
  }
}
