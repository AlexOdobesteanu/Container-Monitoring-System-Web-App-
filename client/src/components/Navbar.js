import React, {useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {UserContext} from '../App'

const NavBar = () => {
    const {state, dispatch} = useContext(UserContext)
    const navigate = useNavigate()

    const renderList = () => {
        if (state) {
            console.log(state)
            // alert("AAAAAA")
            return [
                <li><Link to="/addcontainer">Add Container</Link></li>,
                <li><Link to="/containers">All Containers</Link></li>,
                <li>
                    <button class="btn waves-effect waves-light #c62828 red darken-3"
                            onClick={() => {
                                localStorage.clear()
                                dispatch({type: "CLEAR"})
                                navigate('/signin')
                            }}>
                        Logout
                    </button>
                </li>

            ]

        } else {
            console.log(state)
            return [
                <li><Link to="/signin">Login</Link></li>,
                <li><Link to="/signup">Signup</Link></li>
            ]

        }
    }
    return (
        <nav>
            <div className="nav-wrapper grey">
                <Link to="/" className="brand-logo left">Container Monitoring</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;