import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Divider from '@mui/material/Divider';
import { Navigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import Menu from '@mui/material/Menu';
import FmdBadIcon from '@mui/icons-material/FmdBad'
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { Button } from 'react-materialize';
import M from 'materialize-css'
import useLongPress from './useLongPress';
import ConfirmDialog from './screens/ConfirmDialog'


const NotificationMenu = ({ anchorEl, handleClose, open, menuItems }) => {
    const [menu, setMenu] = useState(menuItems)
    const navigate = useNavigate()
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subtitle: '' })

    useEffect(() => {
        setMenu(menuItems)
    })




    const ViewCluster = (idCluster) => {
        fetch("/GetClusterDetailsById", {
            method: "post",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    idCluster: idCluster
                }
            )
        }).then(res => res.json())
            .then(result => {
                console.log(result.mycluster[0])
                navigate('/clusterinfo', {
                    state: {
                        idCluster: idCluster,
                        domainName: result.mycluster[0].domainName,
                        nickname: result.mycluster[0].nickname
                    }
                })
            })

    }


    const handleDelete = (id) => {

        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        setMenu(menu.filter(item => item._id != id))


        fetch("/AlertsNotificationsDelete", {
            method: "delete",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    id: id
                }
            )
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                M.toast({ html: "Successfully deleted", classes: 'rounded green' })
            })
    }

    const handleDeleteAll = () => {
        fetch("/AlertsNotificationsDeleteAll", {
            method: "delete",
            headers:
            {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
        }).then(res => res.json())
            .then(result => {
                if (result.succes) {
                    M.toast({ html: "Successfully deleted All", classes: 'rounded green' })
                    handleClose()
                }
                else {
                    M.toast({ html: "Error deleting", classes: 'rounded red darken-3' })
                }
            })


    }

    const onLongPress = useLongPress()





    return (
        <>

            <div>


                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}>
                    <div style={{ display: 'flex' }}>
                        <Button style={{ backgroundColor: '#d32d2f', margin: '0 auto', display: 'block' }} onClick={handleDeleteAll}>Delete All</Button>
                        <Button style={{ backgroundColor: 'rgb(76, 175, 80)', margin: '0 auto', display: 'block' }}><Link to="/alerts" style={{ color: 'white' }}>View full details</Link></Button>
                    </div>
                    <br></br>
                    <Divider></Divider>
                    <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog}></ConfirmDialog>

                    <MenuList>

                        {
                            menuItems != null ? <div>{menuItems.map((item) => (
                                <div>
                                    <MenuItem onDoubleClick={() => ViewCluster(item.idCluster)} {...onLongPress(() => setConfirmDialog({
                                        isOpen: true,
                                        title: 'Are you sure you want to delete this notification ?',
                                        subtitle: "You can't undo this operation",
                                        onConfirm: () => { handleDelete(item._id) }
                                    }))}>

                                        <ListItemIcon>
                                            <FmdBadIcon fontSize='large' style={{ color: '#d32d2f' }}></FmdBadIcon>
                                        </ListItemIcon>
                                        <Typography style={{ whiteSpace: 'pre-line' }}>
                                            <b style={{ color: '#d32d2f' }}>{item.TypeOfNotification}</b>
                                            <br></br>
                                            {/* <b style={{ color: '#d32d2f' }} >Cluster ID: </b><b>{item.idCluster}</b>
                                            <br></br> */}
                                            <b style={{ color: '#d32d2f' }} >Cluster Name: </b><b>{item.ClusterName}</b>
                                            <br></br>
                                            {/* <b style={{ color: '#d32d2f' }} >Container ID: </b><b>{item.idContainer}</b>
                                            <br></br> */}
                                            <b style={{ color: '#d32d2f' }} >Container Name: </b><b>{item.ContainerName}</b>
                                            <br></br>
                                            <b style={{ color: '#d32d2f' }} >Date: </b><b>{new Date(item.DateOfNotification).toUTCString([], { hour: '2-digit', minute: '2-digit' })}</b>
                                            <br></br>
                                            <br></br>
                                            <b style={{ color: 'red' }}>Double-Click to see Cluster / Long-Click to delete Notification</b>
                                        </Typography>
                                        {/* <Button style={{ fontSize: '25px', cursor: 'pointer', position: "absolute", top: '0', right: 0, backgroundColor: 'white', color: 'black' }} onClick={() => handleDelete(item._id)}>
                                            <DeleteIcon ></DeleteIcon>
                                        </Button> */}



                                    </MenuItem>
                                    <Divider />
                                </div>
                            ))}</div> : <div></div>

                        }
                        {/* <MenuItem>
                        <ListItemIcon>
                            <ContentCut fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Cut</ListItemText>

                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <ListItemIcon>
                            <ContentCopy fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Copy</ListItemText>

                    </MenuItem>
                    <Divider />
                    <MenuItem>
                        <ListItemIcon>
                            <ContentPaste fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Paste</ListItemText>

                    </MenuItem> */}

                    </MenuList>
                </Menu>

            </div >
        </>
    )
}

export default NotificationMenu
