var betObject = {};
var firstPlay;
var eventHandler = {
  pending: (msg) => {
    betObject.betId = msg.id;
    tweenInitiation(parseFloat(msg.bettingTime));
  },
  active: (msg) => {
    disableBets();
    var lineDurationNumber = document.querySelector("#line-duration-number");
    var lineDurationStatusText = document.querySelector(
      "#line-duration-status-text"
    );
    lineDurationStatusText.innerHTML = "Game has been started, no more bets!";
    lineDurationNumber.style.display = "none";
    startGame(msg);
  }
};

function logout() {
  reqWSC("user.logout", {})
    .then(r => {
      popup.success(JSON.stringify(r));
      deleteCookie("jwtToken");
      window.location = "/";
    })
    .catch(e => {
      popup.error(e.message);
    });
}

function betOnPlayer(btn, playerNumber) {
  selectBetObject("btn-player", btn);
  betObject.playerNumber = playerNumber;
  enableBetButton();
}

function betAmount(btn, amount) {
  selectBetObject("btn-amount", btn);
  betObject.amount = amount;
  enableBetButton();
}

function enableBetButton() {
  if (betObject && betObject.amount && betObject.playerNumber) {
    let btn = document.getElementById('submitBet');
    btn.removeAttribute("disabled");
  }
}

function selectBetObject(className, btn) {
  let previousSelectedButton = document.getElementsByClassName(
    className + "-selected"
  )[0];
  if (previousSelectedButton) {
    previousSelectedButton.classList.remove(className + "-selected");
  }
  if (btn) {
    btn.classList.add(className + "-selected");
  }
}

function finishBet() {
  if (!betObject.playerNumber && !betObject.amount) {
    popup.error("Please choose player and amount!");
    return;
  }
  if (!betObject.playerNumber) {
    popup.error("Please choose player!");
    return;
  }
  if (!betObject.amount) {
    popup.error("Please choose amount!");
    return;
  }
  reqWSC('bet.setBets', betObject)
  .then(r => {
    let selectedPlayer = document.getElementsByClassName("btn-player-selected");
    let selectedAmount = document.getElementsByClassName("btn-amount-selected");
    selectedPlayer[0].classList.add("btn-player-confirmed");
    selectedAmount[0].classList.add("btn-amount-confirmed");
    document.getElementById('balance').innerHTML = parseFloat(document.getElementById('balance').innerHTML) - betObject.amount;
    disableBets();
  })
  .catch(e => {
      popup.error(e.message);
  });
  
}

function disableBets() {
  let selectedPlayer = document.getElementsByClassName("btn-player-selected");
  if (selectedPlayer[0]) {
    selectedPlayer[0].classList.remove('btn-player-selected');
  }
  let selectedAmount = document.getElementsByClassName("btn-amount-selected");
  if (selectedAmount[0]) {
    selectedAmount[0].classList.remove('btn-amount-selected');
  }
  let btns = document.getElementsByClassName("btn");
  let btnsLength = btns.length;
  for (var i = 0; i < btnsLength; i++) {
    btns[i].setAttribute("disabled", true);
  }
}

function enableBets() {
  let btns = document.getElementsByClassName("btn");
  let btnsLength = btns.length;
  for (var i = 0; i < btnsLength; i++) {
    btns[i].removeAttribute("disabled");
  }
  let confirmedPlayer = document.getElementsByClassName("btn-player-confirmed");
  if (confirmedPlayer[0]) {
    confirmedPlayer[0].classList.remove('btn-player-confirmed');
  }
  let confirmedAmount = document.getElementsByClassName("btn-amount-confirmed");
  if (confirmedAmount[0]) {
    confirmedAmount[0].classList.remove('btn-amount-confirmed');
  }
  let btn = document.getElementById('submitBet');
  btn.setAttribute("disabled", true);
}

function tweenInitiation(duration) {
  var lineAnimation = document.querySelector("#line-animation");
  var lineDurationNumber = document.querySelector("#line-duration-number");
  var lineDurationStatusText = document.querySelector(
    "#line-duration-status-text"
  );
  var tween = new TimelineMax({
    paused: false
  });
  tween.to(lineAnimation, duration, {
    force3D: true,
    css: {
        backgroundColor: '#FF0000'
    },
    onComplete: function() {
      
    },
    onStart: function() {
      lineDurationStatusText.innerHTML = "The game will start in: ";
      lineDurationNumber.style.display = "";
      lineDurationNumber.innerHTML = duration;
      selectBetObject("btn-amount");
      selectBetObject("btn-player");
      enableBets();
    },
    onUpdate: function(timeline) {
      let currentProgress = this.progress();
      lineDurationNumber.innerHTML = parseFloat(
        duration - duration * currentProgress
      ).toFixed(2) + ' seconds';
      TweenMax.set(lineAnimation, {
        scaleX: currentProgress,
        transformOrigin: "0px 0px"
      });
    }
  });
}
