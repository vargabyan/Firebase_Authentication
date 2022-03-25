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
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { UIContext } from '../../Unknown/UIContext/index';
import VeacotIcon from '../image/Vector.png';

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
  PAlreadyHaveAccount: {
    fontWeight: 600,
    fontSize: '14px',
    letterSpacing: '-1.5px',
    color: '#000000',
  },
  LinkLogin: {
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
        <p className={classes.pRegister}>Register</p>
      </Grid>
    </Grid>
  );
}

function LinkAndTextAlreadyHaveAccount() {
  const classes = useStyles();

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <p className={classes.PAlreadyHaveAccount}>Already have account?</p>
      </Grid>
      <Grid item xs={12}>
        <Link to="/login" className={classes.LinkLogin}>
          LOGIN
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
  fullName: yup
    .string()
    .matches(/[A-Z]{1}[a-z]+\s[A-Z]{1}[a-z]+/, {
      message: 'Must be two words and each must start with a capital letter',
    })
    .required('Full Name is required'),
  password: yup
    .string()
    .min(12, 'Password should be of minimum 12 characters length')
    .required('Password is required'),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Repeat password must be the same')
    .min(12, 'Password should be of minimum 12 characters length')
    .required('Repeat Password is required'),
});

interface FierbaseValue {
  email: string;
  fullName: string;
  password: string;
  repeatPassword: string;
}

function Forms() {
  const classes = useStyles();
  const { setAlert } = useContext(UIContext);
  const [loginButton, setLoginButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fierbaseToDo = async (value: FierbaseValue) => {
    const auth = firebase.auth();

    await auth
      .createUserWithEmailAndPassword(value.email, value.password)
      .catch((error) => {
        const errorMessage = error.message;

        setAlert({
          show: true,
          severity: 'info',
          message: errorMessage,
        });
      });

    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        currentUser
          .updateProfile({
            displayName: value.fullName,
          })
          .catch((error) => {
            const errorMessage = error.message;
            setAlert({
              show: true,
              severity: 'info',
              message: errorMessage,
            });
          });
      }
    });

    setLoginButton(false);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      fullName: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema,
    onSubmit: (value) => {
      setLoginButton(true);
      fierbaseToDo(value);
    },
    //= ==========================
    // Second way
    //= ==========================
    // validate: (values) => {
    //   const errors: { fullName?: any } = {};

    //   if (!values.fullName) {
    //     errors.fullName = 'full name is required';
    //   } else if (!/[A-Z]{1}[a-z]+\s[A-Z]{1}[a-z]+/.test(values.fullName)) {
    //     errors.fullName =
    //       'Must be two words and each must start with a capital letter';
    //   }

    //   return errors;
    // },
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
        <TextField
          variant="filled"
          name="fullName"
          label="Full Name"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          error={formik.touched.fullName && Boolean(formik.errors.fullName)}
          helperText={formik.touched.fullName && formik.errors.fullName}
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
        <FormControl variant="filled" className={classes.formsinput}>
          <InputLabel htmlFor="filled-adornment-repeat-password">
            Repeat password
          </InputLabel>
          <FilledInput
            name="repeatPassword"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.repeatPassword}
            onChange={formik.handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle repeat password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText
            error={
              formik.touched.repeatPassword &&
              Boolean(formik.errors.repeatPassword)
            }
          >
            {formik.touched.repeatPassword && formik.errors.repeatPassword}
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

const FormsSignUp: React.FC = () => {
  return (
    <Grid container spacing={8} p={6}>
      <Grid item xs={12}>
        <VectorIconAndTextLogin />
      </Grid>
      <Grid item xs={12}>
        <Forms />
      </Grid>
      <Grid item xs={12}>
        <LinkAndTextAlreadyHaveAccount />
      </Grid>
    </Grid>
  );
};

export default FormsSignUp;
