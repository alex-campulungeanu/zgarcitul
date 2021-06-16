import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {Box, Button, Container, Link, TextField, Typography, makeStyles} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert'
import { AlertTitle } from '@material-ui/lab';

import Page from 'src/components/Page';
import {DirectionSnackbar} from '../../components/common/DirectionSnackbar'
import { login, reset } from '../../reducers/authentication.reducer'

const useStyles = makeStyles((theme) => ({  
  root: {
    backgroundColor: theme.palette.background.dark,  
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = (props) => {
  const {state: stateLocation} = useLocation();
  console.log(stateLocation)
  const classes = useStyles();
  const navigate = useNavigate(); 
  const [isUserCreated, setIsUserCreated] = useState(false)
  
  useEffect(() => {
    if(props.token) {
      navigate('/', { replace: true });
    }
    return () => {
      props.reset()
    }
  }, [props.token])

  const handleLogin = async (values, {setSubmitting}) => {
    // event.preventDefault();
		await props.login(values.email, values.password)
    setSubmitting(false)
  };
  

  useEffect(()=> {
    if (stateLocation) {
      console.log('User has been created');
      setIsUserCreated(true)
    }
  }, [stateLocation])

  return (
    <Page className={classes.root} title="Login" >
      <Box display="flex" flexDirection="column" height="100%" justifyContent="center" >
        <Container maxWidth="sm">  
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values, actions ) => {
              handleLogin(values, actions)
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2" >
                    Sign in changed
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1" >
                  Don&apos;t have an account?
                  {' '}
                  <Link component={RouterLink} to="/register" variant="h6" >
                    Sign up
                  </Link>
                </Typography>
                {props.errorMessage ? 
                  (
                    <Alert severity="error" variant="filled">
                      <AlertTitle>Authentication failed !</AlertTitle>
                      <strong>{props.errorMessage}</strong>
                    </Alert>
                  )
                  :
                  null  
                }
              </form>
            )}
          </Formik>
          <DirectionSnackbar open={isUserCreated} message='User created, now you can login !'/>
        </Container>
      </Box>
    </Page>
  );
};

const mapStateToProps = ({authenticationReducer}) => {
	return {
		loading: authenticationReducer.loading,
    errorMessage: authenticationReducer.errorMessage,
    token: authenticationReducer.token
	}
}

const mapDispatchToProps = { login, reset }

// export default withRouter(SignIn);
export default connect(mapStateToProps, mapDispatchToProps)(LoginView);