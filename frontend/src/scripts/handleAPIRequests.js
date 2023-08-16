import {getToken} from '../scripts/authorization.js';
const params = new URLSearchParams(window.location.search);
var token = await getToken(params.get("code"));
if(token){
    token = token.access_token;
}
else {
    console.error(new Error("uh oh"));
}
async function getProfile (token) {
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
        }
    }
    return results;
}
export const profile = await (async ()=>{
    const profile = await getProfile(token);
    return profile;
})();


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
            // console.log("returning null, no tracks found");
            // alert("you don't have any tracks to swiftify!");
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
        var uri = id.oldTrack.uri.replace(/'/g, '"');
        idsToRemove[i] = "{\"uri\":\"" + uri + "\"}";
        i++;
    }); 
    return idsToRemove;
}
function removeTracks(map){
    map.forEach((value, key)=> {
        const playlistID = key;
        const idsToRemove = createBody(value);
        var headers = new Headers();
        headers.append("Authorization", "Bearer " + token);
        var body = "{\"tracks\": [" + idsToRemove + "]}";
        var requestOptions = {
        method: 'DELETE',
        headers: headers,
        body: body
        };
        fetch("https://api.spotify.com/v1/playlists/" + playlistID + "/tracks", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log("TRACKS HAVE BEEN DELETED", result);
        })
        .catch(error => {
            console.log('error', error);
            alert("something went wrong. please refresh and try again!");
        });
    });
}


export function addTVTracks(map){
    map.forEach((value, key)=> {
        const playlistId = key;
        console.log(value);
        for(var trackObject of value){
            const track = trackObject.newTrack;
            var headers = new Headers();
            headers.append("Authorization", "Bearer " + token);
            var body = "{\"uris\": [\"" + track.uri + "\"], \"position\": " + trackObject.oldTrack.position + "}";
            console.log(body);
            var requestOptions = {
            method: 'POST',
            headers: headers,
            body: body
            };
            fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, requestOptions)
            .catch(error => {
                console.err('error', error);
                alert("something went wrong. please refresh and try again!");
            })
            .then(response => response.text())
            .then(result => {
                console.log("TRACKS HAVE BEEN ADDED", result);
                removeTracks(map);

            })
        }
    });
}