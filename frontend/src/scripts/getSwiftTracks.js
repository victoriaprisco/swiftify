import { getSong, addTVTracks } from './handleAPIRequests';
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
    else {
        return "no tracks";
    }
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
    }
    else {
        mapPlaylistToTracks.set(track.playlistID, [{
            "oldTrack": track,
            "newTrack": TV.tracks.items[0]
        }]);
    }
}
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
    addTVTracks(mapPlaylistToTracks);

}
function replace(target, pattern, replacement){
    var result = '';
    for(var i = 0; i < target.length; i++){
        result += target.charAt(i) === pattern ? replacement : target.charAt(i);
    }
    return result;
}