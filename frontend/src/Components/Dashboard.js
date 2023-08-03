import {getToken} from '../scripts/authorization.js';

async function getProfile (token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    return await result.json();
}
const params = new URLSearchParams(window.location.search);
const profile = await (async ()=>{
    const token = await getToken(params.get("code"));
    const profile = await getProfile(token.access_token);
    return profile;
})();


const Dashboard = () => {
    
    // .then((token)=>{
    //     if(!token.error){
    //         return token;
    //     }
    // });
    // console.log("token:", token);
    // getProfile(token.access_token).then((result)=>{
    //     console.log(result);
    //     profile = result;
    // })
    console.log(profile);
    return(
    <>
        {profile ?<h1>{profile.display_name}</h1> :  <h1>no work</h1>}
    </>
    );
}

export default Dashboard;