import React, { useState, useContext } from 'react'
import { UserContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css'
import "../../App.css"

const SignIn = () => {
    const { state, dispatch } = useContext(UserContext)
    const navigate = useNavigate()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const PostData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid email", classes: "rounded red darken-3" })
            return
        }
        fetch("/signin", {
            method: "post",
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: 'rounded red darken-3' })
                }
                else {
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: "Signed in successfully", classes: 'rounded green' })
                    navigate('/')
                }
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className='brand-logo' style={{ color: 'whitesmoke' }}>Container Monitoring</h2>

                <input type="text" placeholder="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}>

                </input>

                <input type="password" placeholder="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}>

                </input>

                <button class="btn waves-effect waves-light green" onClick={() => PostData()}>
                    Login
                </button>
                <h5>
                    <Link style={{ color: "whitesmoke" }} to="/signup">Don't have an account yet ?</Link>
                </h5>

            </div>
        </div>
    )

}

export default SignIn