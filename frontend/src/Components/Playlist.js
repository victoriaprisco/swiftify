import {useState} from 'react';
import Song from './Song.js';
import {getReturnVal, tracksJSON, formatJSON, setContents} from '../scripts/handleAPIRequests.js';

const Playlist = (props) => {
    
    const [show, setShow] = useState(false);

    return (
        <>
            <li onClick={() =>{
                setShow(!show);
                }}>{props.object.name}</li>
            {/* <p>{show === true && tracks && songList}</p> */}
        </>
    )
}
export default Playlist;