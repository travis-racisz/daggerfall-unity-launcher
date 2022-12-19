import { Octokit } from '@octokit/core';

export const defaultConfig = {
  gamePath: '',
  modsPath: '',
  executable: '',
  release: '',
};
export const pathToConfig = `${__dirname}/config.json`;
export const octokit = new Octokit();
export const configFile = import('./config.json');
export const { platform }: { platform: string } = process;
