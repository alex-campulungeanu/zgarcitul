import React, {useState} from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, Checkbox, Container, FormHelperText, Link, TextField, Typography, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Alert from '@material-ui/lab/Alert'

import {register} from '../../services/authenticationServices'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const RegisterView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('')

  const handleRegister = (values) => {
    console.log(values)
    register(values.name, values.email, values.password, values.secret)
      .then(() => navigate('/login', { replace: true, state: { useCretead: true }}))
      .catch(error => setApiError(error.response.data.msg))
  }
  return (
    <Page className={classes.root} title="Register" >
      <Box display="flex" flexDirection="column" height="100%" justifyContent="center" >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              name: '',
              password: '',
              secret: '',
              policy: true
            }}
            validationSchema={
              Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                name: Yup.string().max(255).required('Name is required'),
                password: Yup.string().max(255).required('Password is required'),
                secret: Yup.string().max(255).required('You must known the secret PASS'),
                policy: Yup.boolean().oneOf([true], 'This field must be checked')
              })
            }
            onSubmit={(values) => {
              handleRegister(values)
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography color="textPrimary" variant="h2" >
                    Create new account
                  </Typography>
                  <Typography color="textSecondary" gutterBottom variant="body2" >
                    Use your email to create new account
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.name && errors.name)}
                  fullWidth
                  helperText={touched.name && errors.name}
                  label="Last name"
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  variant="outlined"
                />
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
                <TextField
                  error={Boolean(touched.secret && errors.secret)}
                  fullWidth
                  helperText={touched.secret && errors.secret}
                  label="Secret word"
                  margin="normal"
                  name="secret"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.secret}
                  variant="outlined"
                />
                <Box alignItems="center" display="flex" ml={-1} >
                  <Checkbox checked={values.policy} name="policy" onChange={handleChange} />
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    I have read the
                    {' '}
                    <Link color="primary" component={RouterLink} to="#" underline="always" variant="h6" >
                      Terms and Conditions
                    </Link>
                  </Typography>
                </Box>
                {Boolean(touched.policy && errors.policy) && (
                  <FormHelperText error>
                    {errors.policy}
                  </FormHelperText>
                )}
                <Box my={2}>
                  <Button
                    color="primary"
                    // disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign up now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1" >
                  Have an account?
                  {' '}
                  <Link component={RouterLink} to="/login" variant="h6" >
                    Sign in
                  </Link>
                </Typography>
                <Box mt={3}>
                  {apiError ? 
                    (
                      <Alert severity="error" >
                        {apiError}
                      </Alert>
                    )
                    :
                    null  
                  }
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default RegisterView;
