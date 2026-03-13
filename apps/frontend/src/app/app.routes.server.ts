import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * AOXC NEURAL CORE - SERVER ROUTING STRATEGY
 * * AUDIT ANALYSIS:
 * 1. Web3/AI dashboards rely on dynamic browser-runtime data (RPC, window.ethereum, etc).
 * 2. RenderMode.Prerender attempts to execute this logic at BUILD TIME (Node.js), 
 * leading to the 'document is not defined' crash (NG0908).
 * 3. RenderMode.Server (SSR) defers execution until the request hits the server, 
 * allowing the app to bypass static route extraction.
 */

export const serverRoutes: ServerRoute[] = [
  // PRIMARY DASHBOARD: Set to Server mode to allow live Signal updates
  {
    path: 'dashboard',
    renderMode: RenderMode.Server,
  },

  // AI BUILDER & NETWORK TABS: Dynamic generation required
  {
    path: 'ai-builder',
    renderMode: RenderMode.Server,
  },

  {
    path: 'networks',
    renderMode: RenderMode.Server,
  },

  // GLOBAL FALLBACK: Prevents the Route Extractor from trying to prerender 
  // unknown paths during the build process.
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
