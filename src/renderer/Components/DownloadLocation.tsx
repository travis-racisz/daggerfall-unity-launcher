import React, { useState } from 'react';
import '../CSS/DownloadLocation.css';
import ButtonPanel from './ButtonPannel';

const DownloadLocation = () => {
  const [downloadPath, setDownloadPath] = useState('');
  console.log(window.electron, 'window.electron');

  const handleDownloadDaggerfallUnityDownload = (e: any) => {
    e.preventDefault();
    window.addEventListener('message', (event) => {
      console.log('eventReceived');
      console.log(event);
    });
    window.electron.downloadDaggerfallUnity({
      name: 'downloadDaggerfallUnity',
      payload: undefined,
    });
  };

  const handleFileInputChange = (event: any) => {
    try {
      const selectedPath: string = event.target.files[0].path;
      const parentFolder: string = selectedPath.substring(
        0,
        selectedPath.lastIndexOf('/')
      );
      setDownloadPath(parentFolder);
      window.electron.sendPath({
        name: 'sendPath',
        payload: { path: parentFolder },
      });
    } catch (error) {
      console.error(error);
      setDownloadPath('');
    }
  };

  return (
    <div className="download-location">
      <ButtonPanel />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="folder-input">Choose download location:</label>
      <input
        type="file"
        id="folder-input"
        onChange={handleFileInputChange}
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
