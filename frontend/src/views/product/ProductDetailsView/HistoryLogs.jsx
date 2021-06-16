import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Box, Card, CardHeader, Divider, Typography, Table, TableBody, TableCell, TableRow, TableHead, colors, makeStyles } from '@material-ui/core';
import {connect} from 'react-redux'
// import axios from 'src/utils/axios';
// import useIsMountedRef from 'src/hooks/useIsMountedRef';

import Label from 'src/components/common/Label';

const useStyles = makeStyles(() => ({
  root: {},
  createdAtCell: {
    width: 250
  },
  statusCell: {
    width: 64
  }
}));

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

function HistoryLogs(props) {
  const classes = useStyles();

  if (!props.product) {
    return null;
  }

  return (
    <div
      // className={clsx(classes.root, className)}
      // {...rest}
    >
      <Card>
        <CardHeader title="Product logs" />
        <Divider />
        <PerfectScrollbar>
          <Box minWidth={1150}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Error</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.product.history.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className={classes.createdAtCell}>
                      <Typography variant="h6" color="textPrimary" >
                        {moment(log.created_at).format('DD-MM-YYYY | HH:mm:ss')}
                      </Typography>
                    </TableCell>
                    <TableCell>{log.price}</TableCell>
                    <TableCell>{getStocType(log.is_stock)}</TableCell>
                    <TableCell>{log.error}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
      </Card>
    </div>
  );
}

HistoryLogs.propTypes = {
  className: PropTypes.string
};

const mapStateToProps = ({productReducer}) => {
  return {
    product: productReducer.product,
    loading: productReducer.loading
  }
}

const mapDispatchToProps = { }

export default connect(mapStateToProps, mapDispatchToProps)(HistoryLogs)
