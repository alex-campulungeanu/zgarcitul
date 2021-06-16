import constants from './../constants/constants';
import axios from 'axios';
import { AsyncStorage, BackAndroid, Alert } from 'react-native';

import * as Utils from '../configs/utils'

export const request = async (options) => {
  // try {
    const defaults = {baseURL: 'http://192.168.0.104:8083',
                      showError: false,
                      timeout: 60000, //timeout 60 seconds
                      }
    let headers = {}
    let detailedError = ''

    //add token if exists 
    let token = await AsyncStorage.getItem('token');
    if(token) {
        const headerToken = {'TokenAuth': token}
        Object.assign(headers, headerToken);
    }

    //add headers if exists in request
    if(typeof options.headers != 'undefined') {
      Object.assign(headers, options.headers)
    }
    //add new headers to options
    Object.assign(options, {headers: headers})
    
    //override defaults object
    options = Object.assign({}, defaults, options);
    console.log('Options for axios request: ', options)
    if (Utils.hasInternetConnectivity()) {
      return axios(options)
      .then(response => {
        // console.log('Axios response request: ', response.request)
        return response.data 
          } )
          .catch( error => {
            console.log('Axios error: ', error)
            if(error.response) {
              if (error.response.status == 401) {
                console.log('Enter error response 401: ', error)
                detailedError = 'Please LOGOUT'
                Utils.deleteToken();
              }
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error', error.message);
            }
            if (options.showError) {
              Alert.alert(
                'UUUPS !',
                'Eroare aplicatie !\n ' + detailedError,
                [
                  {text: 'Ok', onPress: () => console.log('Eroare aplicatie la: ', options.baseURL + options.url)},
                ],
                {cancelable: false},
              );
            }
            let errResponse =  'Ceva nu a mers bine cand am luat datele din BD, stai chill'
            throw errResponse;
          });
    }
  // } catch (error) {
  //   console.log('Runtime Error Request method: ', error)
  // } 
};