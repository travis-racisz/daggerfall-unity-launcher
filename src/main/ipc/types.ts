interface Event<TypeName extends string, TypePayload = undefined> {
  name: TypeName;
  payload: TypePayload;
}

export type Channels = 'ipc-example';
export type SendEvent = Event<'sendEvent', { message: string }>;
export type LaunchGame = Event<'launchGame'>;
export type GetRelease = Event<'getRelease', { bitSize: string }>;
export type CheckReleaseFromConfigFile = Event<'checkReleaseFromConfigFile'>;
export type CheckForNewRelease = Event<'checkForNewRelease'>;
export type DownloadDaggerfallUnity = Event<
  'downloadDaggerfallUnity',
  { path: string[] }
>;
export type ChangePermissions = Event<'changePermissions'>;
export type UpdateRemoteFile = Event<'updateRemoteFile'>;
export type UpdateGameFilesDirectory = Event<'updateGameFilesDirectory'>;
export type GetDownloadPath = Event<'getDownloadPath'>;
export type DownloadOriginalDaggerFall = Event<'downloadOriginalDaggerfall'>;
export type SendPath = Event<'sendPath', { path: string }>;
export type OpenDialogBox = Event<'openDialogBox'>;
export type Once = Event<'once'>;

export type GithubReleaseValues = {
  browser_download_url: string;
  name: string;
  id: number;
};

export interface PreloadExposed {
  sendEvent: (event: IPCEvents) => void;
  openDialogBox: (event: IPCEvents) => void;
  launchGame: (event: IPCEvents) => void;
  getRelease: (event: IPCEvents) => void;
  checkReleaseFromConfigFile: (event: IPCEvents) => void;
  sendPath: (event: IPCEvents) => void;
  checkForNewRelease: (event: IPCEvents) => void;
  downloadDaggerfallUnity: (event: IPCEvents) => void;
  changePermissions: (event: IPCEvents) => void;
  updateRemoteFile: (event: IPCEvents) => void;
  updateGameFilesDirectory: (event: IPCEvents) => void;
  getDownloadPath: (event: IPCEvents) => void;
  downloadOriginalDaggerfall: (event: IPCEvents) => void;
  once: (channel: Channels, func: (...args: unknown[]) => void) => void;
  on(
    channel: Channels,
    func: (...args: unknown[]) => void
  ): (() => void) | undefined;
}

export type IPCEvents =
  | SendEvent
  | LaunchGame
  | GetRelease
  | CheckReleaseFromConfigFile
  | CheckForNewRelease
  | DownloadDaggerfallUnity
  | ChangePermissions
  | UpdateRemoteFile
  | UpdateGameFilesDirectory
  | GetDownloadPath
  | DownloadOriginalDaggerFall
  | OpenDialogBox
  | SendPath;
