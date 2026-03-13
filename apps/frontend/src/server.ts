import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { type Request, type Response, type NextFunction } from 'express';
import { join } from 'node:path';

/**
 * AOXCON Sovereign Infrastructure - SSR Engine
 * High-performance Node.js Express server for Angular Server-Side Rendering.
 */

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Static Asset Management
 * Serves browser-side bundles with a long-term cache strategy (1 year).
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Angular Universal Rendering Pipeline
 * Orchestrates the transition from HTTP Request to Server-Rendered HTML.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Server Initialization Phase
 * Configuration for environment-aware port binding and error propagation.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  // FIX: Applied nullish coalescing operator (??) to satisfy @typescript-eslint/prefer-nullish-coalescing
  const port = process.env['PORT'] ?? 4000;
  
  app.listen(port, () => {
    // Note: Express .listen typically provides the error through the return or global handler
    // in modern types, but we maintain the log for infrastructure telemetry.
    console.log(`[AOXC-CORE] SSR Engine operating at http://localhost:${port}`);
  });
}

/**
 * Request Handler Export
 * Integration hook for Angular CLI Dev-Server and Cloud Function providers.
 */
export const reqHandler = createNodeRequestHandler(app);
