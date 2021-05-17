import colors from 'colors';
import fetch from 'isomorphic-fetch';
import { sendMessage } from './botty.js';
import {provinces} from './fetch.js';
import { findLocationById, locations } from './locations.js';

const province = provinces.ON;
let notifications = [];

async function checkForAppointments(location) {
  const url = `https://portal.healthmyself.net/${province.slug}/guest/booking/${province.appointmentType}/schedules?locId=${location}`
  const res = await fetch(url, {
    headers: {
      cookie: province.cookie
    }
  });

  const isRedirected = res.url.includes('login');
  if (res.status === 200 && !isRedirected) {
    // console.log(res);
    const reply = await res.json();
    if (reply.data?.length && reply.data[0].available) {
      console.log('GOT ONE!!!')
      const existingNotification = notifications.find(notif => (notif.storeNumber === store.storeNumber && (Date.now() - (notif.date < 86400000))));

      if (!existingNotification) {
        notifications.push({ storeNumber: store.address, date: Date.now() });
        console.log(toLog)
        await logAvailableVaccine(reply.data[0]);
      } else {
        console.log('Already Notified! Skipping', store.address);
      }
    }
  } else {
    res.status !== 200 && console.log(res.status, res.statusText, res.url);
    console.log('Appointments are likely closed');
  }
}


async function logAvailableVaccine(payload) {
  const date = new Date(payload.next_date * 1000);
  const formatter = new Intl.DateTimeFormat('en-CA', { dateStyle: 'long', timeStyle: 'short' });
  const toLog = `💉  ${formatter.format(date)}
WalMart ${payload.location}
${payload.address}
${payload.city}, ${payload.province}
☎️ ${payload.phone}
Book Online: https://portal.healthmyself.net/${province.slug}/forms/${province.code}
  `;
  console.log(toLog)
  await sendMessage(toLog);
}

export async function checkWalmart() {
  for (const location of province.locations) {
    const locationInfo = findLocationById(location);
    console.log(colors.yellow('Checking Location:'), locationInfo.loc_name);
    await checkForAppointments(location);
    console.log(colors.green('Done Location:'), locationInfo.loc_name);
  }
}

