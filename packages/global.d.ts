declare const __API_HOST__: string;

declare interface Window {
  dd: any;
}

// response shape
declare type ResponseData<T = any> = {
  code: number;
  message: string;
  data: T;
}

