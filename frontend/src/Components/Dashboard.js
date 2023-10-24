import Home from './Home.js';
import Spotify from './Spotify.js'
import {profile, getPlaylists, getTracks, formatJSON} from '../scripts/handleAPIRequests.js';
import { clearMap, getSwiftTracks } from '../scripts/getSwiftTracks.js';
import "../styles/Dashboard.css";


const Dashboard = () => {
    return(
    <div id="container2"> 
        {profile.display_name ? <h1 id="username" className="info">hey {profile.display_name}!</h1> : <Home reload={true}/> }
        {profile.display_name && <>
        <p className="info">Now that you've connected your Spotify, press the button below to remove all of the stolen Taylor songs from your playlists and replace them with Taylor's Versions. </p>
        <p className="info">We will keep the order of your playlists and other non-Taylor songs that are on it!</p>
        <span id="button-container"><button className="info" id="start-button" onClick={()=> {
            var noTracks = false;
            getPlaylists().then((playlists)=>{
                if(playlists){
                    playlists.forEach((playlistList)=>{
                        if(playlistList){
                            playlistList.forEach((playlist) => {
                                if(playlist){
                                    getTracks(playlist.tracks.href).then((tracks)=>{
                                        if(tracks){
                                            const formattedTracks = formatJSON(playlist.tracks.total, playlist.owner, playlist.id, tracks);
                                            if(formattedTracks == null){
                                                console.log("we got null");
                                                return;
                                            }
                                            else{
                                                getSwiftTracks(profile, formattedTracks).then((foundTracks)=>{
                                                    noTracks = foundTracks !== "no tracks";
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
                clearMap();
                console.log("DONE");
            }).catch((e)=>console.error(e));
            console.log(noTracks);

        }}> swiftify me !! </button></span>
        <Spotify id="image"/>
        </>
    }
    </div>
    );
}

export default Dashboard;