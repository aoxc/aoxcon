import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { type Request, type Response, type NextFunction } from 'express';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto'; // DÜZELTME: Doğrudan fonksiyonu import ediyoruz
import { performance } from 'node:perf_hooks';

/**
 * AOXCON Sovereign Infrastructure - SSR Engine (Elite Edition)
 * High-performance Node.js implementation for Angular Server-Side Rendering.
 */

// Tip Güvenliği için Express Request arayüzünü genişletiyoruz
interface AoxcRequest extends Request {
  uuid?: string;
}

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();

/**
 * Security Governance: SSRF & Host Validation
 */
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', '127.0.0.1', '192.168.1.4', '172.16.0.2'],
});

/**
 * Middleware: Global Request Context & Observability
 * Assigns a unique Correlation ID to every request for distributed tracing.
 */
app.use((req: AoxcRequest, _res: Response, next: NextFunction) => {
  req.uuid = randomUUID();
  next();
});

/**
 * Static Asset Management
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
    }
  }),
);

/**
 * SSR Execution Pipeline
 * Orchestrates high-performance rendering with duration profiling.
 */
app.use((req: AoxcRequest, res: Response, next: NextFunction) => {
  const startTime = performance.now();
  const requestId = req.uuid ?? 'N/A';

  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        const duration = (performance.now() - startTime).toFixed(2);
        console.info(`[AOXC-SSR] OK | ${req.method} ${req.url} | ID: ${requestId} | Latency: ${duration}ms`);
        return writeResponseToNodeResponse(response, res);
      }
      return next();
    })
    .catch((error: unknown) => {
      console.error(`[AOXC-CRITICAL] SSR Failure | ${req.url} | ID: ${requestId}`, {
        message: error instanceof Error ? error.message : 'Unknown SSR Exception',
        timestamp: new Date().toISOString()
      });
      next(error);
    });
});

/**
 * Infrastructure Initialization & Process Lifecycle
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = Number(process.env['PORT'] ?? 3000);
  
  const server = app.listen(port, () => {
    console.info(`
    ╔════════════════════════════════════════════════════════════════╗
    ║ [AOXC-CORE] Sovereign SSR Engine Operationally Ready           ║
    ║ Status: ACTIVE | Port: ${port.toString().padEnd(39)}║
    ╚════════════════════════════════════════════════════════════════╝
    `);
  });

  const shutdown = (signal: string) => {
    console.warn(`[AOXC-SYS] ${signal} received. Closing connections...`);
    server.close(() => {
      console.info('[AOXC-SYS] SSR Engine decommissioned successfully.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

export const reqHandler = createNodeRequestHandler(app);
