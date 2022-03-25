import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import IconButton from '@mui/material/IconButton';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import fierbase from 'firebase';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import VeacotIcon from '../image/Vector.png';
import { UIContext } from '../../Unknown/UIContext/index';

const useStyles = makeStyles({
  vectorIcon: {
    height: '28px',
    width: '149px',
    background: `url(${VeacotIcon})`,
  },
  pRegister: {
    fontWeight: 'bold',
    fontSize: '40px',
    letterSpacing: '-1.5px',
    margin: 0,
    color: '#000000',
  },
  PDontHaveAnAccount: {
    fontWeight: 600,
    fontSize: '14px',
    letterSpacing: '-1.5px',
    color: '#000000',
  },
  LinkRegister: {
    textDecoration: 'none',
    borderRadius: 'nullpx',
    fontWeight: 600,
    fontSize: '13px',
    lineHeight: '22px',
    letterSpacing: '0.46px',
    textTransform: 'uppercase',
    color: '#F50057',
  },
  formsinput: {
    width: '375px',
    height: '55px',
    borderRadius: '4px 4px 0px0px',
  },
  buttonRegister: {
    marginRight: 'auto',
    marginLeft: 'auto',
    paddingTop: '15px',
    paddingBottom: '10px',
    width: '375px',
    boxShadow:
      '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)',
    borderRadius: '4px',
  },
});

function VectorIconAndTextLogin() {
  const classes = useStyles();

  return (
    <Grid container direction="column" alignItems="center" spacing={8}>
      <Grid item xs={12}>
        <div className={classes.vectorIcon} />
      </Grid>
      <Grid item xs={12}>
        <p className={classes.pRegister}>Login</p>
      </Grid>
    </Grid>
  );
}

function LinkAndTextDontHaveAnAccount() {
  const classes = useStyles();

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <p className={classes.PDontHaveAnAccount}>Don’t have an account?</p>
      </Grid>
      <Grid item xs={12}>
        <Link to="/register" className={classes.LinkRegister}>
          REGISTER
        </Link>
      </Grid>
    </Grid>
  );
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(12, 'Password should be of minimum 12 characters length')
    .required('Password is required'),
});

function Forms() {
  const classes = useStyles();
  const { setAlert } = useContext(UIContext);
  const [loginButton, setLoginButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (value) => {
      setLoginButton(true);

      fierbase
        .auth()
        .signInWithEmailAndPassword(value.email, value.password)
        .catch((err) => {
          setAlert({
            show: true,
            severity: 'info',
            message: err.message,
          });
          setLoginButton(false);
        });
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack alignItems="center" justifyItems="center" spacing={6}>
        <TextField
          variant="filled"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          className={classes.formsinput}
        />
        <FormControl variant="filled" className={classes.formsinput}>
          <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
          <FilledInput
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText
            error={formik.touched.password && Boolean(formik.errors.password)}
          >
            {formik.touched.password && formik.errors.password}
          </FormHelperText>
        </FormControl>
        <Button
          variant="contained"
          type="submit"
          disabled={loginButton}
          className={classes.buttonRegister}
        >
          REGISTER
        </Button>
      </Stack>
    </form>
  );
}

const FormsSignIn: React.FC = () => {
  return (
    <Grid container spacing={8} py={8}>
      <Grid item xs={12}>
        <VectorIconAndTextLogin />
      </Grid>
      <Grid item xs={12}>
        <Forms />
      </Grid>
      <Grid item xs={12}>
        <LinkAndTextDontHaveAnAccount />
      </Grid>
    </Grid>
  );
};

export default FormsSignIn;
