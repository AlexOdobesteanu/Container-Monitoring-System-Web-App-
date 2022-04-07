import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css'

const SignUp = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const PostData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid email", classes: "rounded red darken-3" })
            return
        }
        fetch("/signup", {
            method: "post",
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        }).then(res => res.json()).then(data => {
            if (data.error) {
                M.toast({ html: data.error, classes: 'rounded red darken-3' })
            }
            else {
                M.toast({ html: data.message, classes: 'rounded green' })
                navigate('/signin')
            }
        }).catch(err => {
            console.log(err)
        })
    }


    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className='brand-logo' style={{ color: 'whitesmoke' }}>Container Monitoring</h2>

                <input type="text" placeholder="name" value={name}
                    onChange={(e) => setName(e.target.value)}>

                </input>


                <input type="text" placeholder="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}>

                </input>

                <input type="password" placeholder="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}>

                </input>

                <button class="btn waves-effect waves-light green" onClick={() => PostData()}>
                    Sign UP
                </button>
                <h5>
                    <Link to="/signin" style={{ color: "whitesmoke" }}> Already have an account ?</Link>
                </h5>

            </div>
        </div >
    )

}

export default SignUp