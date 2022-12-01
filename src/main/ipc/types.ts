export type IPCEvents =
  | SendEvent
  | LaunchGame
  | GetRelease
  | GetCurrentRelease
  | CheckForNewRelease
  | GetRemoteFile
  | ChangePermissions
  | UpdateRemoteFile
  | UpdateGameFilesDirectory
  | GetDownloadPath
  | DownloadFile;

export type Channels = 'ipc-example';
export type SendEvent = Event<'sendEvent', { message: string }>;
export type LaunchGame = Event<'launchGame'>;
export type GetRelease = Event<'getRelease', { bitSize: string }>;
export type GetCurrentRelease = Event<'getCurrentRelease'>;
export type CheckForNewRelease = Event<'checkForNewRelease'>;
export type GetRemoteFile = Event<'getRemoteFile'>;
export type ChangePermissions = Event<'changePermissions'>;
export type UpdateRemoteFile = Event<'updateRemoteFile'>;
export type UpdateGameFilesDirectory = Event<'updateGameFilesDirectory'>;
export type GetDownloadPath = Event<'getDownloadPath'>;
export type DownloadFile = Event<'downloadFile'>;
export type Once = Event<'once'>;
export type Asset = {
  name: string;
};

export interface PreloadExposed {
  sendEvent: (event: IPCEvents) => void;
  launchGame: (event: IPCEvents) => void;
  getRelease: (event: IPCEvents) => void;
  getCurrentRelease: (event: IPCEvents) => void;
  checkForNewRelease: (event: IPCEvents) => void;
  getRemoteFile: (event: IPCEvents) => void;
  changePermissions: (event: IPCEvents) => void;
  updateRemoteFile: (event: IPCEvents) => void;
  updateGameFilesDirectory: (event: IPCEvents) => void;
  getDownloadPath: (event: IPCEvents) => void;
  downloadFile: (event: IPCEvents) => void;
  once: (channel: Channels, func: (...args: unknown[]) => void) => void;
  on(
    channel: Channels,
    func: (...args: unknown[]) => void
  ): (() => void) | undefined;
}

interface Event<TypeName extends string, TypePayload = undefined> {
  name: TypeName;
  payload: TypePayload;
}