import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Main from './Main';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}
