const fs = require('fs');
const path = require('path');
const Bot = require('./../../../../modules/Bot.js');
const deck = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'J', 'K', 'Q'];
var cFunctions = null;
var userInfo = null;

function reset(data)
{
  userInfo[data.user].playingBlackjack = false;
  userInfo[data.user].blackjackDealerHand = [];
  userInfo[data.user].blackjackHand = [];
  userInfo[data.user].blackjackBet = 0;
}
function hit(client, data)
{
  let handString = ' ';
  let dealerHandString = ' ';
  if (userInfo[data.user].playingBlackjack === false) {
    return;
  }
  const playerBetH = userInfo[data.user].blackjackBet;

    userInfo[data.user].blackjackHand.push(deck[Math.floor(cFunctions.randomNumber() * 11)]);
    const playerTotalH = cFunctions.calculateHand(userInfo[data.user].blackjackHand);

    for (let n = 0; n < userInfo[data.user].blackjackHand.length; n++) {
      handString += `${userInfo[data.user].blackjackHand[n]}, `;
    }

    client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.new_hand", {
      handString : handString,
      playerTotalH : playerTotalH
    }));

    if (playerTotalH > 21) {
      client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.you_lost"));
      reset(data);
    }

    else if (playerTotalH === 21) {
      let dealerTotalH = cFunctions.calculateHand(userInfo[data.user].blackjackDealerHand);
      while (dealerTotalH < 17) {
        userInfo[data.user].blackjackDealerHand.push(deck[Math.floor(cFunctions.randomNumber() * 11)]);
        dealerTotalH = cFunctions.calculateHand(userInfo[data.user].blackjackDealerHand);
      }

      for (let nn = 0; nn < userInfo[data.user].blackjackDealerHand.length; nn++) {
        dealerHandString += `${userInfo[data.user].blackjackDealerHand[nn]}, `;
      }

      client.sendMessage(Bot.translate( "plugins.casino.plugins.blackjack.dealerfinishdraw", {
          dealerHandString: dealerHandString,
          dealerTotalH: dealerTotalH
        }
      ));

      if (dealerTotalH > 21) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.dealer_bust",
        {
          playerBetH: (playerBetH* 2)
        }
        ));
        userInfo[data.user].points += playerBetH * 2;
        reset(data);
      }
      if (dealerTotalH === playerTotalH) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.draw"));
        userInfo[data.user].points += playerBetH;
        reset(data);
      }
      if (playerTotalH > dealerTotalH) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.win",
        {
          playerBetH: (playerBetH * 2)
        }));
        userInfo[data.user].points += playerBetH * 2;
        reset(data);
      }
      if (playerTotalH < dealerTotalH) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.you_lost"));
        reset(data);
      }
    }
}
function stand(client, data)
{
    if (userInfo[data.user].playingBlackjack === false) {
      return;
    }

    const playerBetS = userInfo[data.user].blackjackBet;

    const playerTotalS = cFunctions.calculateHand(userInfo[data.user].blackjackHand);

    let dealerTotalS = cFunctions.calculateHand(userInfo[data.user].blackjackDealerHand);
    while (dealerTotalS < 17) {
      userInfo[data.user].blackjackDealerHand.push(deck[Math.floor(cFunctions.randomNumber() * 11)]);
      dealerTotalS = cFunctions.calculateHand(userInfo[data.user].blackjackDealerHand);
    }

    var dealerHandString = ' ';
    for (let nnn = 0; nnn < userInfo[data.user].blackjackDealerHand.length; nnn++) {
      dealerHandString += `${userInfo[data.user].blackjackDealerHand[nnn]}, `;
    }

    client.sendMessage(
      Bot.translate( "plugins.casino.plugins.blackjack.dealerfinishdraw", {
        dealerHandString: dealerHandString,
        dealerTotalH: dealerTotalS
      }));

    if (dealerTotalS > 21) {
      playerBetH = playerBetH * 2;
      client.sendMessage(
        Bot.translate("plugins.casino.plugins.blackjack.dealer_bust",
        {
          playerBetH: playerBetH
        }
      ));
      userInfo[data.user].points += playerBetS;
      reset(data);
    } else if (dealerTotalS === playerTotalS) {
      client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.draw"));
      userInfo[data.user].points += playerBetS;
      reset(data);
    } else if (playerTotalS > dealerTotalS) {
      client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.win",
      {
        playerBetH: (playerBetH * 2)
      }));
      userInfo[data.user].points += playerBetS * 2;
      reset(data);
    } else if (playerTotalS < dealerTotalS) {
      client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.you_lost"));
      reset(data);
    }
}
function setup(client, data)
{
  // The entered bet is immediately decreasing and saved.
  const playerBet = parseInt(data.args[0], 10);
  userInfo[data.user].blackjackBet = playerBet;
  userInfo[data.user].points = parseInt(userInfo[data.user].points) - parseInt(playerBet);
  userInfo[data.user].playingBlackjack = true;

   // Hands are dealt
   for (let n = 0; n < 2; n++) {
    userInfo[data.user].blackjackHand.push(deck[Math.floor(cFunctions.randomNumber() * 11)]);
    userInfo[data.user].blackjackDealerHand.push(deck[Math.floor(cFunctions.randomNumber() * 11)]);
  }

  // Calculating hands
  const playerTotal = cFunctions.calculateHand(userInfo[data.user].blackjackHand);
  const dealerTotal = cFunctions.calculateHand(userInfo[data.user].blackjackDealerHand);

  client.sendMessage(
    (Bot.translate("plugins.casino.plugins.blackjack.player_hand"),
   {
     cards: userInfo[data.user].blackjackHand.join(","),
     total: playerTotal
   } 
  ));
  client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.dealer_hand",
  {
    dealer_hand: userInfo[data.user].blackjackDealerHand[0]
  }));
  client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.instructions"
));

  // If it is 21, won immediately
  if (playerTotal === 21) {
    client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.player_blackjack",
    {
      playerBet:playerBet
    }));
    userInfo[data.user].points = parseInt(userInfo[data.user].points) + parseInt(playerBet * 3);
    reset(data);
  }
  else if (dealerTotal === 21)
  {
    client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.dealer_blackjack"));
    reset(data);
  }
}

