const TelegramBot = require('node-telegram-bot-api');

const token = '5672392601:AAHXhjeA4b5aQmM4OviUl2HSCRandfSEHiw';

const bot = new TelegramBot(token, { polling: true });

const chats = {};

const gameOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '1', callback_data: '1' },
        { text: '2', callback_data: '2' },
        { text: '3', callback_data: '3' },
      ],
      [
        { text: '4', callback_data: '4' },
        { text: '5', callback_data: '5' },
        { text: '6', callback_data: '6' },
      ],
      [
        { text: '7', callback_data: '7' },
        { text: '8', callback_data: '8' },
        { text: '9', callback_data: '9' },
      ],
      [{ text: '0', callback_data: '5' }],
    ],
  },
};

const againOptions = {
  reply_markup: {
    inline_keyboard: [[{ text: 'Играть еще раз', callback_data: '/again' }]],
  },
};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Сейчас будет игра "Угадай цифру"');
  const randomNumber = Math.round(Math.random() * 10);
  chats[chatId] = randomNumber;

  await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Приветствие' },
    { command: '/game', description: 'Игра "Угадай игру"' },
  ]);

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    // const chatId = msg.chat.id;

    if (text === '/start') {
      return bot.sendMessage(chatId, 'Ну здарова');
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return await bot.sendMessage(chatId, 'Извини, но я тебя не понимаю (такой команды нет)');
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return await bot.sendMessage(chatId, `Ты угадал, это - ${chats[chatId]}`, againOptions);
    } else {
      return await bot.sendMessage(
        chatId,
        `Ты не угадал, бот загадал - ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
