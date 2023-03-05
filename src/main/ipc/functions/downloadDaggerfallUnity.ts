import { BrowserWindow, ipcMain } from 'electron';
import fs from 'node:fs';
import axios from 'axios';
import getRelease from './getRelease';

export default async function downloadDaggerfallUnity(win: any) {
  ipcMain.on('Path Chosen', async (path: any) => {
    // @ts-expect-error "browser_download_url is defined in types.ts, typescript is just being weird -Travis Dec 19th 2022"
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/ban-ts-comment
    const { browser_download_url } = await getRelease();
    await axios.get(browser_download_url, {
      onDownloadProgress(progressEvent) {
        win.webContents.send('ipc-example', progressEvent.progress);
      },
    });
      // .then(response => {
      //   response.data.pipe(fs.createWriteStream(path))
      // })
  })
}
