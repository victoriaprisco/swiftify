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
async function getPlaylists(token){
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
export const playlists = await (async ()=>{
    const playlists = await getPlaylists(token);
    return playlists;
})();


export  async function getTracks (contents) {
    const result = await fetch(contents, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

export function formatJSON(owner, playlistID, tracks){
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
                "owner": owner.id
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
    // console.log(ids);
    var i = 0;
    var idsToRemove = Array();
    ids.forEach((id)=>{
        // console.log("URI", id.oldTrack.uri.replace(/'/g, '"'));
        var uri = id.oldTrack.uri.replace(/'/g, '"');
        idsToRemove[i] = {"uri": uri}
        i++;
    }); 
    // console.log(idsToRemove);
    return idsToRemove;
}
export async function removeTracks(map){
    // buildBody(ids);
    map.forEach((value, key)=>{
        const playlistID = key;
        const idsToRemove = createBody(value);
        // console.log("FROM PLAYLIST", playlistID, "IDS", idsToRemove, "TOKEN", token, "SNAPSHOT", snapshot);
        const test = {
            body: {
            "tracks": idsToRemove
            }
        };
        console.log("TOKEN", token, "PLAYLIST", playlistID, "BODY", JSON.stringify(test));
        console.log(JSON.stringify
            (test));
        fetch("https://api.spotify.com/v1/playlists/"+ playlistID + "/tracks", {
            body: {
                "tracks": idsToRemove
                },
            headers: {
                Authorization: "Bearer "+token
            },
            method: "DELETE"          
        }).catch((e)=>{console.error(e)});
    });
}