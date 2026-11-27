// Screenshot helper for NusaStats: drives the Playwright headless shell
// over its DevTools protocol with Node's built-in WebSocket and fetch (no
// packages), sets the viewport, waits for the site's own window.__shotReady
// flag, then captures a PNG. Usage:
//   node tools/shoot.mjs <width> <height> <url> <out.png>
// It also prints any page console errors, so a broken page fails loudly
// here instead of silently shipping a blank frame.

import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const CHROME = `${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell`;
const PORT = 9224;

const [widthArg, heightArg, url, outPath] = process.argv.slice(2);
const width = Number(widthArg);
const height = Number(heightArg);
if (!width || !height || !url || !outPath) {
  console.error('usage: node tools/shoot.mjs <width> <height> <url> <out.png>');
  process.exit(2);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const chrome = spawn(CHROME, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  `--remote-debugging-port=${PORT}`,
  `--window-size=${width},${height}`,
  'about:blank',
], { stdio: 'ignore' });

let ws = null;
try {
  // Wait for the DevTools HTTP endpoint to answer.
  let targets = null;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      targets = await res.json();
      break;
    } catch {
      await sleep(250);
    }
  }
  if (!targets) throw new Error('DevTools endpoint never answered');
  const page = targets.find((t) => t.type === 'page');
  if (!page) throw new Error('no page target');
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let nextId = 1;
  const pending = new Map();
  const consoleErrors = [];
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
    if (message.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(JSON.stringify(message.params.exceptionDetails).slice(0, 500));
    }
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      consoleErrors.push(message.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 500));
    }
  };
  function send(method, params = {}) {
    const id = nextId;
    nextId += 1;
    ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve) => pending.set(id, resolve));
  }
  async function evaluate(expression) {
    const reply = await send('Runtime.evaluate', { expression, returnByValue: true });
    return reply.result?.result?.value;
  }

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 });
  await send('Page.navigate', { url });
  // Wait for the site to render and set its ready flag.
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    await sleep(250);
    try {
      ready = await evaluate('window.__shotReady === true');
    } catch {
      ready = false;
    }
    if (ready) break;
  }
  if (!ready) throw new Error('window.__shotReady never became true');
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const data = shot.result?.data;
  if (!data) throw new Error('no screenshot data');
  writeFileSync(outPath, Buffer.from(data, 'base64'));
  console.log(`saved ${outPath}`);
  if (consoleErrors.length > 0) {
    console.error('PAGE ERRORS:');
    for (const err of consoleErrors) console.error('  ' + err);
    process.exitCode = 1;
  }
} finally {
  if (ws) ws.close();
  chrome.kill('SIGKILL');
}
