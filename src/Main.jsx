import React from "react"
import Michael from "./Michael"
import Franklin from "./Franklin"
import Trevor from "./Trevor"
import { useNavigate } from 'react-router-dom';
import './welcomeHome.css'
import { useLocation } from 'react-router-dom';

export default function Main() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    React.useEffect(() => {
        if (!email) {
          navigate('/');
        }
      }, [email, navigate]);
    const char = location.state?.char;
    const [character, setCharacter] = React.useState(char);
    const [sidebar, setSidebar] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState("dark");
    

    function changeCharacter(characterName){
        setCharacter(characterName);    
    }
    
    function logout(){
        navigate('/');
    }

    function closeSidebar(){
        setSidebar(!sidebar);
    }

    function changeMode(){
        if(darkMode=="dark"){
            setDarkMode("light");
        }
        else{
            setDarkMode("dark");
        }
    }

    return <div className={`main Selected${character}`}>
        {console.log(darkMode)}
        {sidebar && <div className={`sidebar sidebar${darkMode}`}>
            <div className="sidebarHeading">
                <h1>Legends</h1>
                <button className="closeSidebar" onClick={closeSidebar}><i className="fa-solid fa-angles-left"></i></button>
            </div>
            
            <div className="legends">
                <button className="sideMichael" onClick={() => changeCharacter("Michael")}></button>
                <button className="sideFranklin" onClick={() => changeCharacter("Franklin")}></button>
                <button className="sideTrevor" onClick={() => changeCharacter("Trevor")}></button>
            </div>
            <button className="logoutBtn" onClick={logout}>Logout</button>
        </div>}
        {!sidebar && <button className="openSidebar" onClick={closeSidebar}><i className="fa-solid fa-angles-right"></i></button>}

        {character === "Michael" && <Michael email={email} mode={darkMode} />}
        {character === "Franklin" && <Franklin email={email} mode={darkMode} />}
        {character === "Trevor" && <Trevor email={email} mode={darkMode} />}
        {darkMode==="light" && <button className="lightMode" onClick={changeMode}></button>}
        {darkMode==="dark" && <button className="darkMode" onClick={changeMode}><i className="fa-regular fa-moon"></i></button>}
    </div>
}
