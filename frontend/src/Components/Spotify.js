import Image from "./logos.svg";
import Disconnect from "./Disconnect.js";

import "../styles/Spotify.css";
const Spotify = () => {
    return (<>
    <div id="spotify">
        <Disconnect />
        <a id="image" href="https://www.spotify.com/"><img src={Image}></img></a>
    </div>
    </>)

}

export default Spotify;