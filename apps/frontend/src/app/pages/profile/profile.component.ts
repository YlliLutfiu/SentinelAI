import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Api } from '../../api/api';
import { updateUserProfile } from '../../api/fn/users/update-user-profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private api = inject(Api);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  currentUser = this.authService.currentUser;

  form = this.fb.group({
    email: ['', Validators.email],
    password: ['', [Validators.minLength(8)]]
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  get email() {
    return this.form.get('email')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  hasChanges(): boolean {
    const emailVal = this.form.value.email;
    const passwordVal = this.form.value.password;
    return (emailVal ? emailVal.trim() !== '' : false) ||
           (passwordVal ? passwordVal.trim() !== '' : false);
  }

  onSubmit() {
    if (this.form.invalid || !this.hasChanges()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const updateData: any = {};
    const emailVal = this.form.value.email;
    const passwordVal = this.form.value.password;

    if (emailVal?.trim()) updateData.email = emailVal;
    if (passwordVal?.trim()) updateData.password = passwordVal;

    this.api
      .invoke(updateUserProfile, { body: updateData })
      .then((response: any) => {
        this.isLoading = false;
        this.authService.currentUser.set(response);
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.successMessage = 'Profile updated successfully!';
        this.form.reset();
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      })
      .catch((error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to update profile';
      });
  }

  onLogout() {
    this.authService.logout();
  }
}

