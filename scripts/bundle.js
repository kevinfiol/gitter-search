import esbuild from 'esbuild';
import env from 'env-smart';
import { resolve } from 'path';
env.load();

export const ENTRY = resolve('src/client/index.js');
export const OUTFILE = resolve('dist/app.js');

export function bundle(config = {}) {
  return esbuild.build({
    format: 'iife',
    entryPoints: [ENTRY],
    bundle: true,
    outfile: OUTFILE,
    jsxFactory: 'm',
    jsxFragment: '"["',
    define: {
        'process.env.API_URL': `"${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}"`
    },
    ...config
  });
}

export function logSuccess() {
  console.log('Bundled: ' + OUTFILE);
}