declare const __API_HOST__: string;

// weichat
declare const wx: any;
declare function getApp<T>(): any;

declare interface Window {
  dd: any;
  wx: any;
}

// response shape
declare type ResponseData<T = any> = {
  code: number;
  message: string;
  data: T;
}

