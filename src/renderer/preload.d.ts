import { IPCEvents } from 'main/ipc/types';

declare global {
  interface Window {
    electron: {
      checkForNewRelease(event: IPCEvents): void;
      updateRemoteFile(event: IPCEvents): void;
      downloadFile(event: IPCEvents): void;
      sendEvent(event: IPCEvents): void;
      on(
        channel: string,
        func: (...args: unknown[]) => void
      ): (() => void) | undefined;
      once(channel: string, func: (...args: unknown[]) => void): void;
      launchGame(event: IPCEvents): void;
    };
  }
}

export {};
