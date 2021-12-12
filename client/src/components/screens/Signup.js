import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const SignIn = () => {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const PostData = () => {
        fetch("http://localhost:3000/signup", {
            method: "post",
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: "",
                email: "",
                password: ""
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
            })
    }


    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className='brand-logo'>Container Monitoring</h2>

                <input type="text" placeholder="name" value={name}
                    onChange={(e) => setName(e.target.value)}>

                </input>


                <input type="text" placeholder="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}>

                </input>

                <input type="text" placeholder="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}>

                </input>

                <button class="btn waves-effect waves-light green" onClick={() => PostData()}>
                    Sign UP
                </button>
                <h5>
                    <Link to="/signin">Already have an account ?</Link>
                </h5>

            </div>
        </div >
    )

}

export default SignIn