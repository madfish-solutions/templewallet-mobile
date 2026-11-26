// Open one flow's base and mine Hermes profiles in a local Perfetto UI.
//   node perf/open-hermes.mjs cmp-2026-11-25-10-59-46 nfts-1-scroll
//
// ui.perfetto.dev cannot read a file served on this machine: the browser
// treats that as a loopback request from a public site, and CORS headers do
// not allow it. The UI from Perfetto v59.1 is served here, and both profiles
// are opened from that same origin.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UI_URL = 'https://github.com/google/perfetto/releases/download/v59.1/perfetto-ui.zip';
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.map': 'application/json',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.woff2': 'font/woff2'
};

const usage = () => {
  process.stderr.write(
    'Usage: node perf/open-hermes.mjs <suite> <test>\n' +
      '  suite  cmp-2026-11-25-10-59-46\n' +
      '  test   nfts-1-scroll or setup-import\n'
  );
  process.exit(1);
};

const [suiteArg, testId, extra] = process.argv.slice(2);
if (!suiteArg || !testId || extra) usage();

const suite = suiteArg.replace(/^perf\/out\//, '').replace(/\/$/, '');
if (suite.includes('..') || suite.includes('/') || testId.includes('..') || testId.includes('/')) usage();

const profilePath = version => path.join(root, 'perf', 'out', suite, 'artifacts', version, testId, 'hermes', 'profile.json');

const profiles = {
  '/base.json': profilePath('base'),
  '/mine.json': profilePath('mine')
};

for (const [urlPath, file] of Object.entries(profiles)) {
  if (!fs.existsSync(file)) {
    process.stderr.write(`No Hermes profile for ${urlPath.slice(1, -5)} at ${file}\n`);
    process.exit(1);
  }
}

const uiDir = path.join(root, 'perf', 'out', 'perfetto-ui', 'v59.1');
if (!fs.existsSync(path.join(uiDir, 'index.html'))) {
  fs.mkdirSync(uiDir, { recursive: true });
  const zip = path.join(uiDir, 'perfetto-ui.zip');
  process.stdout.write('Downloading Perfetto UI v59.1\n');
  const downloaded = spawnSync('curl', ['-fL', '--retry', '3', '-o', zip, UI_URL], { stdio: 'inherit' });
  if (downloaded.status !== 0) {
    process.stderr.write('Could not download Perfetto UI v59.1\n');
    process.exit(downloaded.status ?? 1);
  }
  const unpacked = spawnSync('unzip', ['-qo', zip, '-d', uiDir], { stdio: 'inherit' });
  if (unpacked.status !== 0 || !fs.existsSync(path.join(uiDir, 'index.html'))) {
    process.stderr.write('Could not unpack Perfetto UI v59.1\n');
    process.exit(unpacked.status ?? 1);
  }
}

const uiFile = requestPath => {
  const relative = requestPath === '/' ? '/index.html' : requestPath;
  const file = path.resolve(uiDir, `.${relative}`);
  const inside = file === uiDir || file.startsWith(`${uiDir}${path.sep}`);
  if (!inside || !fs.existsSync(file) || !fs.statSync(file).isFile()) return null;
  return file;
};

const send = (response, file) => {
  response.setHeader('Content-Type', TYPES[path.extname(file)] ?? 'application/octet-stream');
  response.setHeader('Cache-Control', 'no-cache');
  response.writeHead(200);
  fs.createReadStream(file).pipe(response);
};

const server = http.createServer((request, response) => {
  const urlPath = decodeURIComponent(request.url?.split('?')[0] ?? '/');
  if (request.method !== 'GET') {
    response.writeHead(405);
    response.end();
    return;
  }
  const profile = profiles[urlPath];
  if (profile) {
    send(response, profile);
    return;
  }
  const file = uiFile(urlPath);
  if (!file) {
    response.writeHead(404);
    response.end();
    return;
  }
  send(response, file);
});

server.on('error', error => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});

server.listen(0, '127.0.0.1', () => {
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;
  const origin = `http://127.0.0.1:${port}`;
  const tab = version => `${origin}/#!/?url=${origin}/${version}.json`;
  process.stdout.write(`Opening ${suite} ${testId} in local Perfetto v59.1. Base, then mine.\n`);
  process.stdout.write('Press Ctrl-C to stop the UI.\n');
  const open = url => spawn('open', [url], { stdio: 'ignore', detached: true }).unref();
  open(tab('base'));
  setTimeout(() => open(tab('mine')), 400);
});
