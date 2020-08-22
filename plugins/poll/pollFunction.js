const Bot = require("../../modules/Bot");

let voteList = [];
let userVoted = [];
let active = false;

function startVote(args) {

    args.forEach(element => {
        voteList.push({ "name": element, "votes": 0 });
    });
    if (voteList.length != 0) {
        active = true;
    }

    return active;
}


function stopVote() {
    var winner = getWinner();
    resetVote();
    return winner;
    return false;
}

function resetVote() {
    active = false;
    voteList = [];
    userVoted = [];
    return;
}

function getList() {
    var list = "";
    voteList.forEach(element => {
        list += `${element.name} | `;
    });
    list = list.substring(0, list.length -3);
    return list;
}

function getWinner() {
    voteList.sort(function(a, b){return b.votes - a.votes});
    //console.log(voteList[0].name);
    return `${voteList[0].name}|${voteList[0].votes}`;
}

function placeVote(vote, user) {
    var voted = false;
    voteList.forEach(element => {
        if(element.name == vote) {
            element.votes++;
            userVoted.push(user);
            voted = true;
        }
    });
    return voted;
}

function isItemInList(item) {
    var inList = false;
    voteList.forEach(element => {
        if(element.name == item) {
            inList = true;
        }
    });
    return inList;
}

function hasUserVoted(user) {
    if (userVoted.includes(user)) {
        return true;
    }
    return false;
}

function isPollActive() {
    return active;
}

module.exports = { startVote, isItemInList , isPollActive, getList, getWinner, resetVote, stopVote, placeVote, hasUserVoted };