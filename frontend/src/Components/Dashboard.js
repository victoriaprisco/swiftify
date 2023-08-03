import {getToken} from '../scripts/authorization.js';
import Playlist from './Playlist.js';
async function getProfile (token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}
async function getPlaylists(token){
    const result = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
        method: "GET", headers: { Authorization: `Bearer ${token}`}
    });
    return await result.json();
}
const params = new URLSearchParams(window.location.search);
const token = await getToken(params.get("code"));
const profile = await (async ()=>{
    const profile = await getProfile(token.access_token);
    return profile;
})();
const playlists = await (async ()=>{
    const playlists = await getPlaylists(token.access_token);
    return playlists;
})();

const Dashboard = () => {
    var returnValue = <>
    {profile ? <h1>hey {profile.display_name}!</h1> :  <h1>no work</h1>} </>;
    console.log(playlists);
    if(playlists.items){
        playlists.items.forEach((playlist)=>{
        returnValue += playlist.name + `<br>`;
    });
    }
    
    return(returnValue
    
    );
}

export default Dashboard;