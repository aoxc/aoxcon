import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

/**
 * SOVEREIGN BOOTSTRAP SEQUENCE
 * Optimized for Zoneless execution. 
 * Zone.js import has been removed to align with provideZonelessChangeDetection().
 */
bootstrapApplication(App, appConfig)
  .then(() => {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      console.log('🧠 [AOXC] Neural Infrastructure Active (Zoneless)');
    }
  })
  .catch((err) => {
    console.error('🛡️ [AOXC-INIT-FAILED]: Critical failure during bootstrap:', {
      exception: err,
      timestamp: new Date().toISOString(),
      audit: 'Inconsistent-Execution-Context'
    });
  });
