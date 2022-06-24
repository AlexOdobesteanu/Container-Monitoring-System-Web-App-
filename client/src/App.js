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
import ClusterInfo from './components/screens/ClusterInfo';
import ContainerData from './components/screens/ContainerData';
import Notification from './components/screens/Notification';
import EditInstance from './components/screens/EditInstance';
import Nodes from './components/screens/Nodes';
import AlertHistory from './components/screens/AlertHistory';
import MyAccount from './components/screens/MyAccount';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import Sidebar from './components/Sidebar';
import GeneralData from './components/screens/GeneralData'

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

            <Route path="/myaccount" element={<MyAccount></MyAccount>}>


            </Route>

            <Route path="/containers" element={<Containers></Containers>}>


            </Route>

            <Route path="/addcontainer" element={<AddContainer></AddContainer>}>


            </Route>

            <Route path="/containersinfo" element={<ContainersInfo></ContainersInfo>}>

            </Route>

            <Route path="/alertHistory" element={<AlertHistory></AlertHistory>}>

            </Route>

            <Route path="/allclusters" element={<AllClusters></AllClusters>}>


            </Route>

            <Route path="/nodes" element={<Nodes></Nodes>}>


            </Route>

            <Route path="/generaldata" element={<GeneralData></GeneralData>}>


            </Route>

            <Route path="/clusterinfo" element={<ClusterInfo></ClusterInfo>}>

            </Route>

            <Route path="/containerdata" element={<ContainerData></ContainerData>}>

            </Route>

            <Route path="/alerts" element={<Notification></Notification>}>

            </Route>

            <Route path="/EditInstance" element={<EditInstance></EditInstance>}>

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
                    <Sidebar>
                    </Sidebar>

                    <Routing></Routing>


                </BrowserRouter>
            </UserContext.Provider>
        </div >


    );
}

export default App;
