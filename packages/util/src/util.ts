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
  // miniprogram
  rawStyle: string;
  style: {
    color?: string;
    fontWeight?: string
  }
  value: string;
};

// rawhtml = null, default value is invalid
export function parseText(rawhtml: string): Text[] {
  const textStyle = {
    color: '#555',
  }

  const titleStyle = {
    fontWeight: 'bolder'
  }

  const nullText: Text = {
    idx: 1,
    type: 'text',
    rawStyle: deconstructStyle(textStyle),
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
          rawStyle: deconstructStyle(titleStyle),
          style: titleStyle,
          value: item.replace(tRe, "$1"),
        };
      }
      return {
        idx: index,
        type: "text",
        rawStyle: deconstructStyle(textStyle),
        style: textStyle,
        value: item.replace(/<p[^>]*>(.*?)<\/p>/g, "$1"),
      };
    });
  }
  return [nullText];
}

// obj to string, {fontWeight: 'bolder'} => "font-weight: bolder"
function deconstructStyle(styleObj: { [styleName: string]: string }) {
  return Object.keys(styleObj).reduce((acc, style) => {
    const styleVal = styleObj[style] + ';'
    const transformStyleKey = style.replace(/([A-Z])/g, "-$1").toLowerCase();
    acc += `${transformStyleKey}:${styleVal}`
    return acc;
  }, '');
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