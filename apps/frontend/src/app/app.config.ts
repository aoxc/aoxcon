import { 
  ApplicationConfig, 
  ErrorHandler,
  provideZonelessChangeDetection // Stable member used here
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

const securityAuditInterceptor: HttpInterceptorFn = (req, next) => {
  const auditRequest = req.clone({
    setHeaders: {
      'X-AOXC-Audit-Trace-Id': crypto.randomUUID(),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    }
  });
  return next(auditRequest);
};

class SovereignErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    const isBrowser = typeof document !== 'undefined';
    console.error('🛡️ [AOXC-AUDIT-FAILED]:', {
      level: 'CRITICAL',
      source: isBrowser ? 'Client-Interface' : 'Server-Node',
      exception: error?.message || 'Unknown Neural Fault',
      trace: error?.stack,
      timestamp: new Date().toISOString()
    });
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * CORE: Stable Zoneless Engine
     * Resolves NG0908 by using the official stable Zoneless provider.
     */
    provideZonelessChangeDetection(),

    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({ 
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled' 
      })
    ),

    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: false
      })
    ),

    provideHttpClient(
      withFetch(),
      withInterceptors([securityAuditInterceptor])
    ),

    provideAnimationsAsync(),

    {
      provide: ErrorHandler,
      useClass: SovereignErrorHandler
    }
  ],
};
