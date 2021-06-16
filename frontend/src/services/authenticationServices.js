import axios from 'axios'

// import { ACCESS_TOKEN } from '../config/constants'

export const login = async(email, password) => {
    const requestData = {
        email: email,
        password: password
    }
    const response = await axios('/auth/login', {
        method: 'POST',
        data: requestData
    })
    // if (response.data.status === 'success') {
    //     localStorage.setItem(ACCESS_TOKEN, response.data.msg.access_token)
    // }
    return response
}

export const register = async(name, email, password, secret) => {
    console.log('Enter register')
    const requestData = {
        name: name,
        email: email,
        password: password,
        secret: secret,
    }
    const response = await axios('/auth/signup', {
        method: 'POST',
        data: requestData
    })
    return response
}