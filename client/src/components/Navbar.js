import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import logo from '../logos/mylogo.png'

import "../App.css"

const NavBar = () => {
    const { state, dispatch } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        dispatch({ type: "USER", payload: localStorage.getItem("user") })
    })


    const renderList = () => {
        if (state) {

            return [
                <li className='nav-elem'><Link to="/addcontainer" id="white-text">Add Container</Link></li>,
                <li className='nav-elem'><Link to="/containers" id="white-text">All Containers</Link></li>,
                <li className='nav-elem'><Link to="/dockersupport" id="white-text">Docker Support</Link></li>,
                <li className='nav-elem'>
                    <Link to="/allclusters" id="white-text">
                        <i className="material-icons white-text " style={{ fontSize: '25px', cursor: 'pointer' }}>
                            featured_play_list
                        </i>
                    </Link>
                </li >,
                <li>
                    {/* <button class="btn waves-effect waves-light #c62828 red darken-3"
                            onClick={() => {
                                localStorage.clear()
                                dispatch({ type: "CLEAR" })
                                navigate('/signin')
                            }}>
                            Logout
                        </button> */}
                    <i className="material-icons white-text " style={{ fontSize: '35px', cursor: 'pointer' }} onClick={() => {
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                        navigate('/signin')
                    }} >exit_to_app</i>
                </li>
            ]



        } else {
            console.log(state)
            console.log("aaa")
            console.log(dispatch)
            return [
                <li className='nav-elem'><Link to="/signin" id="white-text">Login</Link></li>,
                <li className='nav-elem'><Link to="/signup" id="white-text">Signup</Link></li>
            ]

        }
    }
    return (
        <nav>
            <div className="nav-wrapper">
                <Link to="/" className="brand-logo left" id="white-text"><img src={logo} className='main-logo'></img></Link>

                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;