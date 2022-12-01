import fs from 'fs';
import { octokit, pathToConfig, defaultConfig, platform } from '../utils';
import { Asset } from '../types';

/* this needs to be renamed or reworked all it is doing
  is going to github and getting the latest version number for
  daggerfall. This will be useful to determine if the user
  needs to update their game. so as is it can kind of stay.
  I am going to take another look at this tomorrow
  -Travis 1 Dec 2022 */

// eslint-disable-next-line consistent-return
export default async function getRelease(bitSize?: string) {
  const release = await octokit.request(
    `GET /repos/interkarma/daggerfall-unity/releases/latest`
  );
  let assetData: Asset = { name: '' };
  defaultConfig.release = release.data.name;
  // I don't really know why this is being written to the config file
  fs.writeFile(
    pathToConfig,
    JSON.stringify({ defaultConfig }, null, 2),
    (err) => {
      if (err) throw err;
    }
  );
  if (platform === 'win32') {
    release.data.assets
      .forEach((asset: Asset) => {
        if (asset.name.includes('windows')) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if (asset.name.includes(bitSize!)) {
            assetData = asset;
          }
        }
        return assetData;
      })
      .find((asset: Asset) => asset.name.includes(assetData.name));
  }
  if (platform === 'darwin') {
    assetData = release.data.assets.find((asset: Asset) =>
      asset.name.includes('mac')
    );
  }
  if (platform === 'linux') {
    assetData = release.data.assets.find((asset: Asset) =>
      asset.name.includes('linux')
    );
  }
  if (!platform) {
    return new Error('Error detecting platform');
  }
  return assetData;
}
