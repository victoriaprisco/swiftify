import {useState} from 'react';
import Song from './Song.js';
import {getReturnVal, tracksJSON, formatJSON, setContents} from '../scripts/handleAPIRequests.js';

const Playlist = (props) => {
    
    const [show, setShow] = useState(false);
    // const getSongList = () => {
    //     var songs = [];
    //     // console.log(returnVal);
    //     if(tracks){
    //         tracks.items.forEach((value)=>{
    //             // console.log(value);
    //             songs.push(<Song songTitle = {value.track.name} />);
    //         });
    //     }
    //     return songs;
    // }
    // const songList = getSongList();
    // const tracksJSON = formatJSON(returnVal);
    // getSwiftTracks(tracksJSON);

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