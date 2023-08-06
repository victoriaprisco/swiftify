import Playlist from './Playlist.js';
import Home from './Home.js';
import {profile, playlists} from '../scripts/handleAPIRequests.js';


const Dashboard = () => {
    var returnValue =
    <>{profile.display_name ? <h1>hey {profile.display_name}!</h1> : <Home reload={true}/> }</> ;
    var resultsList = [];
    
    
    if(playlists){
        playlists.forEach((playlistList)=>{
            if(playlistList){
                // if(playlists[0]){
                // const playlist = playlists[0][0];
                // resultsList.push(<Playlist key={playlist.id} object={playlist} token={token}/>);
                playlistList.forEach((playlist) => {
                    resultsList.push(<Playlist key={playlist.id} object={playlist}/>);
                });
            }
        });
    }
    
    return(<> {returnValue} <ul>{resultsList}</ul></>);
}

export default Dashboard;