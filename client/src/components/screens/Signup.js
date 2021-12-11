import React from 'react'
import { Link } from 'react-router-dom';

const SignIn = () => {
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className='brand-logo'>Container Monitoring</h2>
                <input type="text" placeholder="name"></input>
                <input type="text" placeholder="email"></input>
                <input type="text" placeholder="password"></input>
                <button class="btn waves-effect waves-light green">
                    Sign UP
                </button>
                <h5>
                    <Link color='black' to="/signin">Already have an account ?</Link>
                </h5>

            </div>
        </div >
    )

}

export default SignIn