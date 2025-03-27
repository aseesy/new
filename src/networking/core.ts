import axios from 'axios';
import { Alert } from 'react-native';
import { extractValidationErrors, globalLogout } from '../utils';
import { AppStore } from '../storage/storage';
import { ILoginResponse } from '../models/common';
import { StorageConstant } from '../storage/constant';
import { BASE_URL } from '../constants/config';


const CoreApi = axios.create({
  baseURL: BASE_URL,
  timeout: 1000 * 30,
  timeoutErrorMessage: 'Timeout error',
});

const beforeRequest = (config: any) => {
  const userObj = AppStore.getSotageItem<ILoginResponse>(StorageConstant.userToken);
  if (userObj) {
    config.headers.authorization = `Bearer ${userObj.access_token}`;
  }
  return config;
};

// Request Interceptor
CoreApi.interceptors.request.use(beforeRequest, (error) => {
  return Promise.reject(error);
});

// Response Interceptor
CoreApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {

    if (error.response) {
      const errorMessage = error.response.data.ErrorMessage;
      const validationErrors = error.response.data.errors;
      error.message = errorMessage ?? validationErrors;

      // Handle token expiration
      if (error.response.status === 401 && !error.response?.config?.url?.includes('/api/auction/live')) {
        // return globalLogout()
      }

      // Server responded with a status other than 2xx
      // console.log('Response Error:', {
      //     status: error.response.status,
      //     data: error.response.data,
      //     headers: error.response.headers
      // });
      // Optionally, you can handle specific status codes
      // switch (error.response.status) {
      //     case 400:
      //         // Handle 400 Bad Request errors
      //         console.log('Bad Request - Invalid input.');
      //         break;
      //     case 401:
      //         // Handle 401 Unauthorized errors
      //         console.log('Unauthorized - Check your credentials.');
      //         break;
      //     case 403:
      //         // Handle 403 Forbidden errors
      //         console.log('Forbidden - You do not have permission.');
      //         break;
      //     case 404:
      //         // Handle 404 Not Found errors
      //         console.log('Not Found - The resource does not exist.');
      //         break;
      //     default:
      //         // Handle other status codes
      //         console.log('An error occurred.');
      //         break;
      // }
    } else if (error.request) {
      // The request was made but no response was received
      // console.log('Request Error - No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.log('Request Setup Error:', error.message);
    }

    if (error.code === 'ECONNABORTED') {
      console.log('Request Timeout:', error.message);
    }

    if (error.code === 'ERR_NETWORK') {
      error.message = 'Oops!, Please check your internet connection and try again';
    }

    const message = extractValidationErrors(error);
    let logout = false;

    if (message?.toLowerCase() === 'unauthorized.') {
      logout = true;
    }

    if (error.status) Alert.alert('LiaiZen', message, [
      {
        text: logout ? 'Logout' : 'Okay',
        onPress: logout ? globalLogout : undefined
      },
    ]);
    return Promise.reject(error);
  }
);

export default CoreApi;
