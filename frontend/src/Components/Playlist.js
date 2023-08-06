import {useState} from 'react';
import Song from './Song.js';
import {returnVal, fulfillPromise} from '../scripts/handleAPIRequests.js';

const Playlist = (props) => {
    
    const [show, setShow] = useState(false);
    const getSongList = () => {
        var songs = [];
        console.log(returnVal);
        if(returnVal){
            returnVal.items.forEach((value)=>{
                console.log(value);
                songs.push(<Song songTitle = {value.track.name} />);
            });
        }
        return songs;
    }
    return (
        <>
            <li onClick={() =>{
                setShow(!show);
                fulfillPromise(props.object.tracks.href);
                }}>{props.object.name}</li>
            <p>{show === true && returnVal && getSongList()}</p>
        </>
    )
}
export default Playlist;