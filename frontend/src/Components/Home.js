import Login from './Login';
import Dashboard from './Dashboard';
import Modes from './Modes';

const Home = (props) => {
    return(
        <>
                {/* {props.reload === true || window.location.href === 'https://victoriaprisco.github.io/swiftify/' ?  */}

        
        {props.reload === true || window.location.href === 'https://victoriaprisco.github.io/swiftify/' ?
            <Login /> :
            <Dashboard />
        }   
        </>
    );
}
export default Home;