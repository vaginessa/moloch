import axios from 'axios';
import AuthService from './auth';

export default function setup () {
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use(function (config) {
    const token = AuthService.getToken();

    if (token) {
      config.headers['x-access-token'] = token;
    }

    return config;
  }, function (error) {
    return Promise.reject(error);
  });
}
