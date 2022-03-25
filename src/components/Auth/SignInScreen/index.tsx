import React from 'react';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import FormsSignIn from '../FormsSignIn';
import imgHero from '../image/Hero-image.png';
import theme from '../../../common/theme';

const useStyles = makeStyles({
  imgHero: {
    width: '100%',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
});

const SignInScreen: React.FC = () => {
  const classes = useStyles(theme);
  return (
    <Grid container direction="row">
      <Grid item sm={12} md={6}>
        <img src={imgHero} alt="Hero" className={classes.imgHero} />
      </Grid>
      <Grid item sm={12} md={6}>
        <FormsSignIn />
      </Grid>
    </Grid>
  );
};

export default SignInScreen;
