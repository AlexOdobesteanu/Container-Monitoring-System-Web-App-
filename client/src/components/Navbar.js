import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
    return (
        <nav>
            <div className="nav-wrapper grey">
                <Link to="/" className="brand-logo left">Container Monitoring</Link>
                <ul id="nav-mobile" className="right">
                    <li><Link to="/signin">Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                    <li><Link to="/addcontainer">Add Container</Link></li>
                    <li><Link to="/containers">All Containers</Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;