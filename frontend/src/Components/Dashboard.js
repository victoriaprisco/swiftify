import {getToken} from '../scripts/authorization.js';


const Dashboard = () => {
    const params = new URLSearchParams(window.location.search);
    getToken(params.get("code")).then((token)=>{
        if(!token.error){
            console.log("token:", token.access_token);
        }
    });
    
    return(
        <>
            <h1>nice work you logged in</h1>
        </>
    );
}

export default Dashboard;