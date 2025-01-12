import axios from 'axios';
import Bet from '../models/bet.schema';

function extractBetIdFromText(text: string) {
  const regex = /Bet created with id: (pre-\w+)/;
  const match = text.match(regex);
  console.log(match);
  if (match) {
    return match[1];
  }
  return null;
}

export default async function resolveBet(ctx: any) {
  if (ctx.chat.type === 'private') return;

  const repliedToMessageId = ctx.message.reply_to_message?.message_id;
  console.log(repliedToMessageId);
  if (!repliedToMessageId) {
    ctx.reply('Please reply to the message sent by the bot to resolve the bet.');
    return;
  }

  const bet = await Bet.findOne({ chatId: repliedToMessageId });
  if (!bet) {
    ctx.reply('Invalid bet ID.');
    return;
  }

  if (bet.resolved) {
    ctx.reply('This bet has already been resolved.');
    return;
  }

  // Use Perplexity API to verify the outcome

  // const correctOption = parseInt(perplexityResponse.data.choices[0].message.content);
  // if (isNaN(correctOption) || correctOption < 0 || correctOption >= bet.options.length) {
  //   ctx.reply('Failed to verify the bet outcome. Please try again later.');
  //   return;
  // }

  const winners = [];
  const prizePool = bet.minAmount * bet.participants.length;
  const winnerPayout = prizePool / winners.length;

  //   for (const winner of winners) {
  //     const wallet = await UserWallet.findOne({ username: winner });
  //     if (wallet) {
  //       await crossmint.transfer({
  //         amount: winnerPayout,
  //         from: process.env.BOT_WALLET_ADDRESS!,
  //         to: wallet.address,
  //         tokenId: 'usdc'
  //       });
  //     }
  //   }

  bet.resolved = true;
  await bet.save();
  const correctOption = true;
  // ctx.reply(
  //   `Bet resolved. The correct option was: ${bet.options[correctOption]}\nWinners: ${winners.join(
  //     ', '
  //   )}\nEach winner receives: ${winnerPayout} USDC`
  // );
  ctx.reply('chicken');
}
