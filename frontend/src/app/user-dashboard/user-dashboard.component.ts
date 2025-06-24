import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  user: any = null;

  constructor(private authService: AuthentificationService) {}

  ngOnInit(): void {
    this.user = this.authService.getUserInfo();
  }
} 