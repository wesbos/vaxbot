import fetch from 'isomorphic-fetch';
import { sendMessage } from './botty.js';

// Cache notifications
let notifications = [];

const lat = 43.259768;
const lng = -79.872597;

const url = `https://www1.shoppersdrugmart.ca/en/store/getstores?latitude=${lat}&longitude=${lng}&radius=45&unit=km&lookup=nearby&filters=RSV-CVW%3ATRUE%2CRSV-COV%3ATRUE&rpp=100&isCovidShotSearch=true&getCovidShotAvailability=true`;

export async function checkShoppers() {
  // Clear notifications that are more than 2 hours old

  const res = await fetch(url);
  if(res.status !== 200)  {
    console.log('Error', res.statusText);
    return;
  }

  const { results } = await res.json();
  for(const store of results) {
    // find existing notification
    const existingNotification = notifications.find(notif => notif.storeNumber === store.storeNumber);
    const hasAlreadyAlerted = existingNotification && (Date.now() - existingNotification.date < 7200000); // 2 hours
    if (store.FlusShotAvailableNow) {
      const toLog = `
💉 Shoppers: ${store.name} - ${store.storeNumber}
☎️ ${store.phone} - Press 3 for Pharmacy
${store.city}
${store.address}
${store.postalCode}
      `;
      // Note that we just Notified about it
      if (!hasAlreadyAlerted) {
        notifications.push({ storeNumber: store.storeNumber, date: Date.now() });
        console.log(toLog)
        await sendMessage(toLog, { dev: true });
      } else {
        console.log('Already Notified! Skipping', store.storeNumber);
      }
    } else {
      console.log('❌', store.storeNumber, store.name)
    }
  }
}
