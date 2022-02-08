export type ResponseData = {
  code: number;
  message: string;
  data: unknown;
}

export type News = {
  id?: number;
  title: string;
  src: string;
  cover: string;
  source: string;
  transcript: string;
  date: string;
};

export type Translation = {
  src: string;
  dst: string;
};
