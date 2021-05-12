import { config } from 'dotenv';
config();
import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

const chatId = process.env.CHAT_ID;
const devChatId = process.env.DEV_CHAT_ID;

export function sendMessage(message, options = {}) {
  bot.sendMessage(options.dev ? devChatId : chatId, message, options);
}
