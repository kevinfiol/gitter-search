import { bundle, logSuccess } from './bundle.js';
import servbot from 'servbot';

const PORT = 8080;

// Start dev server
const server = servbot({
  root: 'dist',
  reload: true,
  fallback: 'index.html'
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