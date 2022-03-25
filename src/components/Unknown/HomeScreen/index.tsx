import React, { useEffect, useState, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import fierbase from 'firebase';
import 'firebase/firestore';
import { useUser } from 'reactfire';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { makeStyles } from '@mui/styles';
import clearFirestoreCache from '../../../common/clearFirestoreCache';
import { UIContext } from '../UIContext/index';

const useStyles = makeStyles({
  alert: {
    background: '#323232',
    color: 'white',
    width: '173px',
  },
});

function SnackbarAlert() {
  const { status } = useUser();
  const classes = useStyles();

  if (status === 'success') {
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open
      >
        <Alert icon={false} severity="success" className={classes.alert}>
          Welcome on board 🚀
        </Alert>
      </Snackbar>
    );
  }
  return null;
}

function MenuAppBar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { setAlert } = useContext(UIContext);
  const [userName, setUserName] = useState('U');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    fierbase
      .auth()
      .signOut()
      .catch((error) => {
        const errorMessage = error.message;

        setAlert({
          show: true,
          severity: 'info',
          message: errorMessage,
        });
      });
    clearFirestoreCache();
  };

  const fierbaseToDo = () => {
    const auth = fierbase.auth();
    const displayName = auth.currentUser?.displayName?.split(' ');

    if (displayName) {
      setUserName(`${displayName[0][0]}${displayName[1][0]}`);
    }
  };

  useEffect(() => {
    let cleanEffect = true;
    if (cleanEffect) {
      fierbaseToDo();
    }

    return () => {
      cleanEffect = false;
    };
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mypost
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar>{userName}</Avatar>
            </IconButton>
            <Menu id="menu-appbar" anchorEl={anchorEl} open={Boolean(anchorEl)}>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const HomeScreen: React.FC = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <MenuAppBar />
        <SnackbarAlert />
      </Grid>
    </Grid>
  );
};

export default HomeScreen;
