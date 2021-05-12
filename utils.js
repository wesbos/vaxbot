export function stringifyCookie(cookies) {
  return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
}
