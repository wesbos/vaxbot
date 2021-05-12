// Most of this code is unnessecary because The cookies last pretty long. You can just copy them out of dev tools
import fetch from 'isomorphic-fetch';
import setCookie from 'set-cookie-parser';
import { stringifyCookie } from './utils.js';
import colors from 'colors';

const csrfRegex = new RegExp(`token" content="(.*)"`);

const provinces = {
  ON: {
    code: 'Dpd',
    slug: 'walmarton',
    formId: '',
    appointmentType: 4752,
    locations: [
      1121,
      1151,
      1185,
      1079,
      1146,
      1092,
      1162,
      1016,
      1168
    ],
    location: 1121, // somehwere in ontario
    cookie: "locale=eyJpdiI6ImQ5VXJFUHBVYXpOTk5sM3hPT1dsSEE9PSIsInZhbHVlIjoicmIwczlQeTlrYUVLM3VZVU5KMmhGZz09IiwibWFjIjoiYmRjMDAyNGU2YWIwYTVmMTQ5ZjM2ODNkMzZlZTU2OWM1OGY5MTgzMDY5MThmOWJmODczOTg0ZWQ0MzE0ZDVkMiJ9; XSRF-TOKEN=eyJpdiI6IlN6SUJKM2ozRkJXTXBJdlYxNXhmZHc9PSIsInZhbHVlIjoiaFF4akhsZk94MDhlXC85azEwOWQyZVwvQlEyRlRBc3U1Y1NHK3UxNmQyZmd6Y0Z6UTBBTGQ4ck5wWjROZlBjUnVxIiwibWFjIjoiZTUwOTJhMjFhNzI3OWM4MTg5MzdjNmNjZDQxYjk3MDhlZmMxYzI5NTExNTA4NDRkZjViMzI0NWFkYWViYjU5ZSJ9; hm_session=eyJpdiI6InFJOUpmWUY0UVN1Z2JQcUU1dGJpV3c9PSIsInZhbHVlIjoiN3ZTSm9Wb3JjS2Q4YlRaQ05OTmJla2hqd3FjYzdpSTdwNlV0VVluTkI1OU1uSVBuVnYyOXBlQ3dDeE1BcTRPTSIsIm1hYyI6Ijg4YWUyYzYzN2ZkYzdmMTMxMDE2ZjcyYjVkNTEyODlhOWVjNzU0OTRlOTIzYmYyN2I4OWQyNzkxYjk3YzM4MzUifQ%3D%3D; io=n2nLY93HacAdoXO3CFn4"
  },
  SK: {
    code: 'n5n',
    slug: 'walmartsk',
    formId: '42642c55-8c81-4b57-9e6b-17731dbb4477',
    appointmentType: 4781,
    locations: [
      // An array of locations to watch
      985,
      1290,
      1295,
      1300,
      1302,
      1303,
      1304,
    ],
    location: 1297, // Prince Albert
    cookie: `locale=eyJpdiI6InBWVTVFVGUwYjRRNFwvbmN1VXJzaFJ3PT0iLCJ2YWx1ZSI6ImdKU3l2UXZvKytoNlhUbVwvZENYTDh3PT0iLCJtYWMiOiJkMGRlMjFiY2M1ZmYyNjg4YTZkNzY5MGZmY2JkYTAyYWUwOTNmMTE0ZDY3ZTlhZmZhNDExZmI5MTkxZWJmMDMzIn0%3D; io=NFeoQ4ysTF4o-x-nAwTY; XSRF-TOKEN=eyJpdiI6IklYNWdrTDl5XC8xb01FMWhiOVFUTnRRPT0iLCJ2YWx1ZSI6Ik9jcnd2bVV5NzI2Q21vVVJNSFJjaTZVZEZkbzlPdVwvZFptWFkxdUZZeGU4dUQzUjJsalpjcXNcL2xPR1I5Q2lxTyIsIm1hYyI6IjVkNzM4YjQ1NmNlZmI4MDg0NjFjYzJiMzVjMzdlMmU2MzA5NWUzY2Y0NGU0YTJjZTFjZjFmOWNlZjQ1NDA4MzQifQ%3D%3D; hm_session=eyJpdiI6IlBmcFFcL2RcL1dMVU5DT2VMeEVzR0k0dz09IiwidmFsdWUiOiJXbGpzSlhcL042SzZDamlhekU4SEoxNHptM3ZiOVBMUVwvNjJ6UkhJbmJSUXl4Y21iZmJDZnBHVlZndFJxSTVpUUsiLCJtYWMiOiJlN2VhMGZiOGI4OGJjODA3MDVjOTZkMTE5YzQ3ODRkZjYxYjk5ZWNiMGRiMDFlNDBiZDAwMWE3NDhlMWU0OTkxIn0%3D`
  },
  AB: {
    code: 'a66',
    slug: 'walmartab',
    formId: '',
    appointmentType: ''
  },
  MB: {
    code: 'zye',
    slug: 'walmartmb',
    appointmentType: 4772,
    formId: '',
    location: 1210, // Thompson
    location: 1216, // Flin Flon
    cookie: "locale=eyJpdiI6ImQ5VXJFUHBVYXpOTk5sM3hPT1dsSEE9PSIsInZhbHVlIjoicmIwczlQeTlrYUVLM3VZVU5KMmhGZz09IiwibWFjIjoiYmRjMDAyNGU2YWIwYTVmMTQ5ZjM2ODNkMzZlZTU2OWM1OGY5MTgzMDY5MThmOWJmODczOTg0ZWQ0MzE0ZDVkMiJ9; io=L3VvWyoL-OaBn1w0A4dQ; XSRF-TOKEN=eyJpdiI6ImdLVkEwY2JYVFpxTTZZaFhia2l4eWc9PSIsInZhbHVlIjoibDRMK1oxQXVRTHExS21pNTIrU3BHRFBneDhFdnhMV3BrWHh4VlBwcWZxSms1RXFXbGNkcWRBS1F1dVNlRnZ4RSIsIm1hYyI6IjFjMGExNjBlNjE4MmE3NDBhMTJiYzE1NTliZTdmZjQ1YjczY2EzYzU2ZDMzYjNiNWU4YTM4MzVjYWQ5OTc0NmEifQ%3D%3D; hm_session=eyJpdiI6InU4dXBXMlRuZzhnTkdMT1wvSGdGR3NBPT0iLCJ2YWx1ZSI6InBwaGp5dXNwbmtcL1h5QWJ5Y0JVU3RhZlZFVThzUEpSVlBOTTMzWjFoOCszMzVTNW1rTXhkMkJVejQ1cjRLeWUzIiwibWFjIjoiYTRiZTRjN2RmMzc1Y2NjMGEyMDViMTEwYWE4MDg4OGRkOWFjNTlmMTZjMGQ2NjJmM2M4ZjRjOGM5YWViZjRjMCJ9"
  },
  BC: {
    code: 'EkN',
    slug: 'walmartbc',
    formId: '',
    appointmentType: ''
  },

}

