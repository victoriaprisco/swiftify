import {completeAuth} from '../scripts/authorization.js';
import "../styles/Login.css";

const Login = () => {
    return (
        <div id="container">
            <h1 id="welcome" className="desc">welcome to swiftify!</h1>
            <span id="subheader"><h3 className="desc">replace all the stolen songs with taylor's versions on your playlists</h3></span>
            <div className="desc"><button id="login-button" onClick={completeAuth}>login to spotify </button> </div>
        </div>
    )
}
export default Login;