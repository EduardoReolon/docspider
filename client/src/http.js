import axios from 'axios';
import authPivot from '@/store/authPivot';

const baseURL = '/api';

export default () => {
  const axiosApiInstance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      Authorization: `Bearer ${authPivot.state.token}`,
    },
  });
  axiosApiInstance.interceptors.response.use((response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && authPivot.state.refreshToken) {
        let returnConection = null;
        await axios.create({
          baseURL,
          timeout: 5000,
        }).post('v1/auth/refresh', {
          refresh_token: authPivot.state.refreshToken,
        })
          .then(async ({ data }) => {
            authPivot.state.token = data.token;
            authPivot.state.refreshToken = data.refreshToken;
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            await axios.request(originalRequest)
              .then((finalData) => {
                returnConection = finalData;
              })
              .catch((finalError) => {
                returnConection = finalError;
              });
          })
          .catch((errorRefreshToken) => {
            returnConection = errorRefreshToken;
          });
        if (returnConection.status === 200 || returnConection.status === 201) {
          return returnConection;
        }
        return Promise.reject(returnConection);
      }
      return Promise.reject(error);
    });

  return axiosApiInstance;
};
