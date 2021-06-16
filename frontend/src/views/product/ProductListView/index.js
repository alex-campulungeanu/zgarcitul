import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'
import { Box, Container, makeStyles } from '@material-ui/core';

import Page from 'src/components/Page';
import Results from './Results';
import Header from './Header';
// import data from './data';
import { getProducts, reset } from '../../../reducers/product.reducer'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ProductListView = (props) => {
  const classes = useStyles();
  // const [products] = useState([]);

  useEffect(() => {
    props.getProducts()
    // return await props.reset()
  },[])

  return (
    <Page
      className={classes.root}
      title="Products"
    >
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results products={props.products} />
        </Box>
      </Container>
    </Page>
  );
};

const mapStateToProps = ({productReducer}) => {
  return {
    products: productReducer.products
  }
}

const mapDispatchToProps = { getProducts, reset }

export default connect(mapStateToProps, mapDispatchToProps)(ProductListView);
