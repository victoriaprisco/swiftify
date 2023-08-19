import {getToken} from '../scripts/authorization.js';
const params = new URLSearchParams(window.location.search);
var token = "";

export async function getProfile () {
    token = await getToken(params.get("code"));
    if(token){
        token = token.access_token;
        try {
            const result = await fetch("https://api.spotify.com/v1/me", {
                method: "GET", headers: { Authorization: `Bearer ${token}` }
            });
            return await result.json();
        }
        catch (e) {
            console.log("From getProfile =>", e);
        }
    }
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
            alert("something went wrong. please try again in a little bit!");
            console.error("From getPlaylists =>", e);
            return null;
        }
    }
    return results;
}


export  async function getTracks (contents) {
    var results = [];
    var next = contents;
    var offset = 0;
    const limit = 100;
    var total = 101;
    // FIXME commented for 429 error 
    while(offset + limit < total){
        try {
            const result = await fetch(next, {
                method: "GET", headers: { Authorization: `Bearer ${token}`}
            });
            var json = await result.json();
            // console.log("!!!", json);
            results.push(json.items);
            offset = json.offset == null ? 0 : json.offset;
            total = json.total;
            next = json.next == null ? "" : json.next;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
    return results;
}

export function formatJSON(length, owner, playlistID, tracks){
    var returnJSON = [];
    var i = 0;
    if(tracks){
        // console.log(tracks);
        tracks.forEach((list)=>{
            list.forEach((value)=>{
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
        });
        return returnJSON;
    }
    return null;
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
        if(i < 100){
            var uri = id.oldTrack.uri.replace(/'/g, '"');
            idsToRemove[i] = "{\"uri\":\"" + uri + "\"}";
            i++;
        }
    }); 
    return idsToRemove;
}
function removeTracks(track, attemptNo){
    // map.forEach((value, key)=> {
        if(attemptNo > 1){
            return false;
        }
        const playlistID = track.playlistID;
        const idsToRemove = "{\"uri\":\"" + track.uri + "\"}";
        var headers = new Headers();
        headers.append("Authorization", "Bearer " + token);
        var body = "{\"tracks\": [" + idsToRemove + "]}";
        var requestOptions = {
        method: 'DELETE',
        headers: headers,
        body: body
        };
        fetch("https://api.spotify.com/v1/playlists/" + playlistID + "/tracks", requestOptions)
        .then(result => {
            if(result.status !== 200){
                console.log("error");
                removeTracks(track, attemptNo+1);
            }
            else{
                console.log("TRACKS HAVE BEEN DELETED", result);
            }
        })
        // .catch(error => {
        //     console.log('error', error);
        //     alert("something went wrong. please refresh and try again!");
        // });
    // });
    return true;
}


export function addTVTracks(map, attemptNo){
    if(attemptNo > 1){
        return false;
    }
    map.forEach((value, key)=> {
        const playlistId = key;
        console.log("value", value);
        for(var trackObject of value){
            const track = trackObject.newTrack;
            console.log("track object", trackObject);
            var headers = new Headers();
            headers.append("Authorization", "Bearer " + token);
            var body = "{\"uris\": [\"" + track.uri + "\"], \"position\": " + trackObject.oldTrack.position + "}";
            var requestOptions = {
            method: 'POST',
            headers: headers,
            body: body
            };
            fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, requestOptions)
            .then(result => {
                if(result.status !== 200){
                    console.log("there was an error");
                    addTVTracks(map, attemptNo+1);
                }
                else {
                    console.log("TRACKS HAVE BEEN ADDED", result);
                    removeTracks(trackObject.oldTrack, 0);
                }
            }) 
        }
    });
}