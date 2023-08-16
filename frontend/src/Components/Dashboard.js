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

    
    return(
    <> 
        {profile.display_name ? <h1>hey {profile.display_name}!</h1> : <Home reload={true}/> }
        {profile.display_name && <>
        <p>Now that you've connected your Spotify, press the button below to remove all of the stolen Taylor songs from your playlists and replace them with Taylor's Versions. </p>
        <p>We will keep the order of your playlists and other non-Taylor songs that are on it!</p>
        <button onClick={()=> {
            var noTracks;
            if(playlists){
                playlists.forEach((playlistList)=>{
                    if(playlistList){
                        playlistList.forEach(async (playlist) => {
                            if(playlist){
                                const tracks = await getTracks(playlist.tracks.href).catch((e)=>{
                                    console.error(e);
                                });
                                if(tracks){
                                    const formattedTracks = formatJSON(playlist.tracks.total, playlist.owner, playlist.id, tracks);
                                    if(formattedTracks === null){
                                        console.log("we got null");
                                        return;
                                    }
                                    else{
                                        const foundTracks = getSwiftTracks(profile, formattedTracks);
                                        if(foundTracks === "no tracks"){
                                            
                                            noTracks = true;
                                        }
                                        else {
                                            noTracks = false;
                                            // console.log(playlist.name);
                                        }
                                    } 
                                }  
                            }
                        });
                    }
                });
            }
            console.log(noTracks);
            if(noTracks === true){
                alert("we just checked in the back - you didn't have any tracks to swiftify!");
            }
        }}> swiftify me !! </button>
        </>
    }
    </>
    );
}

export default Dashboard;