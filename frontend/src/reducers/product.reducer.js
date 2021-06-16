import { getProducts as getProductsService } from '../services/productServices'
import { getProduct as getProductService } from '../services/productServices'
import { addProduct as addProductService } from '../services/productServices'
import { changeStatus as changeProductStatusService } from '../services/productServices'
import { deleteProduct as deleteProductService } from '../services/productServices'

const ACTION_TYPES = {
    GET_PRODUCTS_REQUEST: 'GET_PRODUCTS_REQUEST',
    GET_PRODUCTS_SUCCESS: 'GET_PRODUCTS_SUCCESS',
    GET_PRODUCTS_FAILED: 'GET_PRODUCTS_FAILED',
    GET_PRODUCT_REQUEST: 'GET_PRODUCT_REQUEST',
    GET_PRODUCT_SUCCESS: 'GET_PRODUCT_SUCCESS',
    GET_PRODUCT_FAILED: 'GET_PRODUCT_FAILED',
    ADD_PRODUCT_REQUEST: 'ADD_PRODUCT_REQUEST',
    ADD_PRODUCT_SUCCESS: 'ADD_PRODUCT_SUCCESS',
    ADD_PRODUCT_FAILED: 'ADD_PRODUCT_FAILED',
    CHANGE_PRODUCT_STATUS_REQUEST: 'CHANGE_PRODUCT_STATUS_REQUEST',
    CHANGE_PRODUCT_STATUS_SUCCESS: 'CHANGE_PRODUCT_STATUS_SUCCESS',
    CHANGE_PRODUCT_STATUS_FAILED: 'CHANGE_PRODUCT_STATUS_FAILED',
    DELETE_PRODUCT_REQUEST: 'DELETE_PRODUCT_REQUEST',
    DELETE_PRODUCT_SUCCESS: 'DELETE_PRODUCT_SUCCESS',
    DELETE_PRODUCT_FAILED: 'DELETE_PRODUCT_FAILED',
    // GET_VENDORS_REQUEST: 'GET_VENDORS_REQUEST',
    // GET_VENDORS_SUCCESS: 'GET_VENDORS_SUCCESS',
    // GET_VENDORS_FAILED: 'GET_VENDORS_FAILED',
    RESET_PRODUCTS: 'RESET_PRODUCTS',
    RESET_DELETE_PRODUCT: 'RESET_DELETE_PRODUCT',
    RESET_ERRORS: 'RESET_ERRORS',
}

const initialState = {
    loading: false, // TODO: loading should be initiate with false
    errorMessage: '',
    products: [],
    product: {
        name: '',
        current_price: 0,
        current_is_stock: 1,
        url: '',
        active: '',
    },
    productAdded: false,
    productDeleted: false,
    deleteErrorMessage: ''
    // vendors: []
}

const products = (state = initialState, action) => {
    // console.log('enter products reducer with param: ', action);
    switch(action.type) {
        case ACTION_TYPES.GET_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case ACTION_TYPES.GET_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload
            }
        case ACTION_TYPES.GET_PRODUCTS_FAILED:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload
            }
        case ACTION_TYPES.GET_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case ACTION_TYPES.GET_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                product: action.payload
            }
        case ACTION_TYPES.GET_PRODUCT_FAILED:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload
            }
        case ACTION_TYPES.ADD_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case ACTION_TYPES.ADD_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                productAdded: true,
            }
        case ACTION_TYPES.ADD_PRODUCT_FAILED:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload
            }
        case ACTION_TYPES.CHANGE_PRODUCT_STATUS_REQUEST:
            return { ...state, loading: true, }
        case ACTION_TYPES.CHANGE_PRODUCT_STATUS_SUCCESS:
            return { ...state, loading: false, product: { ...state.product, active: action.payload } }
        case ACTION_TYPES.CHANGE_PRODUCT_STATUS_FAILED:
            return { ...state, loading: false, errorMessage: action.payload }
        case ACTION_TYPES.DELETE_PRODUCT_REQUEST:
            return { ...state, loading: true, }
        case ACTION_TYPES.DELETE_PRODUCT_SUCCESS:
            return { ...state, loading: false, productDeleted: true }
        case ACTION_TYPES.DELETE_PRODUCT_FAILED:
            return { ...state, loading: false, errorMessage: action.payload }
        case ACTION_TYPES.RESET_PRODUCTS:
            return { ...initialState }
        case ACTION_TYPES.RESET_DELETE_PRODUCT:
            return { ...initialState, productDeleted: false  }
        case ACTION_TYPES.RESET_ERRORS:
            return { ...initialState, deleteErrorMessage: '' }
        default:
            return state
    }
}

export const getProducts = () => async dispatch =>  {
    // console.log('enter function getProducts()');
    dispatch({type: ACTION_TYPES.GET_PRODUCTS_REQUEST})
    try {
        const response = await getProductsService()
        dispatch({type: ACTION_TYPES.GET_PRODUCTS_SUCCESS, payload: response.msg})
    } catch (error) {
        dispatch({type: ACTION_TYPES.GET_PRODUCTS_FAILED, payload: error})
    }
}

export const getProduct = (productId) => async dispatch => {
    dispatch({type: ACTION_TYPES.GET_PRODUCT_REQUEST})
    try {
        const response = await getProductService(productId)
        dispatch({type: ACTION_TYPES.GET_PRODUCT_SUCCESS, payload: response.msg})
    } catch (error) {
        dispatch({type: ACTION_TYPES.GET_PRODUCT_FAILED, payload: error})
    }
}

export const reset = () => async dispatch => {
    dispatch({type: ACTION_TYPES.RESET_PRODUCTS})
}

export const addProduct = (data) => async dispatch => {
    dispatch({type: ACTION_TYPES.ADD_PRODUCT_REQUEST})
    try {
        const response = await addProductService(data)
        dispatch({type: ACTION_TYPES.ADD_PRODUCT_SUCCESS, payload: response.msg})
    } catch (error) {
        dispatch({type: ACTION_TYPES.ADD_PRODUCT_FAILED, payload: error.response.data.msg})
        throw new Error(error.response.status);
    }
}

export const changeProductStatus = (id) => async dispatch => {
    dispatch({type: ACTION_TYPES.CHANGE_PRODUCT_STATUS_REQUEST})
    try {
        const response = await changeProductStatusService(id)
        dispatch({type: ACTION_TYPES.CHANGE_PRODUCT_STATUS_SUCCESS, payload: response.msg})
    } catch (error) {
        dispatch({type: ACTION_TYPES.CHANGE_PRODUCT_STATUS_FAILED, payload: error.response.data.msg})
        throw new Error(error.response.status);
    }
}

export const deleteProduct = (id) => async dispatch => {
    dispatch({type: ACTION_TYPES.DELETE_PRODUCT_REQUEST})
    try {
        const response = await deleteProductService(id)
        dispatch({type: ACTION_TYPES.DELETE_PRODUCT_SUCCESS, payload: response.msg})
        dispatch({type: ACTION_TYPES.RESET_DELETE_PRODUCT, payload: response.msg})
    } catch (error) {
        dispatch({type: ACTION_TYPES.DELETE_PRODUCT_FAILED, payload: error.response.data.msg})
        throw new Error(error.response.status);
    }
}

export default products