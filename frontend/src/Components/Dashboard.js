import Home from "./Home.js";
import Spotify from "./Spotify.js";
import Modes from "./Modes.js";
import {
  profile,
  getPlaylists,
  getTracks,
  formatJSON,
} from "../scripts/handleAPIRequests.js";
import { clearMap, getSwiftTracks } from "../scripts/getSwiftTracks.js";
import "../styles/Dashboard.css";
import React, { useState } from 'react';


const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const Dashboard = () => {
    const [pressed, setPressed] = useState("swiftify me !!");
    return (
        <div id="container2">
            <Modes />
        {profile.display_name ? (
            <h1 id="username" >
            hey {profile.display_name}!
            </h1>
        ) : (
            <Home reload={true} />
        )}
        
        {profile.display_name && (
            <>
            <p className="info">
                Now that you've connected your Spotify, press the button below to
                remove all of the stolen Taylor songs from your playlists and
                replace them with Taylor's Versions.{" "}
            </p>
            <p className="info">
                We will keep the order of your playlists and other non-Taylor songs that are on it!
            </p>
            <p className="info">
                If you have a lot of playlists, this process might take a minute. We will update you when we are done! 
            </p>
            <span id="button-container">
                <button
                className="info"
                id="start-button"
                onClick={async () => {
                    var progress = "in progress..."
                    setPressed(progress)
                    var noTracks = true;
                    const playlists = await getPlaylists();
                    if (!playlists) {
                    alert("something went wrong.");
                    return;
                    }
                    for(var playlistList in playlists){
                        var list = playlists[playlistList]
                        if(!list) {
                            return;
                        }
                        for (const i in list) {
                            if(progress.length > 16) {
                                progress = "working.."
                            }
                            else {
                                progress += "."
                            }
                            setPressed(progress)
                            var playlist = list[i]
                            if(!playlist){
                                return;
                            }
                            if (playlist) {
                                console.log("NO TRACKS:", noTracks)
                                const tracks = await getTracks(playlist.tracks.href)
                                if(tracks){
                                    const formattedTracks = formatJSON(playlist.tracks.total, playlist.owner, playlist.id, tracks);
                                    if(formattedTracks == null){
                                        console.log("we got null");
                                        return;
                                    }
                                    else{
                                        getSwiftTracks(profile, formattedTracks).then((foundTracks)=>{
                                            noTracks = foundTracks === "no tracks" && noTracks;
                                        });
                                    }
                                }
                                await sleep(20);
                                
                            }
                        }
                    }
                    clearMap();
                    console.log("DONE");
                    setPressed("done!")
                    if(noTracks == true) {
                        alert("we didn't find any tracks to swiftify!")
                    }
                    console.log(noTracks);
                }}
                >
                {pressed}
                </button>
            </span>
            <div id="row">
                <Spotify id="image" />
            </div>
            </>
        )}
        </div>
  );
};

export default Dashboard;
