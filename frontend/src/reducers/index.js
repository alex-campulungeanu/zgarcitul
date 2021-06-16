import { combineReducers } from 'redux'

import productReducer from './product.reducer'
import vendorReducer from './vendor.reducer'
import authenticationReducer from './authentication.reducer'

const appReducer = combineReducers({
    productReducer,
    vendorReducer,
    authenticationReducer
})

export default appReducer