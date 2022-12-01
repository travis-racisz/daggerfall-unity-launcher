import { ipcRenderer } from 'electron';
import fs from 'fs';
import child_process from 'child_process';
import configFile from '../../config.json';
import { pathToConfig } from '../utils';

export default function launchGame() {
  if (!configFile.defaultConfig.gamePath) {
    ipcRenderer.send('game exe not found');
    ipcRenderer.on('Pointed to exe file', (event, path) => {
      configFile.defaultConfig.executable = path;
      fs.writeFileSync(pathToConfig, JSON.stringify(configFile));
      const { platform } = process;
      switch (platform) {
        case 'win32':
          child_process.exec(
            `START ${path}`,
            { shell: process.env.ComSpec || 'cmd.exe' },
            function (err, stdout, stderr) {
              if (!err) {
                console.log(err);
              }
              ipcRenderer.send('launched-game');
              window.postMessage('launched-game');
            }
          );
          break;
        case 'darwin':
          child_process.exec(
            `open -a ${path}/DaggerFallUnity.app/Contents/MacOS/'Daggerfall Unity'`,
            (err) => {
              if (err) {
                console.error(err);
              }
            }
          );
          break;
        default:
          break;
      }
    });
  }
}
