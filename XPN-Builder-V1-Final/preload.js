// Preload script for XPN Builder. Exposes a minimal `xpnBeta` API to the
// renderer for license-key activation. Everything that needs Node (child_process
// for the Mac serial number, etc.) stays here; the renderer only sees a single
// safe function via contextBridge.
const { contextBridge } = require('electron');
const { execSync } = require('child_process');

let cachedSerial = null;

function getMachineSerial() {
  if (cachedSerial !== null) return cachedSerial;
  try {
    const out = execSync('system_profiler SPHardwareDataType', { timeout: 5000 }).toString();
    const m = out.match(/Serial Number\s*\(system\)?\s*:\s*([A-Za-z0-9]+)/i);
    cachedSerial = m ? m[1].trim() : 'unknown';
  } catch (e) {
    cachedSerial = 'unknown';
  }
  return cachedSerial;
}

// btoa(serial + ':' + key) — same machine + same key always yields the same
// fingerprint. Renderer compares this against the value it stored in
// localStorage at activation time. Different Mac → different serial →
// fingerprint mismatch → user must re-activate.
function computeFingerprint(key) {
  const serial = getMachineSerial();
  return Buffer.from(serial + ':' + String(key || '')).toString('base64');
}

contextBridge.exposeInMainWorld('xpnBeta', {
  computeFingerprint,
});
