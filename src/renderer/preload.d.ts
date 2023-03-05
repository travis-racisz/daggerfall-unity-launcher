import { IPCEvents } from 'main/ipc/types';

declare global {
  interface Window {
    electron: {
      checkForNewRelease(event: IPCEvents): boolean | Error;
      updateRemoteFile(event: IPCEvents): void;
      downloadOriginalDaggerfall(event: IPCEvents): void;
      sendPath(event: IPCEvents): void;
      sendEvent(event: IPCEvents): void;
      downloadDaggerfallUnity(event: IPCEvents): void;
      openDialogBox(event: IPCEvents): void;
      checkReleaseFromConfigFile(event: IPCEvents): string | Error;
      on(
        channel: string,
        func: (...args: any[]) => void
      ): (() => void) | undefined;
      once(channel: string, func: (...args: unknown[]) => void): void;
      launchGame(event: IPCEvents): void;
    };
  }
}

export {};
