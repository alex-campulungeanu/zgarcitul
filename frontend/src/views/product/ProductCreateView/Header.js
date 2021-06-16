import React from 'react'
import { Button, Grid, Typography, makeStyles } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'

const useStyles = makeStyles( () => {
  root: {}
})

const Header = ({className, ...rest}) => {
  const classes = useStyles()
  return (
    <Grid 
      container
      justify="space-between"
      spacing={3}
    >
      <Grid item>
        <Typography 
          variant="h3" 
          color="textPrimary"
        >
          Create new product
        </Typography>
      </Grid>
      <Grid item>
        <Button
          component={RouterLink}
          to="/app/products"
        >
          CANCEL
        </Button>
      </Grid>
    </Grid>
  )
}

export default Header