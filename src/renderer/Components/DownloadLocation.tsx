import React, { MouseEvent, MouseEventHandler, useState } from 'react';
import '../CSS/DownloadLocation.css';
import ButtonPanel from './ButtonPannel';

type PathType = {
  filePaths: string[];
  canceled: boolean;
  bookmarks?: string[];
};

const DownloadLocation = () => {
  const [downloadPath, setDownloadPath] = useState<string[]>(['']);
  window.electron.on('path-selected', (path: PathType) => {
    setDownloadPath(path.filePaths);
  });

  const handleDownloadDaggerfallUnityDownload = (e: any) => {
    e.preventDefault();
    window.addEventListener('message', (event) => {
      console.log('eventReceived');
      console.log(event);
    });
    window.electron.downloadDaggerfallUnity({
      name: 'downloadDaggerfallUnity',
      payload: { path: downloadPath },
    });
  };

  const handleFileInputChange = (event: MouseEvent) => {
    // need to use showOpenDialog in main to get file path then send the file path to the download Unity function
    // this cant be handled on the renderer side because of possible vulnerabilities
    // try {
    //   const selectedPath: string = event?.target?.files[0].path;
    //   const parentFolder: string = selectedPath.substring(
    //     0,
    //     selectedPath.lastIndexOf('/')
    //   );
    //   setDownloadPath(parentFolder);
    //   window.electron.sendPath({
    //     name: 'sendPath',
    //     payload: { path: downloadPath },
    //   });
    // } catch (error) {
    //   console.error(error);
    //   setDownloadPath('');
    // }

    window.electron.openDialogBox({
      name: 'openDialogBox',
      payload: undefined,
    });
  };

  return (
    <div className="download-location">
      <ButtonPanel />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="folder-input">Choose download location:</label>
      <input
        type="button"
        id="folder-input"
        onClick={(e) => handleFileInputChange(e)}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        webkitdirectory=""
        mozdirectory=""
        msdirectory=""
        odirectory=""
        directory=""
      />
      <p>Selected download location: {downloadPath || 'No path selected'}</p>
      <button
        type="button"
        onClick={(e) => handleDownloadDaggerfallUnityDownload(e)}
      >
        {' '}
        Download
      </button>
    </div>
  );
};

export default DownloadLocation;
