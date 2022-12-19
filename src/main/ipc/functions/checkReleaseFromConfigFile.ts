import { configFile } from '../utils';

// eslint-disable-next-line prettier/prettier
export default async function checkReleaseFromConfigFile(): Promise<string | Error> {
  if (!configFile) {
    return new Error('no config file present');
  }
  if (!(await configFile).defaultConfig) {
    return new Error('config file is not formatted correctly');
  }
  if (!(await configFile).defaultConfig.release) {
    return new Error('no download detected');
  }
  return (await configFile).defaultConfig.release;
}
