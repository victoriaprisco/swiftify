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

export function formatJSON(tracks){
    var returnJSON = [];
    tracks.items.forEach((value)=>{
        returnJSON.push({
                "name": value.track.name,
                "artist": value.track.artists[0].name,
                "album":  value.track.album.name
            });
    });
    return returnJSON;
}