const province = provinces.SK;


// 1. Visit https://portal.healthmyself.net/${province.slug}/forms/Dpd to get 1st cookie
// 2. POST  Acceptance to questions to https://portal.healthmyself.${province.slug}/walmarton/forms/Dpd/responses with cookie from step 1
// 3. Get cookie from step 2 and "click" get here to book your appt
// 4. Get cookie from step 3 and click on First Dose
// 5. Search for URLS

// https://portal.healthmyself.net/${province.slug}/

// Step 1: Get Cookie
async function getFirstCookies() {
  const url = `https://portal.healthmyself.net/${province.slug}/forms/${province.code}`;
  console.log(colors.yellow('1. Fetching First Cookie.'), url);
  const res = await fetch(url);
  var combinedCookieHeader = res.headers.get('Set-Cookie');
  var splitCookieHeaders = setCookie.splitCookiesString(combinedCookieHeader)
  var cookies = setCookie.parse(splitCookieHeaders);
  // Gotta grab the CSRF token here
  const html = await res.text();
  const [, token] = html.match(csrfRegex);
  console.log(colors.green('Got the csrf token:'), token);
  // Add the CSRF to the cookies so we can pull it out next step
  cookies.push({ name: 'CSRF', value: token, path: '/', secure: true, httpOnly: true });
  return cookies;
}

