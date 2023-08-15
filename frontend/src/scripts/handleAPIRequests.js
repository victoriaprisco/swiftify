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
    // while(offset + limit < total){
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
    // }
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
    // console.log("map?", map);
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

function getTVIds(ids){
    console.log(ids);
    var TVs = [];
    ids.forEach((id)=>{
        TVs.push({"track": id.newTrack, "position": id.oldTrack.position, "playlist": id.oldTrack.playlistID, "length": id.oldTrack.length});
    })
    return TVs;
    // var newTracks = [];
    // var positions = [];
    // ids.forEach((id)=>{
    //     newTracks.push(id.newTrack.uri);
    //     positions.push(id.oldTrack.position);
    // });
    // return [newTracks, positions];
}

export function addTVTracks(map){
    map.forEach((value, key)=> {
        const playlistId = key;
        console.log(value);
        // const ids = buildAddRequestBody(value);
        // const TVs = getTVIds(ids);
        // console.log(TVs);
        // const TVTracks = TV[0];
        // const positions = TV[1];
        // console.log(TVTracks, positions);
        for(var trackObject of value){
            // console.log(track);
            // const uriString = buildAddRequestBody(TVs);
            // // console.log(uriString);
            // const position = Math.min(track.position, track.length);c
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