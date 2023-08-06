import Playlist from './Playlist.js';
import Home from './Home.js';
import {profile, playlists, getTracks, formatJSON} from '../scripts/handleAPIRequests.js';
import { getSwiftTracks } from '../scripts/getSwiftTracks.js';

const Dashboard = () => {
    var returnValue =
    <>{profile.display_name ? <h1>hey {profile.display_name}!</h1> : <Home reload={true}/> }</> ;
    var resultsList = [];
    if(playlists){
    playlists.forEach((playlistList)=>{
        if(playlistList){
            playlistList.forEach(async (playlist) => {
                const tracks = await getTracks(playlist.tracks.href);
                const formattedTracks = formatJSON(tracks);
                getSwiftTracks(formattedTracks);
                resultsList.push(<Playlist key={playlist.id} object={playlist}/>);
            });
        }
    });
    
    }
    
    
    
    return(<> {returnValue} <ul>{resultsList}</ul></>);
}

export default Dashboard;