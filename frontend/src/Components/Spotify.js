import Image from "./logos.svg";
import Disconnect from "./Disconnect.js";

import "../styles/Spotify.css";
const Spotify = () => {
    return (<>
    <div id="spotify">
        <Disconnect />
        <img id="image" src={Image}></img>
    </div>
    </>)

}

export default Spotify;