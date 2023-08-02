import {completeAuth} from '../scripts/authorization.js';

const Login = () => {
    return (
        <>
            <h1>welcome to swiftify</h1>
            <h3>replace all the stolen versions with taylor's versions on playlists made by you</h3>
            <h4>log in to spotify to continue</h4>
            <button onClick={completeAuth}>login to spotify </button> 
        </>
    )
}
export default Login;