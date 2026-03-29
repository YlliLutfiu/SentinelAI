import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-gradient-to-r from-slate-800 to-gray-900 text-white py-8 mt-24">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <div class="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          SentinelAI
        </div>
        <p class="text-lg opacity-90 mb-6">Advanced AI-powered security analysis platform</p>
        <p class="text-sm opacity-75">&copy; 2024 SentinelAI. All rights reserved.</p>
      </div>
    </footer>
  `
})
export class FooterComponent {}

