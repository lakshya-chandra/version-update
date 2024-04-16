"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const electronUpdater = require("electron-updater");
const log = require("electron-log");
const icon = path.join(__dirname, "../../resources/icon.png");
log.initialize({ preload: true });
const isProd = process.env.NODE_ENV === "production";
log.transports.console.level = false;
log.transports.file.level = isProd ? "warn" : "debug";
log.transports.file.fileName = isProd ? "autographa-smart.log" : "dev.autographa-smart.log";
log.transports.file.maxSize = 15 * 1024 * 1024;
log.initialize({ preload: true });
electronUpdater.autoUpdater.logger = log;
electronUpdater.autoUpdater.logger.transports.file.level = "info";
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    electronUpdater.autoUpdater.updateConfigPath = path.join(__dirname, "dev-app-update.yml");
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  electronUpdater.autoUpdater.checkForUpdatesAndNotify();
  electronUpdater.autoUpdater.on("update-available", () => {
    mainWindow.webContents.send("auto_updater", "Update Available");
  });
  electronUpdater.autoUpdater.on("update-downloaded", () => {
    mainWindow.webContents.send("auto_updater", "Update Downloaded");
  });
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  electron.ipcMain.handle("auto_updater", () => {
    electronUpdater.autoUpdater.quitAndInstall();
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
