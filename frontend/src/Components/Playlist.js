import {useState} from 'react';
import Song from './Song.js';
import {returnVal, fulfillPromise, formatJSON} from '../scripts/handleAPIRequests.js';
import { getSwiftTracks } from '../scripts/getSwiftTracks.js';

const Playlist = (props) => {
    
    // getSwiftTracks();

    const [show, setShow] = useState(false);
    const getSongList = () => {
        var songs = [];
        // console.log(returnVal);
        if(returnVal){
            returnVal.items.forEach((value)=>{
                // console.log(value);
                songs.push(<Song songTitle = {value.track.name} />);
            });
        }
        return songs;
    }
    fulfillPromise(props.object.tracks.href);
    const songList  = getSongList();
    const tracksJSON = formatJSON();
    getSwiftTracks(tracksJSON);

    return (
        <>
            <li onClick={() =>{
                setShow(!show);
                }}>{props.object.name}</li>
            <p>{show === true && returnVal && songList}</p>
        </>
    )
}
export default Playlist;