import esbuild from 'esbuild';
import env from 'env-smart';
import { resolve } from 'path';
env.load();

export const ENTRY = resolve('src/client/index.js');
export const OUTFILE = resolve('dist/app.js');

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;
const SERVER_PORT = process.env.SERVER_PORT;

export function bundle(config = {}) {
  return esbuild.build({
    format: 'iife',
    entryPoints: [ENTRY],
    bundle: true,
    outfile: OUTFILE,
    jsxFactory: 'm',
    jsxFragment: '"["',
    define: {
        'process.env.API_URL': `"${SERVER_ADDRESS}${SERVER_PORT ? `:${SERVER_PORT}` : ''}"`
    },
    ...config
  });
}

export function logSuccess() {
  console.log('Bundled: ' + OUTFILE);
}