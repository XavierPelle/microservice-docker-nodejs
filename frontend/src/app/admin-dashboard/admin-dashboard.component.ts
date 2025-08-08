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
  
  activeTab: string = 'dashboard';


  stats: any = null;
  loadingStats: boolean = true;
  statsError: string = '';

  
  admins: any[] = [];
  loadingAdmins: boolean = true;
  adminsError: string = '';
  showAdminForm: boolean = false;
  adminForm = { userId: '' };
  adminMessage: string = '';
  addingAdmin: boolean = false;
  nonAdminUsers: any[] = []; // Nouvelle propriété pour les utilisateurs non-admin

  // Ajout d'un nouvel admin
  showAddAdminForm: boolean = false;
  addAdminForm = { firstName: '', lastName: '', email: '', password: '' };
  addAdminMessage: string = '';

  vendors: any[] = [];
  loadingVendors: boolean = true;
  vendorsError: string = '';
  selectedVendor: any = null;
  vendorActionMessage: string = '';
  showVendorForm: boolean = false;
  vendorForm = { firstName: '', lastName: '', email: '', password: '', storeName: '', storeDescription: '' };

  
  users: any[] = [];
  loadingUsers: boolean = true;
  usersError: string = '';
  selectedUser: any = null;
  userActionMessage: string = '';
  showUserForm: boolean = false;
  userForm = { firstName: '', lastName: '', email: '', role: 'user', password: '' };

 
  products: any[] = [];
  loadingProducts: boolean = true;
  productsError: string = '';
  selectedProduct: any = null;
  productActionMessage: string = '';
  showProductForm: boolean = false;
  productForm = { name: '', description: '', price: 0, quantity: 0 };

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadAdmins();
    this.loadVendors();
    this.loadUsers();
    this.loadProducts();
  }


  setActiveTab(tab: string) {
    this.activeTab = tab;
  }


  loadStats() {
    this.loadingStats = true;
    this.adminService.getDashboardStats().subscribe({
      next: (stats: any) => {
        this.stats = stats;
        this.loadingStats = false;
      },
      error: () => {
        this.loadingStats = false;
      }
    });
  }

 
  loadAdmins() {
    this.loadingAdmins = true;
    // Au lieu d'appeler getAllAdmins(), on filtre les utilisateurs avec le rôle admin
    this.adminService.getAllUsers().subscribe({
      next: (users: any[]) => {
        this.admins = users.filter(user => user.role === 'admin');
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

    // Trouver l'utilisateur sélectionné
    const selectedUser = this.users.find(user => user.id === Number(this.adminForm.userId));

    if (!selectedUser) {
      this.adminMessage = 'Utilisateur non trouvé.';
      this.addingAdmin = false;
      return;
    }

    // Mettre à jour le rôle de l'utilisateur vers admin
    this.adminService.updateUser(selectedUser.id, { ...selectedUser, role: 'admin' }).subscribe({
      next: () => {
        this.adminMessage = 'Admin créé avec succès !';
        this.addingAdmin = false;
        this.toggleAdminForm();
        this.loadAdmins();
        this.loadUsers(); // Recharger aussi la liste des utilisateurs
        this.loadStats();
      },
      error: (err) => {
        this.adminMessage = 'Erreur lors de la création de l\'admin : ' + (err?.error?.message || JSON.stringify(err));
        this.addingAdmin = false;
      }
    });
  }

  deleteAdmin(adminId: number) {
    if (confirm('Êtes-vous sûr de vouloir retirer les droits d\'admin de cet utilisateur ?')) {
      // Trouver l'admin à supprimer
      const adminToRemove = this.admins.find(admin => admin.id === adminId);

      if (!adminToRemove) {
        this.adminMessage = 'Admin non trouvé.';
        return;
      }

      // Mettre à jour le rôle de l'utilisateur vers user
      this.adminService.updateUser(adminToRemove.id, { ...adminToRemove, role: 'user' }).subscribe({
        next: () => {
          this.adminMessage = 'Droits d\'admin retirés avec succès !';
          this.loadAdmins();
          this.loadUsers(); // Recharger aussi la liste des utilisateurs
          this.loadStats();
        },
        error: () => {
          this.adminMessage = 'Erreur lors du retrait des droits d\'admin.';
        }
      });
    }
  }

  // Ajout d'un nouvel admin
  addAdmin() {
    this.addingAdmin = true;
    this.addAdminMessage = '';
    const newAdmin = {
      firstName: this.addAdminForm.firstName,
      lastName: this.addAdminForm.lastName,
      email: this.addAdminForm.email,
      password: this.addAdminForm.password,
      role: 'admin'
    };
    this.adminService.createUser(newAdmin).subscribe({
      next: () => {
        this.addAdminMessage = 'Administrateur ajouté avec succès !';
        this.addingAdmin = false;
        this.showAddAdminForm = false;
        this.loadUsers();
        this.loadAdmins();
      },
      error: (err) => {
        this.addAdminMessage = 'Erreur lors de l\'ajout de l\'admin : ' + (err?.error?.message || JSON.stringify(err));
        this.addingAdmin = false;
      }
    });
  }

  resetAddAdminForm() {
    this.addAdminForm = { firstName: '', lastName: '', email: '', password: '' };
    this.addAdminMessage = '';
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

  toggleVendorForm() {
    this.showVendorForm = !this.showVendorForm;
    this.vendorActionMessage = '';
    this.selectedVendor = null;
    this.vendorForm = { firstName: '', lastName: '', email: '', password: '', storeName: '', storeDescription: '' };
  }

  createVendor() {
    if (!this.vendorForm.firstName || !this.vendorForm.lastName || !this.vendorForm.email || !this.vendorForm.password) {
      this.vendorActionMessage = 'Tous les champs sont obligatoires pour créer un vendeur.';
      return;
    }

    this.adminService.createVendor(this.vendorForm).subscribe({
      next: () => {
        this.vendorActionMessage = 'Vendeur créé avec succès !';
        this.showVendorForm = false;
        this.loadVendors();
        this.loadUsers();
        this.loadStats();
      },
      error: (err) => {
        this.vendorActionMessage = 'Erreur lors de la création du vendeur : ' + (err?.error?.message || JSON.stringify(err));
      }
    });
  }

  deleteVendor(vendorId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce vendeur ?')) {
      this.adminService.deleteVendor(vendorId).subscribe({
        next: () => {
          this.vendorActionMessage = 'Vendeur supprimé avec succès !';
          this.loadVendors();
          this.loadStats();
        },
        error: () => {
          this.vendorActionMessage = 'Erreur lors de la suppression du vendeur.';
        }
      });
    }
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

  
  loadUsers() {
    this.loadingUsers = true;
    this.adminService.getAllUsers().subscribe({
      next: (users: any[]) => {
        this.users = users;
        this.nonAdminUsers = users.filter(user => user.role !== 'admin'); // Mettre à jour les utilisateurs non-admin
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
    this.selectedUser = null;
    this.userForm = { firstName: '', lastName: '', email: '', role: 'user', password: '' };
  }

  editUser(user: any) {
    this.selectedUser = user;
    this.userForm = { ...user, password: '' }; // Ne pas pré-remplir le mot de passe
    this.showUserForm = true;
  }

  createUser() {
    if (!this.userForm.firstName || !this.userForm.lastName || !this.userForm.email || !this.userForm.password) {
      this.userActionMessage = 'Tous les champs sont obligatoires.';
      return;
    }

    this.adminService.createUser(this.userForm).subscribe({
      next: () => {
        this.userActionMessage = 'Utilisateur créé avec succès !';
        this.showUserForm = false;
        this.loadUsers();
        this.loadStats();
      },
      error: (err) => {
        this.userActionMessage = 'Erreur lors de la création de l\'utilisateur : ' + (err?.error?.message || JSON.stringify(err));
      }
    });
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

  
  loadProducts() {
    this.loadingProducts = true;
    this.adminService.getAllProducts().subscribe({
      next: (products: any[]) => {
        this.products = products;
        this.loadingProducts = false;
      },
      error: () => {
        this.loadingProducts = false;
      }
    });
  }

  toggleProductForm() {
    this.showProductForm = !this.showProductForm;
    this.productActionMessage = '';
    this.selectedProduct = null;
    this.productForm = { name: '', description: '', price: 0, quantity: 0 };
  }

  editProduct(product: any) {
    this.selectedProduct = product;
    this.productForm = { ...product };
    this.showProductForm = true;
  }

  createProduct() {
    if (!this.productForm.name || !this.productForm.price || !this.productForm.quantity) {
      this.productActionMessage = 'Nom, prix et quantité sont obligatoires.';
      return;
    }

    this.adminService.createProduct(this.productForm).subscribe({
      next: () => {
        this.productActionMessage = 'Produit créé avec succès !';
        this.showProductForm = false;
        this.loadProducts();
        this.loadStats();
      },
      error: (err) => {
        this.productActionMessage = 'Erreur lors de la création du produit : ' + (err?.error?.message || JSON.stringify(err));
      }
    });
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

  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_role');
    this.router.navigate(['/admin-login']);
  }
}