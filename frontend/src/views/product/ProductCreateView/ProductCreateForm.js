import React, { useEffect, useState }from 'react'
import { makeStyles, Card, CardContent, Grid, TextField, Typography, Box, Button, TextareaAutosize, FormControl, InputLabel, Select, MenuItem, FormHelperText, Snackbar } from '@material-ui/core'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { connect } from 'react-redux'
import Alert from '@material-ui/lab/Alert'
import { useNavigate } from 'react-router-dom'

import { DirectionSnackbar } from '../../../components/common/DirectionSnackbar'
import { addProduct, reset as resetProducts } from '../../../reducers/product.reducer'
import { getVendors } from '../../../reducers/vendor.reducer'

const useStyles = makeStyles((theme) => ({
  root: {},
  name: {
    width: '50%',
  },
  description: {
    width: '100%'
  },
  vendor: {
    width: 150,
  },
  vendorError: {
    width: 120
  }
}))

const ProductCreateForm = (props) => {
  const classes = useStyles()
  const navigate = useNavigate();
  const [openSnack, setOpenSnack] = useState(false)

  useEffect(() => {
    props.getVendors()
  }, [])

  {/*enable this to navigate to products page after submit*/}
  useEffect(() => {
    console.log('Use effect product added');
    // if (props.productAdded) {
    //   console.log('This is navigate')
    //   navigate('/app/products', { replace: true })
    // }
    return () => {
      props.resetProducts()
    }
  }, [props.productAdded])

  const handleAddProduct = async (data, actions) => {
    props.addProduct(data)
      .then(()=> {
        actions.resetForm()
        setOpenSnack(true)
      })
      .catch(error => console.log('Error catch: ', error))
  }

  return (
    <Formik
      initialValues={{
        name: '',
        url: '',
        description: '',
        vendor: '',
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(100).required('Name is required'),
        url: Yup.string().max(1024).required('URL is required'),
        vendor: Yup.string().max(100).required('Vendor is required'),
        description: Yup.string().max(5000),
      })}
      onSubmit={(values, actions) => handleAddProduct(values, actions)}
    >
      {
        ({ errors, handleChange, handleSubmit, isSubmitting, touched, values, resetForm }) => (
          <form onSubmit={handleSubmit} >
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <Card>
                  <CardContent>
                    <TextField 
                      label="Product name" 
                      name="name" 
                      variant="outlined"
                      className={classes.name}
                      onChange={handleChange}
                      value={values.name}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                    />
                    <Box mt={3}>
                      <TextField 
                        fullWidth 
                        label="URL" 
                        name="url" 
                        variant="outlined"
                        onChange={handleChange}
                        value={values.url} 
                        error={Boolean(touched.url && errors.url)}
                        helperText={touched.url && errors.url}/>
                    </Box>
                    <Box mt={3}>
                      <TextField 
                        fullWidth 
                        label="Description" 
                        name="description" 
                        variant="outlined"
                        onChange={handleChange}
                        value={values.description} />
                    </Box>
                    <Box mt={3}>
                      <FormControl 
                        variant="outlined" 
                        className={classes.vendor} 
                        error={Boolean(touched.vendor && errors.vendor)}
                      >
                        <InputLabel id="labelVendorId2">Vendor</InputLabel>
                        <Select
                          labelId="labelVendorId"
                          id="vendor"
                          name='vendor'
                          variant="outlined"
                          value={values.vendor}
                          onChange={handleChange}
                          label="Vendor"
                        >
                          {props.vendors.map((vendor, id) => <MenuItem key={id} value={vendor.id}>{vendor.name}</MenuItem>)}
                        </Select>
                        <FormHelperText className={classes.vendorError}>{touched.vendor && errors.vendor}</FormHelperText>
                      </FormControl>
                    </Box>
                    <Box mt={3}>
                      {props.errorMessage ? 
                        (
                          <Alert severity="error">
                            {props.errorMessage}
                          </Alert>
                        )
                        :
                        null  
                      }
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Box mt={3}>
              <Button color="secondary" variant="contained" type="submit" disabled={props.loading}>
                Create product
              </Button>
            </Box>
            <DirectionSnackbar open={openSnack} message='Product created !'/>
          </form>
        )
      }
    </Formik>
  )
}

const mapStateToProps = ({productReducer, vendorReducer}) => {
	return {
		loading: productReducer.loading,
    productAdded: productReducer.productAdded,
    errorMessage: productReducer.errorMessage,
    vendors: vendorReducer.vendors,
	}
}

const mapDispatchToProps = { addProduct, getVendors, resetProducts }

export default connect(mapStateToProps, mapDispatchToProps)(ProductCreateForm);