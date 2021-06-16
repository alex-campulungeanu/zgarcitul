import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link } from 'react-router-dom'
import { Avatar, Box, Card, Checkbox, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Typography, makeStyles, SvgIcon, IconButton} from '@material-ui/core';
// import getInitials from 'src/utils/getInitials';
import { Image as ImageIcon, Edit as EditIcon,ArrowRight as ArrowRightIcon, } from 'react-feather'

import Label from 'src/components/common/Label';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(0),
  },
  imageCell: {
    fontSize: 0,
    width: 68,
    flexBasis: 68,
    flexGrow: 0,
    flexShrink: 0
  },
  image: {
    height: 68,
    width: 68
  },
}));

const getStatusType = (status) => {
  const map = {
    1: {
      text: 'ACTIVE',
      color: 'success'
    },
    0: {
      text: 'INACTIVE',
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

const Results = ({ className, products, ...rest }) => {
  const classes = useStyles();
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;
    if (event.target.checked) {
      newSelectedCustomerIds = products.map((customer) => customer.id);
    } else {
      newSelectedCustomerIds = [];
    }
    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];
    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }
    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  console.log(products)
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === products.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < products.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                < TableCell/>
                <TableCell> Product name </TableCell>
                <TableCell> Current Price </TableCell>
                <TableCell> Vendor </TableCell>
                <TableCell> STATUS </TableCell>
                {/* <TableCell> Create date </TableCell> */}
                <TableCell> Actions </TableCell>
                {/* <TableCell> Email </TableCell>
                <TableCell> Location </TableCell>
                <TableCell> Phone </TableCell>
                <TableCell> Registration date </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.slice(0, limit).map((product) => (
                <TableRow
                  hover
                  key={product.id}
                  selected={selectedCustomerIds.indexOf(product.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(product.id) !== -1}
                      onChange={(event) => handleSelectOne(event, product.id)}
                      value="true"
                    />
                  </TableCell>
                  {/* <TableCell>
                    <Box alignItems="center" display="flex" >
                      <Avatar className={classes.avatar} src={product.avatarUrl} >
                        {getInitials(product.name)}
                      </Avatar>
                    </Box>
                  </TableCell> */}
                  <TableCell className={classes.imageCell}>
                    {product.image ? (
                      <img alt="Product" src={product.image} className={classes.image} />
                    ) : (
                      <Box p={2} bgcolor="background.dark" >
                        <SvgIcon>
                          <ImageIcon />
                        </SvgIcon>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box alignItems="center" display="flex" >
                      <Typography color="textPrimary" variant="body1" >
                        {product.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {product.current_price}
                  </TableCell>
                  <TableCell>
                    {product.vendor}
                  </TableCell>
                  <TableCell>
                    {getStatusType(product.active)}
                  </TableCell>
                  {/* <TableCell>
                    {moment(product.create_date.$date).format('YYYY/MM/DD')}
                  </TableCell> */}
                  <TableCell>
                    <IconButton component={Link} to="#" >
                      <SvgIcon fontSize='small'>
                        <EditIcon />    
                      </SvgIcon>
                    </IconButton>
                    <IconButton component={Link} to={`/app/products/${product.id}`} >
                      <SvgIcon fontSize='small'>
                        <ArrowRightIcon />    
                      </SvgIcon>
                    </IconButton>
                  </TableCell>
                  {/* <TableCell>
                    {customer.email}
                  </TableCell>
                  <TableCell>
                    {`${customer.address.city}, ${customer.address.state}, ${customer.address.country}`}
                  </TableCell>
                  <TableCell>
                    {customer.phone}
                  </TableCell>
                  <TableCell>
                    {moment(customer.createdAt).format('DD/MM/YYYY')}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={products.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  products: PropTypes.array.isRequired
};

export default Results;
