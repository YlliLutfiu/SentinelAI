import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Api } from '../../api/api';
import { analyzeText } from '../../api/fn/analysis/analyze-text';
import { analyzeUrl } from '../../api/fn/analysis/analyze-url';
import { analyzeScreenshot } from '../../api/fn/analysis/analyze-screenshot';

@Component({
  selector: 'app-analysis-submit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './analysis-submit.component.html',
  styles: []
})
export class AnalysisSubmitComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private api = inject(Api);

  analysisType: 'text' | 'url' | 'screenshot' = 'text';
  isLoading = false;
  errorMessage = '';

  textForm = this.fb.group({
    text: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10000)]]
  });

  urlForm = this.fb.group({
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]] 
  });

  screenshotForm = this.fb.group({
    filename: ['', Validators.required]
  });

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  async submitText() {
    if (this.textForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.api.invoke(analyzeText, { body: { text: this.textForm.value.text! } });
      sessionStorage.setItem('analysisResult', JSON.stringify(response));
      this.router.navigate(['/results']);
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Analysis failed';
      console.error('Analysis error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async submitUrl() {
    if (this.urlForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.api.invoke(analyzeUrl, { body: { url: this.urlForm.value.url! } });
      sessionStorage.setItem('analysisResult', JSON.stringify(response));
      this.router.navigate(['/results']);
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Analysis failed';
      console.error('Analysis error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async submitScreenshot() {
    if (this.screenshotForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.api.invoke(analyzeScreenshot, { body: { filename: this.screenshotForm.value.filename! } });
      sessionStorage.setItem('analysisResult', JSON.stringify(response));
      this.router.navigate(['/results']);
    } catch (error: any) {
      this.errorMessage = error.error?.message || 'Analysis failed';
      console.error('Analysis error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Placeholder for url/screenshot (add async API calls if needed)
  // async submitUrl() {
  //   if (this.urlForm.invalid) return;

  //   this.isLoading = true;
  //   this.errorMessage = '';

  //   try {
  //     const response = await this.api.invoke(analyzeUrl, { body: { url: this.urlForm.value.url! } });
  //     sessionStorage.setItem('analysisResult', JSON.stringify(response));
  //     this.router.navigate(['/results']);
  //   } catch (error: any) {
  //     this.errorMessage = error.error?.message || 'Analysis failed';
  //     console.error('URL analysis error:', error);
  //   } finally {
  //     this.isLoading = false;
  //   }
  // }

  // async submitScreenshot() {
  //   if (this.screenshotForm.invalid) return;

  //   this.isLoading = true;
  //   this.errorMessage = '';

  //   try {
  //     const response = await this.api.invoke(analyzeScreenshot, { body: { filename: this.screenshotForm.value.filename! } });
  //     sessionStorage.setItem('analysisResult', JSON.stringify(response));
  //     this.router.navigate(['/results']);
  //   } catch (error: any) {
  //     this.errorMessage = error.error?.message || 'Analysis failed';
  //     console.error('Screenshot analysis error:', error);
  //   } finally {
  //     this.isLoading = false;
  //   }
  // }

  onLogout() {
    this.authService.logout();
  }
}

