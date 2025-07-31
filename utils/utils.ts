export function getCdnImageUrl (path: string, baseUrl = 'images/aifa') {
  return `https://cdn.aifa.chat/${baseUrl}/${path}`
}


function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

export function guid () {
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()
}