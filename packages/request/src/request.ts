import axios, { Axios, AxiosRequestConfig, AxiosResponse } from "axios";

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
    return instance.request<any, R>(config)
  }
  async get<R>(url: string, config?: AxiosRequestConfig) {
    return instance.get<any, R>(url, config)
  }
  async post<R>(url: string, data?: any, config?: AxiosRequestConfig) {
    return instance.post<any, R>(url, data, config)
  }
}

// const http = {
//   ...instance,
//   getUri(config?: AxiosRequestConfig) {
//     return instance.getUri(config)
//   },
//   async request<R>(config: AxiosRequestConfig) {
//     return instance.request<any, R>(config)
//   },
//   async get<R>(url: string, config?: AxiosRequestConfig) {
//     return instance.get<any, R>(url, config)
//   },
//   async post<R>(url: string, data?: any, config?: AxiosRequestConfig) {
//     return instance.post<any, R>(url, data, config)
//   }
// }


export default new WebRequest;
