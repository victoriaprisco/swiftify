import { getSong, addTVTracks } from './handleAPIRequests';
const TVs = ["Fearless", "Fearless Platinum Edition", "Speak Now", "Speak Now (Deluxe Edition)", "Red", "Red (Deluxe Edition)", "1989", "1989 (Deluxe Edition)"];
var mapPlaylistToTracks = new Map();
export async function getSwiftTracks(profile, playlist){
    var stolenTracks = [];
    playlist.forEach((track)=>{
        if(track.owner === profile.id && track.artist === "Taylor Swift"){
            if(TVs.includes(track.album)){
                stolenTracks.push(track);
            }
        }
    });
    if(stolenTracks.length === 0){
        return "no tracks";
    }
    else {
        await removeStolens(playlist, stolenTracks);
        return "done";
    }
}
export function clearMap(){
    mapPlaylistToTracks.clear();
}

async function removeStolens(playlist, stolenTracks){
    var tracks = [];
    for(var track of stolenTracks) {
        if(track){
            const track_name = replace(track.name, '&', "and")
            const searchTerm = replace(track_name, ' ', '+') + "+%28Taylor%27s+Version%28";
            const song = await getSong(searchTerm);
            console.log(track.name + " => " + song.tracks.items[0].name);
            if(song.tracks.items.length !== 0){
                tracks.push({"oldTrack": track, "newTrack": song});
            }
            else {
                console.log("no TV track");
            }
        }
        
    };
    addTVTracks(playlist, tracks);

}
function replace(target, pattern, replacement){
    var result = '';
    for(var i = 0; i < target.length; i++){
        result += target.charAt(i) === pattern ? replacement : target.charAt(i);
    }
    return result;
}