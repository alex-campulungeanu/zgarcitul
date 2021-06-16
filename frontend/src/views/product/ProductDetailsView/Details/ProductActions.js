import React, { useEffect }from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx';
import { Box, Card, CardHeader, CardContent, Button, Divider, Typography, makeStyles } from '@material-ui/core';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import DeleteIcon from '@material-ui/icons/DeleteOutline';

import { changeProductStatus, deleteProduct, reset as resetProducts } from '../../../../reducers/product.reducer'
import { deleteProduct as deleteProductAction} from 'src/services/productServices'

const useStyles = makeStyles((theme) => ({
  root: {},
  deleteAction: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  }
}));

// TODO: remove className from props
const ProductActions = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (props.productDeleted) {
  //     navigate('/app/products', { replace: true })
  //   }
  // }, [props.productDeleted])

  const handleDeactivate = (id) => {
    props.changeProductStatus(id)
  }

  const handleDeleteProduct = (id)  => {
    // props.deleteProduct(id)
    deleteProductAction(id).then(() => navigate('/app/products', { replace: true }))
  }

  return (
    <Card
      // className={clsx(classes.root, props.className)}
      // {...rest}
    >
      <CardHeader title="Product actions" />
      <Divider />
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="flex-start" >
          {props.product.active == 1 ?
            (
              <Button variant="contained" onClick={() => handleDeactivate(props.product.id)}>
                <NotInterestedIcon className={classes.actionIcon} />
                Stop collecting data
              </Button>
            )
            : 
            (
              <Button color="primary" variant="contained" onClick={() => handleDeactivate(props.product.id)}>
                <PlayCircleOutlineIcon className={classes.actionIcon} />
                Start collecting data
              </Button>
            )
          }
        </Box>
        <Box mt={1} mb={2} >
          <Typography variant="body2" color="textSecondary" >
            Stop collecting data means that the product remains in database, but price and stock and others will not be collected anymore.
          </Typography>
        </Box>
        <Button className={classes.deleteAction} onClick={() => handleDeleteProduct(props.product.id)}>
          <DeleteIcon className={classes.actionIcon} />
          Delete product
        </Button>
      </CardContent>
    </Card>
  );
}

ProductActions.propTypes = {
  className: PropTypes.string
};

const mapStateToProps = ({productReducer}) => {
  return {
    product: productReducer.product,
    productDeleted: productReducer.productDeleted,
    loading: productReducer.loading
  }
}

const mapDispatchToProps = { changeProductStatus, deleteProduct, resetProducts }

export default connect(mapStateToProps, mapDispatchToProps)(ProductActions)
