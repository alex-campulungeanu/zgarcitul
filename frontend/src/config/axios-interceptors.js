import axios from 'axios';
import { toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css';

import { ACCESS_TOKEN, SERVER_API_URL } from './constants';
console.log(SERVER_API_URL)
const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVER_API_URL;
// axios.defaults.baseURL = 'http://localhost:5001/api';

const setupAxiosInterceptors = (clearAuthentication) => {
  console.log('SERVER_API_URL: ', SERVER_API_URL)
  const onRequestSuccess = config => {
    const token = localStorage.getItem(ACCESS_TOKEN); // TODO: add sessionStorage here is needed
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log(config.headers);
    }
    return config;
  };
  const onResponseSuccess = response => response.data;
  // const onResponseError = err => err;
  // TODO: make the response error better
  const onResponseError = err => {
    const status = err.status || (err.response ? err.response.status : 0);
    if (status === 403 || status === 401) {
      clearAuthentication();
      // console.log('User NOT authenticated: ', err)
    }
    if( status===500 || status === 0 || status === 404 ) {
      console.log('Some error occurs on interceptors: ', status, err)
      toast('Something went terribly wrong !');
    }
    // console.log('Err from interceptors: ', err)
    return Promise.reject(err);
  };
  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
