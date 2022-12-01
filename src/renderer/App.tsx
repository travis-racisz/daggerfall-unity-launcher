/* eslint-disable react/button-has-type */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

const Hello = () => {
  return (
    <div>
      {
        // eslint-disable-next-line react/button-has-type
        <>
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            onClick={() =>
              window.electron.launchGame({
                name: 'launchGame',
                payload: undefined,
              })
            }
          >
            Launch Game
          </button>
          <button
            onClick={() =>
              window.electron.getRelease({
                name: 'getRelease',
                payload: undefined,
              })
            }
          >
            Get Release
          </button>
        </>
      }
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
