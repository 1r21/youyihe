type Http = typeof import('@1r21/request-wx') | typeof import('@1r21/request') 

async function loadHttp() {
  let http = <Http>{};
  if (!window && wx?.request) {
    http = await import('@1r21/request-wx')
  } else {
    http = await import('@1r21/request')
  }
  return http.default
}

// return Promise
export default loadHttp()
