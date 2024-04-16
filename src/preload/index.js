import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

// Custom APIs for renderer
const api = {
  send: function(channel, value) {
    ipcRenderer.send(channel, value);
  },
  on: function(channel, callback) {
    const subscription = function(_event, ...args) {
      callback(...args);
    };
    ipcRenderer.on(channel, subscription);

    return function() {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  invoke: async function(channel, ...args) {
    return await ipcRenderer.invoke(channel, ...args);
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.api = api;
}
