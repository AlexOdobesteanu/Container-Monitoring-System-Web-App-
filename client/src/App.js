import React, { useEffect, createContext, useReducer } from 'react';
import NavBar from './components/Navbar';
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './components/screens/Home'
import Signin from './components/screens/SignIn'
import Containers from './components/screens/Containers'
import Signup from './components/screens/Signup'
import AddContainer from './components/screens/AddContainer'
import ContainersInfo from './components/screens/ContainersInfo';
import DockerSupport from './components/screens/DockerSupport';
import AllClusters from './components/screens/AllClusters';
import { reducer, initialState } from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        // if (user) {
        //     navigate('/')
        // } else {
        //     navigate('/signin')
        // }
    }, [])
    return (

        <Routes>

            <Route exact path="/" element={<Home></Home>}>

            </Route>

            <Route path="/signin" element={<Signin></Signin>}>


            </Route>

            <Route path="/signup" element={<Signup></Signup>}>


            </Route>

            <Route path="/containers" element={<Containers></Containers>}>


            </Route>

            <Route path="/addcontainer" element={<AddContainer></AddContainer>}>


            </Route>

            <Route path="/containersinfo" element={<ContainersInfo></ContainersInfo>}>

            </Route>

            <Route path="/allclusters" element={<AllClusters></AllClusters>}>


            </Route>



            <Route path="/dockersupport" element={<DockerSupport></DockerSupport>}>


            </Route>


        </Routes >

    )
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <div style={{
            background: "rgb(40,44,52)",
            minHeight: '100vh',
            overflow: 'auto'
        }}>
            <UserContext.Provider value={{ state, dispatch }}>
                <BrowserRouter>


                    <NavBar></NavBar>
                    <Routing></Routing>


                </BrowserRouter>
            </UserContext.Provider>
        </div >


    );
}

export default App;
