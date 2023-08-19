import Home from './Home.js';
import {getProfile, getPlaylists, getTracks, formatJSON} from '../scripts/handleAPIRequests.js';
import { getSwiftTracks } from '../scripts/getSwiftTracks.js';

export const profile = await (async ()=>{
    const profile = await getProfile();
    return profile;
})();

const Dashboard = () => {
    return(
    <> 
        {profile.display_name ? <h1>hey {profile.display_name}!</h1> : <Home reload={true}/> }
        {profile.display_name && <>
        <p>Now that you've connected your Spotify, press the button below to remove all of the stolen Taylor songs from your playlists and replace them with Taylor's Versions. </p>
        <p>We will keep the order of your playlists and other non-Taylor songs that are on it!</p>
        <button onClick={()=> {
            var noTracks = "";
            getPlaylists().then((playlists)=>{
                if(playlists){
                    playlists.forEach((playlistList)=>{
                        if(playlistList){
                            playlistList.forEach((playlist) => {
                                if(playlist){
                                    getTracks(playlist.tracks.href).then((tracks)=>{
                                        if(tracks){
                                            const formattedTracks = formatJSON(playlist.tracks.total, playlist.owner, playlist.id, tracks);
                                            // console.log("tracks have been formatted", formattedTracks);
                                            if(formattedTracks == null){
                                                console.log("we got null");
                                                return;
                                            }
                                            else{
                                                getSwiftTracks(profile, formattedTracks).then((foundTracks)=>{
                                                    // console.log(foundTracks === "no tracks");
                                                    noTracks = foundTracks === "no tracks";
                                                });
                                                
                                            } 
                                        }  
                                    }).catch((e)=>{
                                        console.error(e);
                                    });
                                    
                                }
                                else {
                                    alert("something went wrong. please wait a few minutes and try again!");
                                }
                            });
                        }
                    });
                }
            }).catch((e)=>console.error(e));
            console.log(noTracks);
            
        }}> swiftify me !! </button>
        </>
    }
    </>
    );
}

export default Dashboard;