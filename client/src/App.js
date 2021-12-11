import React from 'react';
import NavBar from './components/Navbar';
import "./App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/screens/Home'
import Signin from './components/screens/SignIn'
import Containers from './components/screens/Containers'
import Signup from './components/screens/Signup'

function App() {
  return (
    <BrowserRouter>


      <NavBar></NavBar>
      <Routes>
        <Route exact path="/" element={<Home></Home>}>

        </Route>

        <Route path="/signin" element={<Signin></Signin>}>



        </Route>

        <Route path="/signup" element={<Signup></Signup>}>



        </Route>

        <Route path="/containers" element={<Containers></Containers>}>



        </Route>

      </Routes>

    </BrowserRouter >



  );
}

export default App;
