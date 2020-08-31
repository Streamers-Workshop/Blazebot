const bannedUsers = [];

// For Generating Random Number
function randomNumber() {
  return Math.random();
}

// Checking for is randomNumber number or not
function isNumeric(num) {
  return !isNaN(num);
}

// Blackjack hand calculating command
function calculateHand(hand) {
  const cardNumber = hand.length;
  let handSize = 0;
  let ace = false;

  for (let i = 0; i < cardNumber; i++) {
    if (hand[i] === 'A') {
      handSize += 1;
      ace = true;
    } else if (hand[i] === 'K' || hand[i] === 'Q' || hand[i] === 'J') {
      handSize += 10;
    } else {
      handSize += parseInt(hand[i], 10);
    }
  }

  if (ace === true && handSize + 10 < 22) {
    handSize += 10;
  }

  return handSize;
}

function checkBanned(uid) {
  if (bannedUsers.includes(uid)) {
    return true;
  }

  return false;
}

module.exports = { randomNumber, isNumeric, calculateHand, checkBanned };