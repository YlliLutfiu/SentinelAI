import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <header class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a routerLink="/profile" 
           class="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200" 
           aria-label="SentinelAI Home - Profile">
          SentinelAI
        </a>
        <div class="flex items-center space-x-4">
          <a *ngIf="isAuthenticated()" routerLink="/analysis" 
             class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            Analyze
          </a>
          <a *ngIf="isAuthenticated()" routerLink="/profile" 
             class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            Profile
          </a>
          <button *ngIf="isAuthenticated()" (click)="logout()" 
                  class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            Logout
          </button>
          <a *ngIf="!isAuthenticated()" routerLink="/login" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            Login
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    @media (max-width: 768px) {
      header div { flex-direction: column; gap: 1rem; py-6; }
      a:first-child { order: 2; }
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isAuthenticated = computed(() => this.authService.isAuthenticated());
  currentUser = computed(() => this.authService.currentUser());

  logout() {
    this.authService.logout();
  }
}

