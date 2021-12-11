import React from 'react'

const NavBar = () => {
    return (
        <nav>
            <div className="nav-wrapper grey">
                <a href="/" className="brand-logo left">Container Monitoring</a>
                <ul id="nav-mobile" className="right">
                    <li><a href="/signin">Login</a></li>
                    <li><a href="/signup">Signup</a></li>
                    <li><a href="/containers">Containers</a></li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;