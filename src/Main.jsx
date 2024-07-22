import React from "react"
import Michael from "./Michael"
import Franklin from "./Franklin"
import Trevor from "./Trevor"


export default function Main(){

    const [character, setCharacter] = React.useState("");

    function changeCharacter(characterName){
        setCharacter(characterName);    
    }


    return <div className="main">
        <div className="sidebar">
            <h1>Legends</h1>
            <div className="legends">
                <button className="sideMichael" onClick={() => changeCharacter("michael")}></button>
                <button className="sideFranklin" onClick={() => changeCharacter("franklin")}></button>
                <button className="sideTrevor" onClick={() => changeCharacter("trevor")}></button>
            </div>
        </div>
        {character === "michael" && <Michael />}
        {character === "franklin" && <Franklin />}
        {character === "trevor" && <Trevor />}
    </div>
}