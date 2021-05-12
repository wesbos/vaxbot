import cron from 'node-cron';
import colors from 'colors';
import { checkWalmart } from './walmart.js';
import { checkShoppers } from './shoppers.js';
import { sendMessage } from './botty.js';

console.log(colors.green(`Booting up!`));
sendMessage('Booting up!', { disable_notification: true, dev: true });

async function go() {
  sendMessage('Running a check', { disable_notification: true, dev: true });
  console.log(colors.bold('running the checks!'))
  await checkWalmart();
  await checkShoppers()
}

cron.schedule('*/5 * * * *', go);
