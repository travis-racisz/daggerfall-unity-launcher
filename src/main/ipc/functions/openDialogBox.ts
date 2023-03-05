import { OpenDialogReturnValue, dialog, ipcMain } from 'electron';

export default async function openDialogBoxAction(): Promise<
  Electron.OpenDialogReturnValue | Error
> {
  console.log('clicked');

  const path = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  console.log(path, 'path');
  return path;
}
