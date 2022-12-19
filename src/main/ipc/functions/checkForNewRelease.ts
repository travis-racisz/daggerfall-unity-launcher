import { configFile, octokit } from '../utils';
import getRelease from './getRelease';

export default async function checkForNewRelease(): Promise<boolean | Error> {
  const release = await octokit.request(
    `GET /repos/interkarma/daggerfall-unity/releases/latest`
  );
  if (!release) {
    return new Error('api call to Github failed');
  }

  if (release.data.name !== (await configFile).defaultConfig.release) {
    return true;
  }
  return false;
}
