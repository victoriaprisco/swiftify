import Playlist from './Playlist.js';
import Home from './Home.js';
import {profile, getPlaylists, getTracks, formatJSON} from '../scripts/handleAPIRequests.js';
import { getSwiftTracks } from '../scripts/getSwiftTracks.js';
export const playlists = await (async ()=>{
    const playlists = await getPlaylists();
    return playlists;
})();

const Dashboard = () => {
    var returnValue =
    <>{profile.display_name ? <h1>hey {profile.display_name}!</h1> : <Home reload={true}/> }</> ;
    var resultsList = [];

    if(playlists){
        playlists.forEach((playlistList)=>{
            // console.log(playlistList);
            if(playlistList){
                playlistList.forEach(async (playlist) => {
                    const tracks = await getTracks(playlist.tracks.href);
                    const formattedTracks = formatJSON(playlist.tracks.total, playlist.owner, playlist.id, tracks);
                    getSwiftTracks(profile, formattedTracks);
                    resultsList.push(<Playlist key={playlist.id} object={playlist}/>);
                });
            }
        });
    }
    
    
    
    return(<> {returnValue} <ul>{resultsList}</ul></>);
}

export default Dashboard;