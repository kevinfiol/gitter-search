import { bundle, logSuccess } from './bundle.js';
import servbot from 'servbot';

const PORT = 8080;

// Start dev server
const server = servbot({
  root: 'dist',
  reload: true,
  fallback: 'index.html',
  ignores: [
    // don't pass app.js to the SPA
    /\/app.js/i,
    // don't pass assets at root level to SPA
    /^\/([^/]+?)\.(css|png|ico)\/?$/i
  ]
});

server.listen(PORT);

// Bundle and watch for changes
bundle({
  minify: false,
  sourcemap: true,
  watch: {
    onRebuild(error) {
      if (error) console.error(error);
      else {
        logSuccess();
        server.reload();
      }
    }
  }
})
.then(logSuccess)
.catch((e) => {
  console.error(e);
  server.close();
  process.exit(1);
});