const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

let mainWindow;

// 自动更新日志
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

// 创建窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// 应用就绪后，创建窗口并检查更新
app.on('ready', () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

// 监听自动更新事件
autoUpdater.on('update-available', () => {
  log.info('Update available');
  if (mainWindow) {
    mainWindow.webContents.send('message', 'Update available. Downloading...');
  }
});

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded');
  if (mainWindow) {
    mainWindow.webContents.send('message', 'Update downloaded. Will install now...');
  }
  autoUpdater.quitAndInstall();
});

// 当所有窗口都关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
