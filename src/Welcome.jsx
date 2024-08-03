import React from "react";
import { useNavigate } from 'react-router-dom';
import './welcomeHome.css'
import { useLocation } from 'react-router-dom';
import gtaTrailer from './video/gtaTrailer.mp4';


export default function Welcome(){
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    React.useEffect(() => {
        if (!email) {
          navigate('/');
        }
      }, [email, navigate]);

    function startChat(character){
        navigate('/home', { state: { email, char: character } })
    }

    return <div className="welcomePage">
        <video autoPlay loop muted className='GTA5Trailer'>
            <source src={gtaTrailer} type='video/mp4' />
        </video>
        <div className="welcomePara"><p className="p1">Welcome to <span className="red">Los Santos</span>! The most notorious trio, <span className="red">Michael</span>, <span className="red">Franklin</span> and <span className="red">Trevor</span> are ready to</p><p className="p2">chat and bring the streets of Los Santos to life. Dive into their world and explore the city</p><p className="p3">through their eyes. Let's <span className="red">get started</span> on this epic adventure! Who will you talk to first?</p></div>
        <div className="startWithCharacter">
            <button className="startWithMichael" onClick={() => startChat("Michael")}></button>
            <button className="startWithFranklin" onClick={() => startChat("Franklin")}></button>
            <button className="startWithTrevor" onClick={() => startChat("Trevor")}></button>
        </div>
    </div>
}