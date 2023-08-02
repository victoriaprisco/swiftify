import Login from './Login';
import Dashboard from './Dashboard';


const Home = () => {
    // console.log(window.location.href);
    return(
        <>
        {window.location.href === "http://localhost:3000/" ?
            <Login /> :
            <Dashboard />   
        }   
        </>
    );
}
export default Home;