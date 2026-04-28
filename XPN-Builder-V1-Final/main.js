const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');

// Beta cutoff. After this date the app refuses to open and shows a dialog
// pointing testers at padworks.io. Re-builds for production should drop this
// gate (or push the date out for an extended beta).
const BETA_EXPIRY = new Date('2026-09-30T23:59:59');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: 'XPN Builder',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Preload exposes a tiny `xpnBeta` API for the renderer's activation
      // modal (license-key validation + machine fingerprint). Anything that
      // needs Node lives there, not in the renderer.
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('mpc_expansion_builder.html');
}

app.whenReady().then(() => {
  if (new Date() > BETA_EXPIRY) {
    dialog.showMessageBoxSync({
      type: 'info',
      title: 'Beta Expired',
      message: 'This beta version has expired.\nVisit padworks.io for the full version.\n\nThanks for testing!',
      buttons: ['OK'],
    });
    app.quit();
    return;
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
