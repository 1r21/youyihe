// wechat
declare const wx: any;
declare function getApp<T>(): T | any;

type Method = "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE";

type Params = {
  url: string;
  method?: Method;
  data?: any
}

export class WxRequest {
  baseURL: string;
  constructor(baseURL?: string) {
    const { __API_HOST__ } = getApp()
    this.baseURL = baseURL || __API_HOST__ + '/api'
  }
  request<R>({ url, method = 'GET', data = {} }: Params): Promise<R> {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.baseURL}${url}`,
        method,
        data,
        dataType: 'json',
        success(res: { data: ResponseData<R> }) {
          const { code, message, data } = res.data;
          if (code === 0) {
            resolve(data)
          } else {
            reject(message)
          }
        },
        fail(res: unknown) {
          reject(res)
        },
      });
    })
  }

  async get<R>(url: string) {
    return this.request<R>({ url })
  }

  async post<R>(url: string, data: any) {
    return this.request<R>({ url, method: 'POST', data })
  }

  async put<R>(url: string, data: any) {
    return this.request<R>({ url, method: 'POST', data })
  }
}

export default new WxRequest;
