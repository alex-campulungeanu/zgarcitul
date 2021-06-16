import React from 'react'
import { Container, makeStyles } from '@material-ui/core'

import Page from '../../../components/Page'
import ProductCreateForm from './ProductCreateForm'
import Header from './Header'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100
  }
}))

const ProductCreateView = () => {
  const classes = useStyles()
  return (
    <Page className={classes.root} >
      <Container>
        <Header />
        <ProductCreateForm />
      </Container>
    </Page>
  )
}

export default ProductCreateView