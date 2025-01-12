import { extractBetDetails } from '../utils/gemini';
import Bet from '../models/bet.schema';

export default async function createBet(ctx) {
  const input =
    ctx.message.text.split('/bet')[1]?.trim() ||
    ctx.message.text.split(`@predofun_bot`)[1]?.trim() ||
    ctx.message.text.trim();
  if (!input) {
    ctx.reply(
      'To create a bet, use natural language to describe the bet, including details like the bet amount and end time. For example: "Create a bet on whether it will rain tomorrow, minimum bet 5 USDC, ending in 24 hours"'
    );
    return;
  }
  if (ctx.chat.type === 'private') {
    ctx.reply('You cannot create a bet in a private chat. Please try again in a group chat.');
    return;
  }

  const { object: betDetails } = await extractBetDetails(input);
  console.log(betDetails);
  const betImages = [
    'https://res.cloudinary.com/dbuaprzc0/image/upload/v1735008150/predo/nhnripvf9walquidrtnt.gif',
    'https://res.cloudinary.com/dbuaprzc0/image/upload/v1735008150/predo/szxakvkwzdxzkti4yy8g.gif',
    'https://res.cloudinary.com/dbuaprzc0/image/upload/v1735006898/predo/aom8sxegzlihtr6obvuk.gif',
    'https://res.cloudinary.com/dbuaprzc0/image/upload/v1735006898/predo/twa2ixbn7coea3icxp1c.gif',
    'https://res.cloudinary.com/dbuaprzc0/image/upload/v1735008150/predo/admfwfzvisnwclxg9bfi.gif',
    'https://res.cloudinary.com/dbuaprzc0/image/upload/v1735008150/predo/h51lph81n0uhrl1p4vkd.gif',
    'https://res.cloudinary.com/dbuaprzc0/image/upload/v1735006898/predo/obljk4tsuoinqlfz3i56.gif'
  ];
  const bet = {
    betId: `pre-${Math.random().toString(36).substring(2, 4)}${Math.random()
      .toString(36)
      .substring(2, 5)
      .toLowerCase()}`,
    groupId: ctx.chat.id,
    title: betDetails.title,
    options: betDetails.options,
    image: betImages[Math.floor(Math.random() * betImages.length)],
    minAmount: betDetails.minAmount,
    endTime: new Date(betDetails.endTime)
  };
  console.log(bet);
  const message = await ctx
    .replyWithPhoto(bet.image, {
      caption: `Bet created with id: ${bet.betId.toLowerCase()}\nGo wager now at: https://t.me/predofun_bot/predofun?startapp=${
        bet.betId
      }`
    })
    .then(async (message) => {
      console.log(message.message_id);
      await Bet.create({ ...bet, chatId: message.message_id });
      return message;
    });
  await ctx.pinChatMessage(message.message_id);
}
