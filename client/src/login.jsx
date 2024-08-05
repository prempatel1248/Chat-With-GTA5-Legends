import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './login.css'

export default function Signup() {
    const navigate = useNavigate();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [err, setErr] = React.useState('');
    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('https://chat-with-gta5-legends.onrender.com/login', { email, password })
            .then(response => {
                console.log(response.data);
                navigate('/welcome', { state: { email } });
            })
            .catch(error => {
                const errorMsg = error.response.data.message || "Login failed";
                setErr(errorMsg);
                console.error('Login failed:', error);
            });
    }

    return (
        <div className="loginBody">
            <div className="login">
                <h1>Login</h1>
                <form className="loginForm" onSubmit={handleSubmit}>
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
                    <button className="loginbtn" type="submit">Login</button>
                </form>
                <p>Don't have account?</p>
                <Link className="link" to="./signup">Sign up</Link>
                {err && <div className="error">{err}</div>}
            </div>
        </div>
    );
}
