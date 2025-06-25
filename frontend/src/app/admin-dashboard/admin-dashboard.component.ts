import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestBuilderService } from '../services/request-builder.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  // Stats globales
  stats: any = null;
  loadingStats: boolean = true;
  statsError: string = '';

  // Liste des users
  users: any[] = [];
  loadingUsers: boolean = true;
  usersError: string = '';

  // Formulaire ajout vendor
  showVendorForm: boolean = false;
  vendorForm = {
    userId: '',
    storeName: '',
    storeDescription: ''
  };
  vendorMessage: string = '';
  addingVendor: boolean = false;

  constructor(private requestBuilder: RequestBuilderService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
  }

  // Charger les stats globales
  loadStats() {
    this.loadingStats = true;
    this.requestBuilder.execute('get', '/admin/dashboard/stats', null, true).subscribe({
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

  // Charger la liste des users
  loadUsers() {
    this.loadingUsers = true;
    this.requestBuilder.execute('get', '/admin/users', null, true).subscribe({
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

  // Afficher/masquer le formulaire d'ajout de vendor
  toggleVendorForm() {
    this.showVendorForm = !this.showVendorForm;
    this.vendorMessage = '';
    this.vendorForm = { userId: '', storeName: '', storeDescription: '' };
  }

  // Soumettre le formulaire d'ajout de vendor
  submitVendor() {
    this.addingVendor = true;
    this.vendorMessage = '';
    const payload = {
      userId: this.vendorForm.userId,
      storeName: this.vendorForm.storeName,
      storeDescription: this.vendorForm.storeDescription
    };
    this.requestBuilder.execute('post', '/admin/vendors', payload, true).subscribe({
      next: () => {
        this.vendorMessage = 'Vendor ajouté avec succès !';
        this.addingVendor = false;
        this.toggleVendorForm();
        this.loadStats();
      },
      error: () => {
        this.vendorMessage = 'Erreur lors de l\'ajout du vendor.';
        this.addingVendor = false;
      }
    });
  }
} 