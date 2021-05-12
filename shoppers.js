import fetch from 'isomorphic-fetch';
import { sendMessage } from './botty.js';

const lat = 43.259768;
const lng = -79.872597;

const url = `https://www1.shoppersdrugmart.ca/en/store/getstores?latitude=${lat}&longitude=${lng}&radius=45&unit=km&lookup=nearby&filters=RSV-CVW%3ATRUE%2CRSV-COV%3ATRUE&rpp=100&isCovidShotSearch=true&getCovidShotAvailability=true`;

export async function checkShoppers() {
  const res = await fetch(url);
  if(res.status !== 200)  {
    console.log('Error', res.statusText);
    return;
  }

  const { results } = await res.json();
  for(const store of results) {
    if (store.FlusShotAvailableNow) {
      const toLog = `
💉 Shoppers: ${store.name} - ${store.storeNumber}
☎️ ${store.phone} - Press 3 for Pharmacy
${store.city}
${store.address}
${store.postalCode}
      `;
      console.log(toLog)
      await sendMessage(toLog);
    } else {
      console.log('❌', store.storeNumber, store.name)
    }
  }
}



