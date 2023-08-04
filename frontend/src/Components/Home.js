import Login from './Login';
import Dashboard from './Dashboard';


const Home = (props) => {
    // console.log(window.location.href);
    
    return(
        <>
        {props.reload === true || window.location.href === 'http://localhost:3000/' ?
            <Login /> :
            <Dashboard />   
        }   
        </>
    );
}
export default Home;