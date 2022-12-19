import { IPCEvents } from 'main/ipc/types';

declare global {
  interface Window {
    electron: {
      checkForNewRelease(event: IPCEvents): boolean | Error;
      updateRemoteFile(event: IPCEvents): void;
      downloadFile(event: IPCEvents): void;
      sendEvent(event: IPCEvents): void;
      checkReleaseFromConfigFile(event: IPCEvents): string | Error;
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
