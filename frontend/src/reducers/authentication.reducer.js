// import axios from 'axios'

import {
    login as loginService
} from '../services/authenticationServices'

import { ACCESS_TOKEN } from '../config/constants'

const ACTION_TYPES = {
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILED: 'LOGIN_FAILED',
    LOGOUT_REQUEST: 'LOGOUT_REQUEST',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    LOGOUT_FAILED: 'LOGOUT_FAILED',
    LOGOUT_REQUEST: 'LOGOUT_REQUEST',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    LOGOUT_FAILED: 'LOGOUT_FAILED',
    LOGOUT_RESET: 'LOGOUT_RESET',
}

const initialState = {
    loading: false,
    errorMessage: '',
    token: localStorage.getItem(ACCESS_TOKEN),
}

const authenticationReducer = (state = initialState, action) => {
    switch(action.type) {
        case ACTION_TYPES.LOGIN_REQUEST:
            return {
                ...state,
                loading: true
            }
        case ACTION_TYPES.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                token: action.payload
            }
        case ACTION_TYPES.LOGIN_FAILED:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload
            }
        case ACTION_TYPES.LOGOUT_REQUEST:
            return {
                ...state,
                loading: true
            }
        case ACTION_TYPES.LOGOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                token: null
            }
        case ACTION_TYPES.LOGOUT_FAILED:
            return {
                ...state,
                loading: false,
                errorMessage: action.payload
            }
        case ACTION_TYPES.LOGOUT_RESET:
            return {
                ...state,
                loading: false,
                errorMessage: ''
            }
        default:
            return state
    }
}

export const loginSucces = token => {
    localStorage.setItem(ACCESS_TOKEN, token)
    return {
        type: ACTION_TYPES.LOGIN_SUCCESS,
        payload: token
    }
}

export const login = (email, password) => async dispatch => {
    try {        
        dispatch({type: ACTION_TYPES.LOGIN_REQUEST})
        const response = await loginService(email, password)
        dispatch(loginSucces(response.msg.access_token))
        // const result = await dispatch({
        //     type: ACTION_TYPES.LOGIN
        // })
        
        // return dispatch => {
        //     dispatch({type: ACTION_TYPES.GET_POSTS_REQUEST})
        //     axios.get('/posts')
        //     .then( res => dispatch({type: ACTION_TYPES.GET_POSTS_SUCCESS, payload: res.data}) )
        //     .catch( error => {
        //         console.log(error)
        //         return dispatch({type: ACTION_TYPES.GET_POSTS_FAILED, payload: error.message})
        //     } )
        // }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log(error.response.data.msg)
            dispatch({type: ACTION_TYPES.LOGIN_FAILED, payload: error.response.data.msg})
        } else {
            dispatch({type: ACTION_TYPES.LOGIN_FAILED, payload: 'Something went wrong !'})
        }
    }
}

export const reset = () => async dispatch => {
    dispatch({type: ACTION_TYPES.LOGOUT_RESET})
}


export const logout = () => dispatch => {
    localStorage.removeItem(ACCESS_TOKEN)
    try {
        dispatch({type: ACTION_TYPES.LOGOUT_SUCCESS})
    } catch (error) {
        console.log('Error on logout');
    }
}

const clearAuthToken = () => {
    localStorage.removeItem(ACCESS_TOKEN)
}

export const clearAuthentication = () => (dispatch, getState) => {
    clearAuthToken();
    dispatch({
      type: ACTION_TYPES.LOGOUT_SUCCESS
    });
  };

export default authenticationReducer