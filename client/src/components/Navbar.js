import React, { useContext, useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import logo from '../logos/mylogo.png'
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { Tooltip } from '@mui/material';
import { IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Home from '../logos/home-solid.svg';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import NotificationMenu from './NotificationMenu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ConfirmDialog from './screens/ConfirmDialog'

import "../App.css"


function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const NavBar = () => {
    const [badgeContent, setBadgeContent] = useState(0)
    const [isRunning, setIsRunning] = useState(true);
    const [delay, setDelay] = useState(2000);
    const [myNotifications, setMyNotifications] = useState(null)

    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subtitle: '' })

    const newNotifications = `You have ${badgeContent} notifications !`
    const noNotifications = "No new notifications "

    const { state, dispatch } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        dispatch({ type: "USER", payload: localStorage.getItem("user") })
    })

    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const logout = () => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        localStorage.clear()
        dispatch({ type: "CLEAR" })
        navigate('/signin')
    }

    useInterval(() => {
        if (localStorage.getItem("jwt") != null) {
            fetch("/AlertsNotifications", {
                method: "post",
                headers:
                {
                    "Authorization": "Bearer " + localStorage.getItem("jwt"),
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
                .then(result => {
                    setBadgeContent(result.myalertnotifications.length)
                    setMyNotifications(result.myalertnotifications)
                    // console.log(result.myalertnotifications)
                })

        }

    }, isRunning ? delay : null);







    const renderList = () => {
        if (state) {

            return [
                // <li className='nav-elem'><Link to="/addcontainer" id="white-text">Add Container</Link></li>,
                // <li className='nav-elem'><Link to="/containers" id="white-text">All Containers</Link></li>,
                // <li className='nav-elem'><Link to="/dockersupport" id="white-text">Docker Support</Link></li>,
                <li className='nav-elem'>
                    <Tooltip title={<Typography fontSize={15}>Your Account</Typography>}>
                        <div style={{ marginTop: '10px' }}>

                            <Link to="/myaccount" id="white-text">


                                <AccountCircleIcon style={{ fontSize: '35px', color: 'white' }} />


                            </Link>

                        </div>
                    </Tooltip>
                </li >,
                <li className='nav-elem' style={{ marginRight: '50px' }}>
                    {/* <Link to="/alerts" id="white-text"> */}
                    <div style={{ width: '60px', textAlign: 'center' }}>
                        <Tooltip title={<Typography fontSize={15}>{badgeContent ? newNotifications : noNotifications}</Typography>} >
                            <IconButton onClick={badgeContent ? handleOpen : null}>
                                <Badge badgeContent={badgeContent} color="error" style={{ fontSize: '20px' }} >
                                    <NotificationImportantIcon style={{ fontSize: '30px', color: 'white' }} anchorEl={anchorEl} />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        {/* </Link> */}
                    </div>
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
                    <>
                        <Tooltip title={<Typography fontSize={15}>Log Out</Typography>} >
                            <i className="material-icons white-text " style={{ fontSize: '35px', cursor: 'pointer' }} onClick={() => {
                                // handleDelete(item._id)
                                setConfirmDialog({
                                    isOpen: true,
                                    title: 'Are you sure you want to log out ?',
                                    subtitle: "You'll be redirected to the Login Page.",
                                    onConfirm: () => { logout() }
                                })
                            }} >exit_to_app
                            </i>
                        </Tooltip>
                    </>
                </li >
            ]



        } else {
            console.log(dispatch)
            return [


                <li className='nav-elem'><Link to="/" id="white-text"><img src={Home} className="imgInverted" style={{ width: '30px', height: '30px', marginTop: '18px' }}></img></Link></li>,
                <li className='nav-elem'><Link to="/signin" id="white-text">Login</Link></li>,
                <li className='nav-elem'><Link to="/signup" id="white-text">Signup</Link></li>
            ]

        }
    }
    return (
        <nav>
            <div className="nav-wrapper">
                {/* <Link to="/" className="brand-logo left" id="white-text"><img src={logo} className='main-logo'></img></Link> */}
                {/* <Link to="/" className="brand-logo left" style={{ marginLeft: '105px' }}>Container Monitoring</Link> */}
                <Link to="/" className="brand-logo left" style={{ marginLeft: '10px' }}>Container Monitoring</Link>

                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
                <NotificationMenu open={open} anchorEl={anchorEl} handleClose={handleClose} menuItems={myNotifications}>

                </NotificationMenu>

                <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog}></ConfirmDialog>

            </div>
        </nav>
    )
}

export default NavBar;