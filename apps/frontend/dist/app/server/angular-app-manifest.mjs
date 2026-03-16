
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
    'index.csr.html': {size: 4701, hash: '29c7bc6b9a4aa771da492be6cf5f9bc0168b2997c24e1f8d769cbac0d1a2083d', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 3182, hash: '0b96d7917cb5151711fd0410985c08f878a87c356bc7d3febd401cee587d50d6', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-TJGIXIQQ.css': {size: 25669, hash: 'CghUTQUPbG4', text: () => import('./assets-chunks/styles-TJGIXIQQ_css.mjs').then(m => m.default)}
  },
};
