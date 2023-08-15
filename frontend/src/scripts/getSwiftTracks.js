import { getSong, removeTracks } from './handleAPIRequests';
const TVs = ["Fearless", "Fearless Platinum Edition", "Speak Now", "Speak Now (Deluxe Edition)", "Red", "Red (Deluxe Edition)"];
const mapPlaylistToTracks = new Map();
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
var advance = false;
async function getTVTracks(track){
    
}
function map(song){
    const track = song.OG;
    const TV = song.TV;
    console.log(track.name, "->", TV.tracks.items[0].name, ": ", track.playlistID);
    if(mapPlaylistToTracks.has(track.playlistID)){
        const oldList = mapPlaylistToTracks.get(track.playlistID);
        oldList.push({
            "oldTrack": track,
            "newTrack": TV.tracks.items[0]
        });
        // mapPlaylistToTracks.set(track.playlistID, oldList);
    }
    else {
        mapPlaylistToTracks.set(track.playlistID, [{
            "oldTrack": track,
            "newTrack": TV.tracks.items[0]
        }]);
    }
}
// api call: https://api.spotify.com/v1/search?q={searchTerm}&type=track
async function removeStolens(stolenTracks){
    for(var track of stolenTracks) {
        console.log("stolen track", track);
        if(track){
            const searchTerm = replace(track.name, ' ', '+') + "+%28Taylor%27s+Version%28";
            const song = await getSong(searchTerm);
            console.log(song);
            map({"OG": track, "TV": song});
        }
        
    };
    
    console.log(mapPlaylistToTracks.size);
    removeTracks(mapPlaylistToTracks);

}
function replace(target, pattern, replacement){
    var result = '';
    for(var i = 0; i < target.length; i++){
        result += target.charAt(i) === pattern ? replacement : target.charAt(i);
    }
    return result;
}