// Step 2: Second Cookie, submit "Yes" to all questions
async function getSecondCookies(firstCookies) {
  const url = `https://portal.healthmyself.net/${province.slug}/forms/${province.code}/responses`;
  // Accepting the questions
  const cookieString = stringifyCookie(firstCookies);
  const XSRF = firstCookies.find(cookie => cookie.name.includes('XSRF'));
  const CSRF = firstCookies.find(cookie => cookie.name.includes('CSRF'));
  console.log(colors.yellow('2. Answering Yes to the questions (POST)'), url, CSRF.value)
  const res = await fetch(url, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json;charset=UTF-8",
      "x-xsrf-token": XSRF.value,
      "x-csrf-token": CSRF.value,
      "cookie": cookieString
    },
    "referrer": `https://portal.healthmyself.net/${province.slug}/forms/${province.code}`,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"question2\":true,\"question3\":true}",
    "method": "POST",
    "mode": "cors"
  });
  var combinedCookieHeader = res.headers.get('Set-Cookie');
  var splitCookieHeaders = setCookie.splitCookiesString(combinedCookieHeader)
  var cookies = setCookie.parse(splitCookieHeaders);
  console.log(colors.green('\s\s Back with the answer response:'), await res.text());
  return cookies;
}

async function getThirdCookies(cookies) {
  const url = `https://portal.healthmyself.net/${province.slug}/guest/booking/form/${province.formId}`;
  const cookieString = stringifyCookie(cookies);

  console.log(colors.yellow('3. Clicking on "click here to book your appointment"'), url);
  const res = await fetch(url, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9,fr;q=0.8,it;q=0.7,nb;q=0.6,la;q=0.5",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": cookieString,
    },
    "referrer": `https://portal.healthmyself.net/${province.slug}/forms/${province.code}`,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "method": "GET",
    "mode": "cors"
  });

  var combinedCookieHeader = res.headers.get('Set-Cookie');
  var splitCookieHeaders = setCookie.splitCookiesString(combinedCookieHeader)
  var cookies = setCookie.parse(splitCookieHeaders);
  // Get the CSRF Token here for the next step
  console.log(colors.green('\s\s Back from clicking on "Click here for your appt"'))
  const html = await res.text();
  // Add the CSRF to the cookies so we can pull it out next step
  const [, token] = html.match(csrfRegex);
  console.log(colors.green('Got the csrf token:'), token);
  cookies.push({ name: 'CSRF', value: token, path: '/', secure: true, httpOnly: true });
  return cookies;
}

// Step 4 Get Locations Cookie
async function getFourthCookies(cookies) {
  console.log(colors.yellow('4. Clicking on "First dose of COVID-19 Vaccination"'));
  const cookieString = stringifyCookie(cookies);
  const XSRF = cookies.find(cookie => cookie.name.includes('XSRF'));
  const CSRF = cookies.find(cookie => cookie.name.includes('CSRF'));
  console.log(CSRF);
  const res = await fetch(`https://portal.healthmyself.net/${province.slug}/guest/booking/type/${province.appointmentType}/locations`, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9,fr;q=0.8,it;q=0.7,nb;q=0.6,la;q=0.5",
      "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-hm-client-timezone": "America/Toronto",
      "x-requested-with": "XMLHttpRequest",
      "x-xsrf-token": XSRF.value,
      "x-csrf-token": CSRF.value,
      "cookie": cookieString
    },
    "referrer": `https://portal.healthmyself.net/${province.slug}/guest/booking/form/${province.formId}`,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
  });
  var combinedCookieHeader = res.headers.get('Set-Cookie');
  var splitCookieHeaders = setCookie.splitCookiesString(combinedCookieHeader)
  var cookies = setCookie.parse(splitCookieHeaders);
  console.log('Back from Clicking the booking type');
  return cookies;
}

// Step 4: Check for appointments
async function checkPharmacy(cookies) {
  const cookieString = stringifyCookie(cookies);
  const url = `https://portal.healthmyself.net/${province.slug}/guest/booking/${province.appointmentType}/schedules?locId=${province.location}`;
  console.log(colors.yellow('4. Getting the Pharmacy Availability'), url)
  const res = await fetch(url, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "cookie": cookieString,
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
  });
  const data = await res.text();
  console.log(data)
}


// startSession();
// go();
// getFirstCookies();

async function checkForAppointment() {
  const firstCookies = await getFirstCookies();
  const secondCookies = await getSecondCookies(firstCookies);
  const thirdCookies = await getThirdCookies(secondCookies);
  const fourthCookies = await getFourthCookies(thirdCookies);
  const appointments = await checkPharmacy(fourthCookies);
}

// checkForAppointment();

export { provinces }
