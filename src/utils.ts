import { News, translate } from "./api";
import entities from "./entities";

export function formatPlayTime(seconds: number) {
  if (!seconds) {
    return "00:00";
  }
  const min = parseInt(String(seconds / 60));
  const sec = parseInt(String(seconds % 60));
  return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
}

export function changeTitle(title: string) {
  const { env, biz } = window.dd;
  if (env.platform !== "notInDingTalk") {
    biz.navigation.setTitle({
      title,
    });
  } else {
    document.title = title;
  }
}

export type Text = {
  idx: number;
  type: "title" | "text";
  style: {
    color?: string;
    fontWeight?: string
  }
  value: string;
};

// rawhtml = null, default value is invalid
export function parseText(rawhtml: News["transcript"]): Text[] {
  const textStyle = {
    color: '#555',
  }

  const titleStyle = {
    fontWeight: 'bolder'
  }

  const nullText: Text = {
    idx: 1,
    type: 'text',
    style: textStyle,
    value: "Not prepare yet."
  }

  if (!rawhtml) {
    return [nullText]
  }

  let content = rawhtml.replace(/(\r\n|\n|\r)/gm, "");

  for (let key in entities) {
    const re = new RegExp("&" + key + ";", "g");
    content = content.replace(re, entities[key]);
  }
  const hReg = /<p[^>]*>(.*?)<\/p>/gm;
  const texts = content.match(hReg);

  if (texts) {
    return texts.map((item, index) => {
      if (item.includes("</strong>")) {
        const tRe = /<p><strong[^>]*>(.*?)<\/strong><\/p>/g;
        return {
          idx: index,
          type: "title",
          style: titleStyle,
          value: item.replace(tRe, "$1"),
        };
      }
      return {
        idx: index,
        type: "text",
        style: textStyle,
        value: item.replace(/<p[^>]*>(.*?)<\/p>/g, "$1"),
      };
    });
  }
  return [nullText];
}

export function throttle(fn: Function, delay = 300) {
  let last = Date.now();
  return (...args: any) => {
    const now = Date.now();
    if (now - last >= delay) {
      fn(...args)
      last = Date.now()
    }
  }
}

export function getMousePos(e: MouseEvent) {
  const { x, y } = e;
  const selection = window.getSelection();
  if (selection) {
    const range = selection.getRangeAt(0);
    const txt = String(range);
    return {
      x,
      y,
      sectionText: txt,
    };
  }
}

export async function doTranslate(
  texts: { type: string; value: string; trans?: string }[],
  text: string,
  trans: string | undefined
) {
  if (trans) {
    return texts.map((item) => {
      if (item.value === text) {
        item.trans = "";
        return item;
      }
      return item;
    });
  } else {
    const { list } = await translate(text);
    if (list && list.length > 0) {
      const [first] = list;
      return texts.map((item) => {
        if (item.value === text) {
          item.trans = first.dst;
          return item;
        }
        return item;
      });
    }
  }
}