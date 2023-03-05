import { Link } from 'react-router-dom';
import '../CSS/Home.css';

const Home = () => (
  <div className="home">
    <h1 className="header">Daggerfall Unity Launcher</h1>
    <div className="buttons">
      <Link to="/download" className="button">
        Download Game
      </Link>
      <button type="button" className="button">
        Update Game
      </button>
      <button type="button" className="button">
        Launch Game
      </button>
      <button type="button" className="button">
        Check for Update
      </button>
    </div>
  </div>
);

export default Home;