module.exports = {
    name: 'blackjack', // Name of the Plugin
    description: "Blackjack game plugin",
    author: "Original by Ulash. Updated by Krammy",
    license: "Apache-2.0",
    command: 'blackjack', // This is the Command that is typed into Chat!
    permissions: [], // This is for Permissisons depending on the Platform.
    cooldown: 5, // this is Set in Seconds, how long between the next usage of this command.
    execute(client, data) {

    if (data.args[0] === 'hit')
    {
      hit(client, data);
    }
    else if (data.args[0] === 'stand')
    {
      stand(client, data);
    }
    else{

      //Check if user banned from playing
      if (cFunctions.checkBanned(data.user) === true) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.banned"));
      }

      //Check if user already playing
      else if (userInfo[data.user].playingBlackjack === true) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.progress"));
      }

      // Waiting for like to enter a bet amount like !blackjack 1000
      else if (cFunctions.isNumeric(data.args[0]) === false) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.error_bet"));
      }
      //Check points
      else if (parseInt(data.args[0], 10) > userInfo[data.user].points) {
        client.sendMessage(Bot.translate("plugins.casino.plugins.blackjack.new_hand"));
      }
      //Start Game
      else
      {
        setup(client,data); 
      }
      
    }
    },
    activate() {
      userInfo = require(path.join(Bot.root, 'data/users/users.json'));
      cFunctions = require('../../cFunctions.js');
      Bot.log(Bot.translate("plugins.casino.plugins.blackjack.activated"))
    },
    deactivate() {
      userInfo = null;
      cFunctions = null;
      Bot.log(Bot.translate("plugins.casino.plugins.blackjack.deactivated"))
    }
  };
  