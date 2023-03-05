import { Link } from "react-router-dom";
import '../CSS/styles.css'

export default function BackButton(){
  return(
    <a className="home-link"><Link className="home-link" to = "/">Home</Link></a>
  )
}
