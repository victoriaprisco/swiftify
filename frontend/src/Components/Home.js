import {Component} from 'react';
import {completeAuth} from '../scripts/authorization.js';

class Home extends Component {
    async componentDidMount() {
        try {
            // await the API call for spotify authorization link
            // const spotifyResponse = await axios.post(endpoint, { headers });
            // console.log(spotifyResponse);
            // const spotifyURI = spotifyResponse.data.data;
            const something = completeAuth();
            console.log("uri from spotify:", something);
            // let cleanedURI = '';
            // for (let i = 0; i < spotifyURI.length; i++) {
            //     if (spotifyURI.charAt(i) == '+') {
            //         i += 3;
            //         cleanedURI += "%20%20%20%20%20%20";
            //     }
            //     else {
            //         cleanedURI += spotifyURI.charAt(i);
            //     }
            // }
            // console.log("after cleaning", cleanedURI);
            // set the uri state to the ready to use URL for later use
            // this.setState({
            //     uri: cleanedURI
            // });
        }
        catch (e) {
            console.error(e);
        }
    }
    render(){
        return(
            <div>
                hi
            </div>
        );
    }
}
export default Home;