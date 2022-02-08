import axios, { AxiosResponse } from "axios";
import { ResponseData } from './types';

axios.defaults.baseURL = __API_HOST__ + '/api';

axios.defaults.headers.post["Content-Type"] = "application/json";

// Add a request interceptor
axios.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Add a response interceptor
axios.interceptors.response.use((response: AxiosResponse<ResponseData>) => {
  const { status, data: res } = response;
  if (status === 200) {
    const { code, message, data } = res;
    if (code === 0) {
      return data;
    }
    return Promise.reject(message);
  }
  return Promise.reject("Api Request Err 500");
});

export default axios;