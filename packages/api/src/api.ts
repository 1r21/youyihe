import request from "@1r21/yyh-request";
import { News, Translation } from "@1r21/yyh-types";

export async function getNews() {
  return request.get<null, { list: News[] }>("/news");
}

export async function getNewsById(id: string) {
  return request.post<null, News>("/news/detail", {
    id,
  });
}

export async function translate(q: string) {
  return request.post<null, { list: Translation[] | null }>("/translate", {
    q,
  });
}
