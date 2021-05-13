import fetch from 'isomorphic-fetch';
import colors from 'colors';
import { sendMessage } from './botty.js';

const locations = [
  {
    name: 'Ancaster',
    hippoId: 'w01105',
    storeId: '145',
    serviceId: '1256'
  },
  {
    name: 'Burlington',
    hippoId: 'w253',
    storeId: '125',
    serviceId: '1242'
  },
  {
    name: 'Stoney Creek',
    hippoId: 'w01273',
    storeId: '153',
    serviceId: '1263'
  }
];


async function checkStore(store) {
  const res = await fetch(`https://apipharmacy.telehippo.com/api/c/${store.storeId}/graphql`, {
    "headers": {
      "content-type": "application/json",
    },
    "method": "POST",
    "mode": "cors",
    "body": JSON.stringify({
      query: `{
        searchBookableWorkTimes(
          data: {
            retailerId: ${store.storeId}
            startDate: "2021-05-13 04:00:00"
            endDate: "2022-08-24 03:59:59"
            # day: 4
            serviceId: ${store.serviceId}
          }
        ) {
          bookableDays
          nextAvailableDate
          isAvailable
        }
      }`,
    })
  });
    const data = await res.json();
    return data;
}

export async function checkCostco() {
  for (const store of locations) {
    console.log(colors.yellow(`Checking ${store.name}`));
    const { data } = await checkStore(store);

    if (data.searchBookableWorkTimes.nextAvailableDate) {
      // there is an open date!
      const message = `
💉 ${store.name} Costco Appointment!
${data.searchBookableWorkTimes.nextAvailableDate || ''}
Book Online: https://b.telehippo.com/o/${store.hippoId}
`;
      sendMessage(message, { dev: true });
    }
  }
}




// Notes
/* You can get the Hippo Ids here: https://www.costcopharmacy.ca/assets/json/app.clinics.json
Then with the hippo ID, And get the store Id with this GraphQL Query:
Endpoint: https://apipharmacy.telehippo.com/api/c/145/graphql
query {
  cRetailerWithSetting(data:{slug:"w253"}) {
    data {
      retailer {
        id,name,street,suite,city,state,country,zip,phone,slug,email,timezone,website,startTime,endTime
      }
    },
  }
}

*/
