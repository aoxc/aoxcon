import { 
  ApplicationConfig, 
  ErrorHandler,
  provideZonelessChangeDetection 
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

/**
 * SECURITY AUDIT INTERCEPTOR
 * Injects sovereign trace IDs and essential security headers into every HTTP request.
 */
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

/**
 * SOVEREIGN ERROR HANDLER
 * Global exception orchestrator for centralized logging and neural fault detection.
 */
class SovereignErrorHandler implements ErrorHandler {
  // FIX: Unexpected any -> Replaced with 'unknown' for safer type checking.
  handleError(error: unknown): void {
    const isBrowser = typeof document !== 'undefined';
    
    // Type-safe error extraction
    const errorMessage = error instanceof Error ? error.message : 'Unknown Neural Fault';
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('🛡️ [AOXC-AUDIT-FAILED]:', {
      level: 'CRITICAL',
      source: isBrowser ? 'Client-Interface' : 'Server-Node',
      // FIX: Used Nullish Coalescing (??) instead of Logical OR (||).
      exception: errorMessage ?? 'Default Fault Message',
      trace: errorStack,
      timestamp: new Date().toISOString()
    });
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * CORE: Stable Zoneless Engine
     * Optimizes performance by bypassing Zone.js for sovereign state updates.
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
