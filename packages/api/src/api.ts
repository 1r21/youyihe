import { News, Translation } from "@1r21/types";
import request from './loadHttp'

export async function getNews() {
  return (await request).get<{ list: News[] }>("/news");
}

export async function getNewsById(id: string) {
  return (await request).post<News>("/news/detail", {
    id,
  });
}

export async function translate(q: string) {
  return (await request).post<{ list: Translation[] | null }>("/translate", {
    q,
  });
}
