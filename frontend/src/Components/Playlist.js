import {useState} from 'react';
async function getTracks (contents, token) {
    const result = await fetch(contents, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}

async function fulfillPromise(contents, token){
    try {
        var tracks = await getTracks(contents, token);
        createReturn(tracks);
    }
    catch (e) {
        console.error(e);
    }
}
var returnVal;
const createReturn = (result) => {
    console.log(returnVal);
    returnVal = (result);
}
const Playlist = (props) => {
    fulfillPromise(props.object.tracks.href, props.token.access_token);
    const [show, setShow] = useState(false);

    return (
        <>
            <li>{props.object.name}</li>
            <p onClick={() =>{setShow(true)}}>{show === true && console.log("!!!", returnVal)}</p>
        </>
    )
}
export default Playlist;