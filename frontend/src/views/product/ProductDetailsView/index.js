import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { Container, Box, Tabs, Tab, Divider } from '@material-ui/core'

import Details from './Details/index'
import HistoryLogs from './HistoryLogs'
import { getProduct } from 'src/reducers/product.reducer'

const ProductDetailsView = (props) => {
  const [ currentTab, setCurrentTab ] = useState('details')
  const { productId } = useParams();
  const tabs = [
    {value: 'details', label: 'Details'},
    {value: 'priceHistory', label: 'Price History'},
  ]

  useEffect(()=> {
    // props.getProduct(productId)
  },[])

  const handleTabsChange = (event, newValue) => {
    setCurrentTab(newValue)
  }

  // if(props.loading) {
  //   return null
  //   // return (
  //   //   <h1>Loading data</h1>
  //   // )
  // }

  return (
    <Container>
      <Box mt={3}>
        <Tabs 
          value={currentTab}
          onChange={handleTabsChange}
        >
          {tabs.map(tab => {
            return (
              <Tab key={tab.value} label={tab.label} value={tab.value}/>
            ) 
            })}
        </Tabs>
      </Box>
      <Divider />
      <Box mt={3}>
        {currentTab === 'details' && <Details />}
        {currentTab === 'priceHistory' && <HistoryLogs />}
      </Box>  
    </Container>
  )
}

const mapStateToProps = ({productReducer}) => {
  return {
    product: productReducer.product,
    // loading: productReducer.loading
  }
}

const mapDispatchToProps = { getProduct }

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailsView)