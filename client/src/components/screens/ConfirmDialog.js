import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { createTheme, padding, positions } from "@mui/system";
import React from "react";
import { Button } from "react-materialize";
import { DotLoader } from "react-spinners";
import { makeStyles } from "@material-ui/core/styles";
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';

const useStyles = makeStyles((theme) => ({
    dialog:
    {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5)
    },
    dialogTitle: {
        textAlign: 'center'
    },
    dialogContent: {
        textAlign: 'center'
    },
    dialogAction:
    {
        justifyContent: 'center'
    },
    titleIcon: {
        backgroundColor: 'lightgrey',
        color: theme.palette.secondary.main,
        '&:hover': {
            backgroundColor: 'white',
            cursor: 'default'
        },
        '& .MuiSvgIcon-root':
        {
            fontSize: '8rem',
        }
    }
}))

export default function ConfirmDialog(props) {

    const classes = useStyles()
    const { confirmDialog, setConfirmDialog } = props;
    return (
        <Dialog open={confirmDialog.isOpen} classes={{ paper: classes.dialog }}>
            <DialogTitle className={classes.dialogTitle}>
                <IconButton disableFocusRipple disableTouchRipple className={classes.titleIcon}>
                    <NotListedLocationIcon></NotListedLocationIcon>
                </IconButton>

            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h6">
                    {confirmDialog.title}
                </Typography>

                <Typography variant="subtitle2">
                    {confirmDialog.subtitle}
                </Typography>

            </DialogContent>
            <DialogActions className={classes.dialogAction}>
                <Button style={{ backgroundColor: 'lightslategray' }} onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>
                    No
                </Button>

                <Button style={{ backgroundColor: 'red' }} onClick={
                    confirmDialog.onConfirm
                }>
                    Yes
                </Button>

            </DialogActions>
        </Dialog>
    )
}