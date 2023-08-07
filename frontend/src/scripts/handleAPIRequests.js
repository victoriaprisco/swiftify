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
            console.log(results);
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
    console.log(token);
    const result = await fetch(contents, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

export function formatJSON(playlistID, tracks){
    var returnJSON = [];
    var i = 0;
    tracks.items.forEach((value)=>{
        returnJSON.push({
                "name": value.track.name,
                "artist": value.track.artists[0].name,
                "album":  value.track.album.name,
                "uri": value.track.uri,
                "playlistID": playlistID,
                "position": i
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
    var idsToRemove = Array();
    ids.forEach((id)=>{
        idsToRemove.push({
            "uri": id.oldTrack.uri
        });
    });
    // console.log(idsToRemove);
    return idsToRemove;
}
export async function removeTracks(map){
    // buildBody(ids);
    map.forEach(async (value, key)=>{
        console.log(key, value);
        const playlistID = key;
        const idsToRemove = createBody(value);
        console.log(playlistID, idsToRemove.toLocaleString());
        const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks/`, {
            method: "DELETE", 
            body: {"tracks": idsToRemove} ,
            headers: { Authorization: `Bearer ${token}` }
            
        });
        result.json().then((res)=>{console.log(res)}).catch((e)=>{console.error(e)});
    });
    // mapKeys.forEach((key)=>{
    //     console.log(key);
    // })
    // // https://api.spotify.com/v1/playlists/{playlist_id}/tracks
    // const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
    //     method: "GET", 
    //     headers: { Authorization: `Bearer ${token}` },
    //     body: {
    //         "tracks": {
    //             // 'uri': oldTrack.id
    //         }
    //     }
    // });
    // return await result.json();
}