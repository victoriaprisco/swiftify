import Playlist from './Playlist.js';
import Home from './Home.js';
import {profile, playlists} from '../scripts/handleAPIRequests.js';

const debugMode = true;
const Dashboard = () => {
    var returnValue =
    <>{profile.display_name ? <h1>hey {profile.display_name}!</h1> : <Home reload={true}/> }</> ;
    var resultsList = [];
    
    if(debugMode){
        if(playlists){
            if(playlists[0]){
                const playlist = playlists[0][34];
                // do something
                resultsList.push(<Playlist key={playlist.id} object={playlist}/>);
            }
        }
    }

    else {
        if(playlists){
        playlists.forEach((playlistList)=>{
            if(playlistList){
                playlistList.forEach((playlist) => {
                    resultsList.push(<Playlist key={playlist.id} object={playlist}/>);
                });
            }
        });
    }
    }
    
    
    
    return(<> {returnValue} <ul>{resultsList}</ul></>);
}

export default Dashboard;