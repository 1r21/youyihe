type Http = typeof import('@1r21/request') | typeof import('@1r21/request-wx')

async function loadHttp() {
  let http = <Http>{};
  if (window) {
    // h5
    http = await import('@1r21/request').catch()
  } else {
    // wechat miniprogram
    http = await import('@1r21/request-wx').catch()
  }
  return http.default
}

// return Promise
export default loadHttp()
