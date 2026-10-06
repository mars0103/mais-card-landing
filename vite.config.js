import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

function staticPageFallback() {
  const middleware = (baseDir) => (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const [urlPath, query] = req.url.split('?');
    if (path.extname(urlPath)) return next();
    const candidate = path.join(baseDir, urlPath, 'index.html');
    if (fs.existsSync(candidate)) {
      req.url = urlPath.replace(/\/+$/, '') + '/index.html' + (query ? `?${query}` : '');
    }
    next();
  };
  return {
    name: 'static-page-fallback',
    configureServer(server) {
      server.middlewares.use(middleware(server.config.publicDir));
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware(path.resolve(server.config.root, server.config.build.outDir)));
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [staticPageFallback()],
  build: { target: 'es2020', chunkSizeWarningLimit: 1200 },
  server: { host: true, port: 5173 },
});
