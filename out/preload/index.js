"use strict";
const electron = require("electron");
const api = {
  send: function(channel, value) {
    electron.ipcRenderer.send(channel, value);
  },
  on: function(channel, callback) {
    const subscription = function(_event, ...args) {
      callback(...args);
    };
    electron.ipcRenderer.on(channel, subscription);
    return function() {
      electron.ipcRenderer.removeListener(channel, subscription);
    };
  },
  invoke: async function(channel, ...args) {
    return await electron.ipcRenderer.invoke(channel, ...args);
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.api = api;
}
