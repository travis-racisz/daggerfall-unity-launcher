import { ipcMain } from 'electron';
import fs from 'node:fs';
import axios from 'axios';
import getRelease from './getRelease';

export default async function downloadDaggerfallUnity(
  win: any,
  path: string[]
): Promise<any> {
  // @ts-expect-error "browser_download_url is defined in types.ts, typescript is just being weird -Travis Dec 19th 2022"
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/ban-ts-comment
  const { browser_download_url } = await getRelease();
  await axios
    .get(browser_download_url, {
      responseType: 'stream',
      onDownloadProgress(progressEvent) {
        win.webContents.send('ipc-example', progressEvent.progress);
      },
    })
    .then((response) => {
      response.data.pipe(
        fs.createWriteStream(`${path[0]}/daggerfallunity.zip`)
        // TODO: need to unzip files
      );
      return null;
    })
    .catch((error: Error) => {
      console.warn(error);
      throw new Error(error.message);
    });
}
