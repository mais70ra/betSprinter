var betObject = {

};

function logout() {
    reqWSC('user.logout', {})
    .then(r => {
        popup.success(JSON.stringify(r));
        deleteCookie('jwtToken');
        window.location = '/';
    })
    .catch(e => {
        popup.error(e.message);
    });
}

function betOnPlayer(btn, playerNumber) {
    selectBetObject('btn-player', btn);
    betObject.playerNumber = playerNumber;
}

function betAmount(btn, amount) {
    selectBetObject('btn-amount', btn);
    betObject.amount = amount;
}

function selectBetObject(className, btn) {
    let previousSelectedButton = document.getElementsByClassName(className + '-selected')[0];
    if (previousSelectedButton) {
        previousSelectedButton.classList.remove(className + '-selected');
    }
    btn.classList.add(className + '-selected');
}

function finishBet() {
    if (!betObject.playerNumber && !betObject.amount) {
        popup.error('Please choose player and amount!');
        return;
    }
    if (!betObject.playerNumber) {
        popup.error('Please choose player!');
        return;
    }
    if (!betObject.amount) {
        popup.error('Please choose amount!');
        return;
    }
}

function disableAll() {

}

function enableAll() {

}
