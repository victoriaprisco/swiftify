import { getSong, removeTracks } from './handleAPIRequests';
const TVs = ["Fearless", "Fearless Platinum Edition", "Speak Now", "Speak Now (Deluxe Edition)", "Red", "Red (Deluxe Edition)"];

export function getSwiftTracks(profile, playlist){
    var stolenTracks = [];
    playlist.forEach((track)=>{
        if(track.owner === profile.id && track.artist === "Taylor Swift"){
            if(TVs.includes(track.album)){
                stolenTracks.push(track);
            }
        }
    });
    if(stolenTracks.length != 0){
        removeStolens(stolenTracks);
    }
}
const mapPlaylistToTracks = new Map();

async function getTVTracks(track){
    if(track){
        const searchTerm = replace(track.name, ' ', '+') + "+%28Taylor%27s+Version%28";
        getSong(searchTerm).then((res)=>{
            if(res){
                // console.log(track.name, "->", res.tracks.items[0].name, ": ", track.playlistID);
                if(mapPlaylistToTracks.has(track.playlistID)){
                    const oldList = mapPlaylistToTracks.get(track.playlistID);
                    oldList.push({
                        "oldTrack": track,
                        "newTrack": res.tracks.items[0]
                    });
                    // mapPlaylistToTracks.set(track.playlistID, oldList);
                }
                else {
                    mapPlaylistToTracks.set(track.playlistID, [{
                        "oldTrack": track,
                        "newTrack": res.tracks.items[0]
                    }]);
                }
            }
        });
    }
}

// api call: https://api.spotify.com/v1/search?q={searchTerm}&type=track
function removeStolens(stolenTracks){
    stolenTracks.forEach((track) => {
        getTVTracks(track);
    });
    // console.log("MAP", mapPlaylistToTracks);
    removeTracks(mapPlaylistToTracks);
}
function replace(target, pattern, replacement){
    var result = '';
    for(var i = 0; i < target.length; i++){
        result += target.charAt(i) === pattern ? replacement : target.charAt(i);
    }
    return result;
}