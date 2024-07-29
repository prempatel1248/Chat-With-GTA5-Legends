import React from "react"
import Michael from "./Michael"
import Franklin from "./Franklin"
import Trevor from "./Trevor"
import { useNavigate } from 'react-router-dom';


export default function Main(){
    const navigate = useNavigate();
    const [character, setCharacter] = React.useState("");

    function changeCharacter(characterName){
        setCharacter(characterName);    
    }

    function logout(){
        navigate('/');
    }


    return <div className="main">
        <div className="sidebar">
            <h1 className="sidebarHeading">Legends</h1>
            <div className="legends">
                <button className="sideMichael" onClick={() => changeCharacter("michael")}></button>
                <button className="sideFranklin" onClick={() => changeCharacter("franklin")}></button>
                <button className="sideTrevor" onClick={() => changeCharacter("trevor")}></button>
            </div>
            <button onClick={logout}>Logout</button>
        </div>
        {character === "michael" && <Michael />}
        {character === "franklin" && <Franklin />}
        {character === "trevor" && <Trevor />}
    </div>
}