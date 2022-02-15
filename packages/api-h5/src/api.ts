import request from "@1r21/request-h5";
import type { News, Translation } from "./types";

export async function getNews() {
  return request.get<{
    list: News[];
  }>("/news");
}

export async function getNewsById(id: string) {
  return request.post<News>("/news/detail", {
    id
  });
}

export async function translate(q: string) {
  return request.post<{
    list: Translation[] | null;
  }>("/translate", {
    q
  });
}