/* eslint-disable react/button-has-type */
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import DownloadPathSelector from './Components/DownloadLocation';
import BackButton from './Components/HomeButton';
import Home from './Components/Home';

const handleOnDownloadClicked = (e: any) => {
  e.preventDefault();
  // 1. OG Dagger file via Google
  window.electron.downloadOriginalDaggerfall({
    name: 'downloadOriginalDaggerfall',
    payload: undefined,
  });
};

const handleOnLaunchClicked = (e: any) => {
  e.preventDefault();
  window.electron.launchGame({ name: 'launchGame', payload: undefined });
};

// const handleDownloadDaggerfallUnityDownload = (e: any) => {
//   e.preventDefault();
//   window.addEventListener('message', (event) => {
//     console.log('eventReceived');
//     console.log(event);
//   });
//   window.electron.downloadDaggerfallUnity({
//     name: 'downloadDaggerfallUnity',
//     payload: { path: '' },
//   });
// };

const handleUpdateGameClicked = (e: any) => {
  e.preventDefault();
  window.electron.updateRemoteFile({
    name: 'updateRemoteFile',
    payload: undefined,
  });
};

const handleCheckReleaseFromConfigFile = (e: any) => {
  e.preventDefault();
  window.electron.checkReleaseFromConfigFile({
    name: 'checkReleaseFromConfigFile',
    payload: undefined,
  });
};

const handleCheckForNewRelease = async (e: any) => {
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
      <Link to="/download">download</Link>
      {/* <button onClick={handleDownloadDaggerfallUnityDownload}>Download Daggerfall</button> */}
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
    <button onClick={handleCheckReleaseFromConfigFile} id="update">
      Check current version
    </button>
    {/* <Home /> */}
  </>
);

export default function App() {
  return (
    <Router>
      <div>
        <BackButton />
        <Routes>
          <Route path="/" element={<DaggerFall />} />
          <Route path="/download" element={<DownloadPathSelector />} />
        </Routes>
      </div>
    </Router>
  );
}

// import { Transition, TransitionGroup } from 'react-transition-group';
// import './App.css';
// import DownloadLocation from './Components/DownloadLocation';

// export default function App(){
//   return(
//   <Router>
//     <Routes
//       render={({ location }) => (
//         <TransitionGroup>
//           <Transition
//             key={location.key}
//             timeout={{ enter: 300, exit: 300 }}
//           >
//               <Route exact path="/" element={<Home />} />
//               <Route path="/download" element={<DownloadLocation />} />
//               {/* Other routes */}
//           </Transition>
//         </TransitionGroup>
//       )}
//     />
//   </Router>
//   )};
