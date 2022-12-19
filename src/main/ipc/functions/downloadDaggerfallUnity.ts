import http from 'http';
import { Url } from 'url';
import getRelease from './getRelease';

export default async function downloadDaggerfallUnity() {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { name, browser_download_url } = await getRelease();
  const url = new URL(browser_download_url);
  const getDownloadFiles = http.get({
    hostname: url.hostname,
    pathname: url.pathname,
  });

  getDownloadFiles.on('data', (chunk) => {
    console.log(chunk);
  });
}
