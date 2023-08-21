import {getToken} from '../scripts/authorization.js';
const params = new URLSearchParams(window.location.search);
var token = await getToken(params.get("code"));
if(token){
    token = token.access_token;
}
else {
    console.error(new Error("uh oh"));
}
export const profile = await (async ()=>{
    const profile = await getProfile();
    return profile;
})();
async function getProfile () {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}
export async function getPlaylists(){
    var results = [];
    var next = 'https://api.spotify.com/v1/me/playlists?limit=50';
    var offset = 0;
    const limit = 50;
    var total = 100;
    // FIXME commented for 429 error 
    while(offset + limit < total){
        try {
            const result = await fetch(next, {
                method: "GET", headers: { Authorization: `Bearer ${token}`}
            });
            var json = await result.json();
            results.push(json.items);
            offset = json.offset;
            total = json.total;
            next = json.next;
        }
        catch (e) {
            console.error(e);
            offset = total;
            console.log("unable to retrieve playlists");
        }
    }
    return results;
}


export  async function getTracks (contents) {
    const result = await fetch(contents, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

export function formatJSON(length, owner, playlistID, tracks){
    var returnJSON = [];
    var i = 0;
    tracks.items.forEach((value)=>{
        if(value && value.track){
            returnJSON.push({
                "name": value.track.name,
                "artist": value.track.artists[0].name,
                "album":  value.track.album.name,
                "uri": value.track.uri,
                "playlistID": playlistID,
                "position": i,
                "owner": owner.id,
                "length": length
            });
        i++;
        }
        else{
            return null;
        }
    });
    return returnJSON;
}

export async function getSong(searchTerm){
    const result = await fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}
function createBody(ids){
    var i = 0;
    var idsToRemove = [];
    ids.forEach((id)=>{
        var uri = id.oldTrack.uri;
        idsToRemove[i] = "{\"uri\":\"" + uri + "\"}";
        i++;
    }); 
    return idsToRemove;
}
function removeTracks(playlist, tracks){
    // map.forEach(async (value, key)=> {
        const playlistID = playlist[0].playlistID;
        const idsToRemove = createBody(tracks);
        var headers = new Headers();
        headers.append("Authorization", "Bearer " + token);
        var body = "{\"tracks\": [" + idsToRemove + "]}";
        var requestOptions = {
            method: 'DELETE',
            headers: headers,
            body: body
        };
        fetch("https://api.spotify.com/v1/playlists/" + playlistID + "/tracks", requestOptions).then((result)=>{
            if(result.status === 200 || result.status === 201){
                console.log("TRACKS HAVE BEEN DELETED", result);
            }
            else {
                console.log('error', result);
                alert("something went wrong. please refresh and try again!");
            }
        }).catch(e=>console.error(e));
    // });
}


export async function addTVTracks(playlist, tracks){
    var successes = true;
    const addedTracks = [];
    // map.forEach(async (value, key)=> {
    const playlistId = playlist[0].playlistID;
    for(var trackObject of tracks){
        console.log(trackObject);
        const track = trackObject.newTrack;
        var newTrack = track.tracks.items[0];
        if(newTrack.artists[0].name !== "Taylor Swift"){
            newTrack = track.tracks.items[1];
        }
        var headers = new Headers();
        headers.append("Authorization", "Bearer " + token);
        var body = "{\"uris\": [\"" + newTrack.uri + "\"], \"position\": " + trackObject.oldTrack.position + "}";
        console.log(body);
        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: body
        };
        const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, requestOptions)
        if(result.status === 200 || result.status === 201){
            console.log("TRACKS HAVE BEEN ADDED", result);
            addedTracks.push(trackObject);
        }
        else {
            successes = false;
            console.log("error in adding tracks");
            console.log(result);
        }
    }
    // });
    console.log(addedTracks);
    removeTracks(playlist, addedTracks);
}