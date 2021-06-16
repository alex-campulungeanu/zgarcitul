import React from 'react'
import { Grid } from '@material-ui/core'

import ProductInfo from './ProductInfo'
import ProductActions from './ProductActions'


const Details = ({product, ...rest}) => {
  //TODO: remove the props product, currently is not filled and used

  return (
    <Grid container spacing={3}>
      <Grid item lg={12} md={12} xl={12} xs={12}>
        <ProductInfo product={product}/>
      </Grid>
      <Grid item lg={4} md={6} xl={3} xs={12}>
        <ProductActions />
      </Grid>
    </Grid>
  )
}

export default Details