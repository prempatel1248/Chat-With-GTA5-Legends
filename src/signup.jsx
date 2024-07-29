import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './login.css'

export default function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [sentotp, setSentotp] = React.useState(false);
    const [stateOtp, setStateOtp] = React.useState('');
    const [err, setErr] = React.useState('');
    const [otp, setOtp] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(otp != stateOtp){
            setErr("Incorrect OTP");
            return;
        }
        axios.post('http://localhost:3001/signup', { email, password })
        .then(response => {
            console.log(response.data);
            // Navigate to the home page on successful signup
            navigate('/home');
        })
        .catch(error => {
            setErr("Signup failed");
            console.error('Signup failed:', error);
            // Handle signup error
        });
    }

    const handleSendOtp = (e) => {
        e.preventDefault();
        
        const tempOtp = (Math.floor(100000 + Math.random() * 900000)).toString();
        setOtp(tempOtp);
        setSentotp(true);
        axios.post('http://localhost:3001/otp', {email, otp: tempOtp})
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            setSentotp(false);
            const errorMsg = error.response.data.message || "Signup failed";
            setErr(errorMsg);
            console.log("Send otp failed: ", error);
        })

    }

    return (
        <div className="signupBody">
            {!sentotp && <div className="login">
                <h1>Sign up</h1>
                <form className="loginForm" onSubmit={handleSendOtp}>
                    <input 
                        type="text" 
                        placeholder="Email" 
                        name="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button className="loginbtn" type="submit">Send OTP</button>
                </form>
                {err && <div className="error">{err}</div>}
            </div>}
            {sentotp && <div className="login">
                <form className="loginForm" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Enter OTP" 
                        name="otp" 
                        value={stateOtp} 
                        onChange={(e) => setStateOtp(e.target.value)} 
                    />
                    <button className="loginbtn" type="submit">Sign up</button>
                </form>
                {err && <div className="error">{err}</div>}
            </div>}
            
        </div>
    );
}
