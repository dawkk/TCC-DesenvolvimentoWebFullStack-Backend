import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Authentication/Login';
import Menus from './pages/Menus';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/menus' element={<Menus/>}/>
      <Route path='/login' element={<Login/>}/>


    </Routes>
  );
}

export default App;
