'use strict';

const { JSDOM, ResourceLoader } = require('jsdom');
const fs = require('fs');
const path = require('path');

// ── Minimal AudioContext mock (needed for test q7: audioBufferToWav) ──
class MockAudioContext {
  createBuffer(channels, frames, sampleRate) {
    return {
      numberOfChannels: channels,
      length: frames,
      sampleRate,
      getChannelData: () => new Float32Array(frames),
    };
  }
  createBufferSource() {
    return { connect: () => {}, start: () => {}, stop: () => {}, buffer: null, playbackRate: { value: 1 } };
  }
  createGain() { return { gain: { value: 1 }, connect: () => {} }; }
  createStereoPanner() { return { pan: { value: 0 }, connect: () => {} }; }
  resume() { return Promise.resolve(); }
  get currentTime() { return 0; }
  get destination() { return {}; }
  get state() { return 'running'; }
}

// ── ResourceLoader: serve local jszip for the CDN URL ──
class LocalResources extends ResourceLoader {
  fetch(url, options) {
    if (url.includes('jszip')) {
      const p = require.resolve('jszip/dist/jszip.min.js');
      return Promise.resolve(Buffer.from(fs.readFileSync(p)));
    }
    // Skip Google Fonts and other external resources
    return null;
  }
}

let win;
let totalTests;

beforeAll(async () => {
  const html = fs.readFileSync(
    path.join(__dirname, '..', 'mpc_expansion_builder.html'),
    'utf8'
  );

  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: new LocalResources(),
    pretendToBeVisual: true,
    url: 'http://localhost/',
    beforeParse(window) {
      // Inject JSZip synchronously so it's available before inline scripts run
      window.JSZip = require('jszip');

      // Mock Web Audio API
      window.AudioContext = MockAudioContext;
      window.webkitAudioContext = MockAudioContext;

      // Mock Canvas 2D context so drawWaveform() doesn't throw
      const mockCtx = {
        clearRect: () => {}, fillRect: () => {}, strokeRect: () => {},
        beginPath: () => {}, moveTo: () => {}, lineTo: () => {}, stroke: () => {},
        arc: () => {}, fill: () => {}, closePath: () => {},
        measureText: () => ({ width: 0 }),
        fillText: () => {}, strokeText: () => {},
        save: () => {}, restore: () => {},
        scale: () => {}, translate: () => {}, rotate: () => {},
        setTransform: () => {}, drawImage: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        fillStyle: '', strokeStyle: '', lineWidth: 1, font: '',
        globalAlpha: 1, globalCompositeOperation: '',
      };
      const OrigHTMLCanvasElement = window.HTMLCanvasElement;
      Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
        value: () => mockCtx,
        writable: true,
        configurable: true,
      });

      // Suppress MIDI errors
      Object.defineProperty(window.navigator, 'requestMIDIAccess', {
        value: undefined,
        configurable: true,
        writable: true,
      });
    },
  });

  win = dom.window;

  // Wait for the load event (which triggers init())
  await new Promise((resolve) => {
    if (win.document.readyState === 'complete') {
      // load already fired – call init() if not yet called
      if (!win.groups || win.groups.length === 0) win.init();
      resolve();
    } else {
      win.addEventListener('load', resolve, { once: true });
      setTimeout(resolve, 5000);
    }
  });

  // Short wait to let any synchronous init side-effects settle
  await new Promise((r) => setTimeout(r, 200));

  totalTests = win.xtpAll.length;
}, 30000);

test(`all ${79} embedded XPN tests pass`, async () => {
  // Build the test-panel UI so per-test status elements exist
  win.xtpBuildUI();

  // Run the full embedded suite
  await win.xtpRunAll();

  const passed = win._xtpP;
  const failed = win._xtpF;

  // Collect details on any failures for a readable error message
  if (failed > 0) {
    const lines = [];
    win.XTP_SUITES.forEach((suite) => {
      suite.tests.forEach((t) => {
        const dot = win.document.getElementById('xtp-st-' + t.id);
        const det = win.document.getElementById('xtp-det-' + t.id);
        if (dot && dot.className.includes('fail')) {
          lines.push(`  [${t.id}] ${t.name}: ${det ? det.textContent : '?'}`);
        }
      });
    });
    throw new Error(
      `${failed} test(s) failed:\n${lines.join('\n')}`
    );
  }

  expect(passed).toBe(totalTests);
  expect(failed).toBe(0);
}, 60000);
