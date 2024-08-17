import { REFRESH_TOKEN } from './Graphql/Query/Querys';
import axios from 'axios';


export const generateRefresh = () => {
    return new Promise((resolve, reject) => {
      const refreshToken = localStorage.getItem('refreshtoken');
      if (!refreshToken) {
        sessionExpired();
      } else {
        const graphqlQuery = {
            query: REFRESH_TOKEN,
            variables:{refreshToken}};
        axios({
          url: process.env.REACT_APP_NGROK_PORT,
          method: 'POST',
          data: graphqlQuery})
          .then(({ data }) => {
            const { AccessToken, RefreshToken } = data?.data?.refreshToken || '';
            if (!RefreshToken || !AccessToken) {
              reject(data);
            } else {
              localStorage.setItem('token', `${AccessToken}`);
              localStorage.setItem('refreshtoken', `${RefreshToken}`);
              resolve(AccessToken);
            }
          })
          .catch(e => {
            reject(e);
          });
      }
    });
  };
  export const checkPeriod = numberOfDays => {
    const lastLogged = localStorage.getItem('last-login');
    const currentDate = new Date();
    const convertedDate = new Date(lastLogged);
    const totalSeconds = Math.abs(convertedDate - currentDate) / 1000;
    const daysDiff = (totalSeconds / (60 * 60 * 24));
    return daysDiff <= numberOfDays;
  };

  export const sessionExpired = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    localStorage.removeItem('refreshtoken');
    localStorage.removeItem('last-login');
    localStorage.removeItem('liveDataStarted');
    localStorage.removeItem('LiveDiv');
    window.open('/login', '_self');
  };

