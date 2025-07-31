export function getCdnImageUrl (path: string, baseUrl = 'images/aifa') {
  return `https://cdn.aifa.chat/${baseUrl}/${path}`
}