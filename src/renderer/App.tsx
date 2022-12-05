/* eslint-disable react/button-has-type */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

const handleOnDownloadClicked = (e: any) => {
  e.preventDefault();
  // 1. OG Dagger file via Google
  window.electron.downloadFile({ name: 'downloadFile', payload: undefined });
};

const handleOnLaunchClicked = (e: any) => {
  e.preventDefault();
  window.electron.launchGame({ name: 'launchGame', payload: undefined });
};

const handleUpdateGameClicked = (e: any) => {
  e.preventDefault();
  window.electron.updateRemoteFile({
    name: 'updateRemoteFile',
    payload: undefined,
  });
};

const handleCheckForNewRelease = (e: any) => {
  e.preventDefault();
  window.electron.checkForNewRelease({
    name: 'checkForNewRelease',
    payload: undefined,
  });
};

const DaggerFall = () => (
  <>
    <title>Daggerfall Launcher</title>
    <h1>Daggerfall Unity Installer and Updater</h1>

    <div id="download-container" className="download-container">
      <div id="currently-installed" className="currently-installed">
        <p id="current-release" />
        <span className="tooltiptext">Update game files directory</span>
      </div>
      <button onClick={handleOnDownloadClicked}>Download Daggerfall</button>
      {/* <progress id="progress" className="hidden" /> */}
      <p id="download-message" className="hidden" />
    </div>
    <div id="launch-game-container" className="download-container">
      <button onClick={handleOnLaunchClicked} type="button" id="launch-game">
        Launch Game
      </button>
    </div>
    <div id="update-container" className="update-container">
      <button onClick={handleUpdateGameClicked} type="button" id="update-game">
        Update Game
      </button>
    </div>
    <button onClick={handleCheckForNewRelease} id="update">
      Check For New Release
    </button>
  </>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DaggerFall />} />
      </Routes>
    </Router>
  );
}
