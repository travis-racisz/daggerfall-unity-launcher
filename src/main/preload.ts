import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { parseArgs } from 'util';
import { IPCEvents, PreloadExposed, Channels } from './ipc/types';

// this is the bridge to the main to execute the functions.
// currently none of them require any real params, so we can send a signal
// from the bridge to main to run the function

const api: PreloadExposed = {
  sendEvent(event) {
    ipcRenderer.send(event.name, event.payload);
  },
  launchGame(event: IPCEvents): void {
    ipcRenderer.send(event.name);
  },
  getRelease(event: IPCEvents): void {
    throw new Error('Function not implemented.');
  },
  getCurrentRelease(event: IPCEvents): void {
    throw new Error('Function not implemented.');
  },
  checkForNewRelease(event: IPCEvents): void {
    throw new Error('Function not implemented.');
  },
  getRemoteFile(event: IPCEvents): void {
    throw new Error('Function not implemented.');
  },
  changePermissions(event: IPCEvents): void {
    throw new Error('Function not implemented.');
  },
  updateRemoteFile(event: IPCEvents): void {
    throw new Error('Function not implemented.');
  },
  updateGameFilesDirectory(event: IPCEvents): void {
    throw new Error('Function not implemented.');
  },
  getDownloadPath(event: IPCEvents): void {
    throw new Error('Function not implemented.');
  },
  downloadFile(event: IPCEvents): void {
    throw new Error('Function not implemented.');
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
