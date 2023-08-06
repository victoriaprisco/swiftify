const TVs = ["Fearless", "Speak Now", "Speak Now (Deluxe Edition)", "Red"];

export function getSwiftTracks(playlist){
    var swiftTracks = [];
    playlist.forEach((track)=>{
        // console.log(track.artist);
        if(track.artist === "Taylor Swift"){
            if(TVs.includes(track.album)){
                console.log("IMPOSTER ", track.name);
            }
            swiftTracks.push(track);
        }
    });
    return swiftTracks;
}

function removeStolens(stolenTracks){
    
}