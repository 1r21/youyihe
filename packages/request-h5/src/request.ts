import axios, { Axios, type AxiosRequestConfig, type AxiosResponse } from "axios";

declare const __API_HOST__: string;

// create instance
const instance = axios.create({
  baseURL: __API_HOST__ + '/api',
  headers: {
    'Content-Type': "application/json"
  }
})

// Add a request interceptor
instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Add a response interceptor
instance.interceptors.response.use(<T>(response: AxiosResponse<ResponseData<T>>) => {
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

export class WebRequest extends Axios {
  async request<R>(config: AxiosRequestConfig) {
    return instance.request<ResponseData<R>, R>(config)
  }
  async get<R>(url: string, config?: AxiosRequestConfig) {
    return instance.get<ResponseData<R>, R>(url, config)
  }
  async post<R>(url: string, data?: any, config?: AxiosRequestConfig) {
    return instance.post<ResponseData<R>, R>(url, data, config)
  }
}

export default new WebRequest;
