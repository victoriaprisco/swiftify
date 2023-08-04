import {getToken} from '../scripts/authorization.js';
import Playlist from './Playlist.js';
import Home from './Home.js';

async function getProfile (token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}
async function getPlaylists(token){
    var results = [];
    var next = 'https://api.spotify.com/v1/me/playlists?limit=50';
    var offset = 0;
    const limit = 50;
    var total = 100;
    while(offset + limit < total){
        try {
            const result = await fetch(next, {
                method: "GET", headers: { Authorization: `Bearer ${token}`}
            });
            var json = await result.json();
            results.push(json.items);
            console.log(results);
            offset = json.offset;
            total = json.total;
            next = json.next;
        }
        catch (e) {
            console.error(e);
        }
    }
    return results;
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
    var returnValue =
    <>{profile.display_name ? <h1>hey {profile.display_name}!</h1> : <Home reload={true}/> }</> ;
    var resultsList = [];
    if(playlists){
        playlists.forEach((playlistList)=>{
            if(playlistList){
                playlistList.forEach((playlist) => {
                    resultsList.push(<Playlist key={playlist.id} title={playlist.name} />);
                });
            }
        });
    }
    
    return(<> {returnValue} <ul>{resultsList}</ul></>);
}

export default Dashboard;