import fs from 'fs';
import { octokit, pathToConfig, defaultConfig, platform } from '../utils';
import { GithubReleaseValues } from '../types';

/* this needs to be renamed or reworked all it is doing
  is going to github and getting the latest version number for
  daggerfall. This will be useful to determine if the user
  needs to update their game. so as is it can kind of stay.
  I am going to take another look at this tomorrow
  -Travis 1 Dec 2022 */

/* looking at this further is looks like it is getting important information
    about the files such as the browser_download_url, This function is going to be needed
    when we download the game because it will contain the url for where to download
    the unity files from

    here is an example
  {
  url: 'https://api.github.com/repos/Interkarma/daggerfall-unity/releases/assets/82850382',
  id: 82850382,
  node_id: 'RA_kwDOAbi8Us4E8DJO',
  name: 'dfu_mac_universal-v0.14.5-beta.zip',
  label: null,
  uploader: {
    login: 'Interkarma',
    id: 10426244,
    node_id: 'MDQ6VXNlcjEwNDI2MjQ0',
    avatar_url: 'https://avatars.githubusercontent.com/u/10426244?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/Interkarma',
    html_url: 'https://github.com/Interkarma',
    followers_url: 'https://api.github.com/users/Interkarma/followers',
    following_url: 'https://api.github.com/users/Interkarma/following{/other_user}',
    gists_url: 'https://api.github.com/users/Interkarma/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/Interkarma/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/Interkarma/subscriptions',
    organizations_url: 'https://api.github.com/users/Interkarma/orgs',
    repos_url: 'https://api.github.com/users/Interkarma/repos',
    events_url: 'https://api.github.com/users/Interkarma/events{/privacy}',
    received_events_url: 'https://api.github.com/users/Interkarma/received_events',
    type: 'User',
    site_admin: false
  },
  content_type: 'application/x-zip-compressed',
  state: 'uploaded',
  size: 48633147,
  download_count: 297,
  created_at: '2022-10-30T23:23:45Z',
  updated_at: '2022-10-30T23:25:09Z',
  browser_download_url: 'https://github.com/Interkarma/daggerfall-unity/releases/download/v0.14.5-beta/dfu_mac_universal-v0.14.5-beta.zip'
} assetData
    - Travis December 19th
    */

// eslint-disable-next-line consistent-return
export default async function getRelease(
  bitSize?: string
): Promise<GithubReleaseValues | Error> {
  const release = await octokit.request(
    `GET /repos/interkarma/daggerfall-unity/releases/latest`
  );
  let assetData: GithubReleaseValues = {
    name: '',
    browser_download_url: '',
    id: 0,
  };
  if (platform === 'win32') {
    release.data.assets
      .forEach((asset: GithubReleaseValues) => {
        if (asset.name.includes('windows')) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if (asset.name.includes(bitSize!)) {
            assetData = asset;
          }
        }
        return assetData;
      })
      .find((asset: GithubReleaseValues) =>
        asset.name.includes(assetData.name)
      );
  }
  if (platform === 'darwin') {
    assetData = release.data.assets.find((asset: GithubReleaseValues) =>
      asset.name.includes('mac')
    );
  }
  if (platform === 'linux') {
    assetData = release.data.assets.find((asset: GithubReleaseValues) =>
      asset.name.includes('linux')
    );
  }
  if (!platform) {
    return new Error('Error detecting platform');
  }
  return {
    ...assetData,
  };
}
