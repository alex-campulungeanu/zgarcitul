import { getVendors as getVendorsService } from '../services/productServices'

const ACTION_TYPES = {
    GET_VENDORS_REQUEST: 'GET_VENDORS_REQUEST',
    GET_VENDORS_SUCCESS: 'GET_VENDORS_SUCCESS',
    GET_VENDORS_FAILED: 'GET_VENDORS_FAILED',
    RESET_VENDORS: 'RESET_VENDORS',
}

const initialState = {
    loading: false,
    errorMessage: '',
    vendors: []
}

const vendors = (state = initialState, action) => {
    switch(action.type) {
        case ACTION_TYPES.GET_VENDORS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case ACTION_TYPES.GET_VENDORS_SUCCESS:
            return {
                ...state,
                loading: false,
                vendors: action.payload
            }
        case ACTION_TYPES.GET_VENDORS_FAILED:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload
            }
        case ACTION_TYPES.RESET_VENDORS:
            return {
                ...initialState
            }
        default:
            return state
    }
}

export const getVendors = () => async dispatch =>  {
    // console.log('enter function getProducts()');
    dispatch({type: ACTION_TYPES.GET_VENDORS_REQUEST})
    try {
        const response = await getVendorsService()
        dispatch({type: ACTION_TYPES.GET_VENDORS_SUCCESS, payload: response.msg})
    } catch (error) {
        dispatch({type: ACTION_TYPES.GET_VENDORS_FAILED, payload: error})
    }
}

export default vendors