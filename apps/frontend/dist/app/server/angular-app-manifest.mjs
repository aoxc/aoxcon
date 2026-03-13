
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "route": "/"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 49807, hash: '3f75db759901ae766578e1d2ce65c87a60df9fe6c9708553a3d8b5c165b96078', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 22461, hash: '254ddefec3cf3d3e761e5346aa7c3a307cf6b2bbcb4023d4b3ee16a2fefd4df2', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-O3FOIKL7.css': {size: 70420, hash: 'SjUvcSWwBhM', text: () => import('./assets-chunks/styles-O3FOIKL7_css.mjs').then(m => m.default)}
  },
};
