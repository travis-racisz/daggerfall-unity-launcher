import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IPCEvents, PreloadExposed, Channels } from './ipc/types';

// this is the bridge to the main to execute the functions.
// currently none of them require any real params, so we can send a signal
// from the bridge to main to run the function

const api: PreloadExposed = {
  sendEvent(event) {
    ipcRenderer.send(event.name, event.payload);
  },
  openDialogBox(event): void {
    ipcRenderer.send(event.name);
  },
  launchGame(event: IPCEvents): void {
    ipcRenderer.send(event.name);
  },
  getRelease(event: IPCEvents): void {
    ipcRenderer.send(event.name);
  },
  checkReleaseFromConfigFile(event: IPCEvents): void {
    ipcRenderer.send(event.name);
  },
  checkForNewRelease(event: IPCEvents): void {
    ipcRenderer.send(event.name);
  },
  downloadDaggerfallUnity(event: IPCEvents): void {
    ipcRenderer.send(event.name, event.payload);
  },
  sendPath(event: IPCEvents): void {
    ipcRenderer.send(event.name);
  },
  changePermissions(event: IPCEvents): void {
    ipcRenderer.send(event.name);
  },
  updateRemoteFile(event: IPCEvents): void {
    ipcRenderer.send(event.name);
  },
  updateGameFilesDirectory(event: IPCEvents): void {
    ipcRenderer.send(event.name);
  },
  getDownloadPath(event: IPCEvents): void {
    ipcRenderer.send(event.name);
  },
  downloadOriginalDaggerfall(event: IPCEvents): void {
    ipcRenderer.send(event.name);
  },
  once(channel: Channels, func: (...args: unknown[]) => void) {
    ipcRenderer.once(channel, (_event, ...args) => func(...args));
  },
  on(channel: Channels, func: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      func(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
};

contextBridge.exposeInMainWorld('electron', api);
