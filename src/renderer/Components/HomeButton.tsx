import { Link } from 'react-router-dom';
import '../CSS/styles.css';

export default function BackButton() {
  return (
    <div className="nav-menu">
      <a className="home-link">
        <Link className="home-link" to="/">
          Home
        </Link>
      </a>
      <a className="home-link">
        <Link to="/download">Download</Link>
      </a>
    </div>
  );
}
