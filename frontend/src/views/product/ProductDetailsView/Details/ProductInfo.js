import React, { useEffect }from "react";
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Card, CardHeader, Divider, Table, TableBody, TableRow, TableCell, TableHead } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { getProduct } from 'src/reducers/product.reducer'
import Label from 'src/components/common/Label';

const useStyles = makeStyles((theme) => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  },
  fontWeightBold: {
    fontWeight: theme.typography.fontWeightBold
  }
}))

const ProductInfo = (props) => {
  const classes = useStyles()
  const { productId } = useParams();

  
  useEffect(()=> {
    props.getProduct(productId)
  }, [])
  
  const getStocType = (status) => {
    const map = {
      1: {
        text: 'YES',
        color: 'success'
      },
      0: {
        text: 'NO',
        color: 'error'
      }
    }
    const { text, color } = map[status]
    return (
      <Label color={color}>
        {text}
      </Label>
    )
  }

  if(props.loading) {
    return null
    // return (
    //   <h1>Loading data</h1>
    // )
  }
  return (
    <Card>
      <CardHeader title='Product info'/>
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}> Name </TableCell>
            <TableCell> {props.product.name} </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}> URL </TableCell>
            <TableCell> {props.product.url} </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}> Current price </TableCell>
            <TableCell> {props.product.current_price} </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}> Is in stock </TableCell>
            <TableCell> {getStocType(props.product.current_is_stock)} </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  )
}

const mapStateToProps = ({productReducer}) => {
  return {
    product: productReducer.product,
    loading: productReducer.loading
  }
}

const mapDispatchToProps = { getProduct }

export default connect(mapStateToProps, mapDispatchToProps)(ProductInfo)