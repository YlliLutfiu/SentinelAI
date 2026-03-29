import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface AnalysisSignalDto {
  type: string;
  description: string;
  confidence: number;
}

interface AnalysisResponseDto {
  correlationId: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  signals: AnalysisSignalDto[];
  recommendations: string[];
  completedAt: string;
}

@Component({
  selector: 'app-analysis-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './analysis-results.component.html',
  styles: [`
    @layer utilities {
      .text-shadow-xl { text-shadow: 0 10px 20px rgba(0,0,0,0.2); }
    }
  `]
})
export class AnalysisResultsComponent {
  authService = inject(AuthService);
  router = inject(Router);

  result: AnalysisResponseDto | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    const stored = sessionStorage.getItem('analysisResult');
    if (!stored) {
      this.router.navigate(['/analysis']);
      return;
    }

    try {
      this.result = JSON.parse(stored);
    } catch (e) {
      this.errorMessage = 'Invalid analysis data';
    }
    this.isLoading = false;
  }

  getRiskGradientClass(): string {
    return this.result?.riskLevel === 'low' ? 'from-emerald-500 to-green-600' :
           this.result?.riskLevel === 'medium' ? 'from-yellow-500 to-orange-600' : 'from-red-500 to-rose-600';
  }

  getRiskDescription(): string {
    const level = this.result?.riskLevel;
    const desc = {
      low: 'Safe - No significant threats detected',
      medium: 'Caution - Moderate risks identified',
      high: 'Critical - Immediate action recommended'
    };
    return desc[level as keyof typeof desc] || '';
  }

  trackByFn(index: number): number {
    return index;
  }

  goBack() {
    sessionStorage.removeItem('analysisResult');
    this.router.navigate(['/analysis']);
  }

  downloadJSON() {
    if (!this.result) return;
    const report = this.result;
    const dataStr = "JSON.stringify(report, null, 2)";
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    this.downloadFile(dataBlob, `sentinel-report-${report.correlationId}.json`);
  }

  showPDFReport() {
    if (!this.result) return;
    const report = this.result;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>SentinelAI Security Report</title>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; color: #333; }
    .header { text-align: center; margin-bottom: 60px; padding-bottom: 40px; border-bottom: 4px solid #e5e7eb; }
    .logo { font-size: 3em; font-weight: 900; background: linear-gradient(135deg, #2563eb, #1d4ed8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px; }
    .risk-display { text-align: center; margin: 60px 0; }
    .risk-score { font-size: 6em; font-weight: 900; line-height: 1; }
    .risk-low { color: #059669; }
    .risk-medium { color: #d97706; }
    .risk-high { color: #dc2626; }
    .risk-label { font-size: 1.5em; font-weight: 700; margin-top: 20px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.9; }
    .correlation { background: #f8fafc; padding: 25px; border-radius: 12px; margin: 40px 0; font-family: 'Courier New', monospace; border-left: 6px solid #3b82f6; }
    .section { margin-bottom: 50px; }
    .section h2 { font-size: 2.2em; font-weight: 800; margin-bottom: 30px; color: #111827; position: relative; }
    .section h2::after { content: ''; position: absolute; bottom: -10px; left: 0; height: 4px; width: 60px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 2px; }
    .threat { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 6px solid #f59e0b; padding: 30px; border-radius: 16px; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(245, 158, 11, 0.2); }
    .recommendation { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-left: 6px solid #10b981; padding: 30px; border-radius: 16px; margin-bottom: 25px; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2); }
    .threat h3, .recommendation h3 { font-size: 1.4em; font-weight: 700; margin-bottom: 12px; color: #1f2937; }
    .confidence { background: rgba(245, 158, 11, 0.2); color: #92400e; padding: 8px 16px; border-radius: 9999px; font-weight: 700; font-size: 1.1em; }
    .footer { text-align: center; margin-top: 80px; padding-top: 40px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 0.95em; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    @page { margin: 1in; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">SentinelAI</div>
    <h1>Security Analysis Report</h1>
    <p style="font-size: 1.2em; opacity: 0.8;">Generated on ${new Date().toLocaleString()}</p>
  </div>

  <div class="risk-display">
    <div class="risk-score risk-${report.riskLevel}">${report.riskScore}</div>
    <div class="risk-label">${report.riskLevel.toUpperCase()}</div>
  </div>

  <div class="correlation">
    <h3 style="font-weight: 700; margin-bottom: 15px; color: #1f2937;">Analysis ID</h3>
    <code>${report.correlationId}</code>
  </div>

  <div class="section">
    <h2>Threat Signals (${report.signals.length})</h2>
    ${report.signals.map((signal, i) => `
      <div class="threat">
        <h3>${i+1}. ${signal.type.replace(/_/g, ' ').toUpperCase()}</h3>
        <p>${signal.description}</p>
        <div class="confidence">${signal.confidence}% Confidence</div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Recommendations</h2>
    ${report.recommendations.map((rec, i) => `
      <div class="recommendation">
        <h3>${i+1}. ${rec}</h3>
      </div>
    `).join('')}
  </div>

  <div class="footer">
    <p>SentinelAI Security Analysis • Advanced threat detection platform</p>
    <p>This report was automatically generated using AI-powered security analysis.</p>
  </div>

  <script>
    window.onload = () => {
      window.print();
      setTimeout(() => window.close(), 1000);
    };
  </script>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  onLogout() {
    this.authService.logout();
  }
}

