import { IPCEvents } from 'main/ipc/types';

declare global {
  interface Window {
    electron: {
<<<<<<< HEAD
      getRelease(arg0: { name: string; payload: undefined; }): void;
=======
>>>>>>> react_electron
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