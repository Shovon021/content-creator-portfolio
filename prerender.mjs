import { createServer } from 'vite';
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { Writable } from 'node:stream';
import fs from 'node:fs';

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const mod = await vite.ssrLoadModule('/src/App.jsx');
  const App = mod.default;
  const html = await new Promise((resolve, reject) => {
    let out = '';
    const sink = new Writable({ write(c, e, cb) { out += c.toString(); cb(); } });
    const { pipe } = renderToPipeableStream(React.createElement(App), {
      onAllReady() { pipe(sink); },
      onError(err) { reject(err); },
    });
    sink.on('finish', () => resolve(out));
    sink.on('error', reject);
  });
  const dist = fs.readFileSync('dist/index.html', 'utf8');
  if (!dist.includes('<div id="root">')) throw new Error('root div not found in dist/index.html');
  const final = dist.replace('<div id="root">', `<div id="root">${html}`);
  fs.writeFileSync('dist/index.html', final);
  console.log('RENDER_OK bytes=' + html.length);
} finally {
  await vite.close();
}
