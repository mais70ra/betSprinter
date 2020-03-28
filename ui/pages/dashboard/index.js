var betObject = {};
var duration = 0;
var eventHandler = {
  pending: (msg) => {
    duration = parseFloat(msg.bettingTime);
    tween.restart();
  },
  active: (msg) => {
    disableBets();
    startTheGame(msg.winner, msg.gameDuration);
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
}

function betAmount(btn, amount) {
  selectBetObject("btn-amount", btn);
  betObject.amount = amount;
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
  disableBets();
}

function disableBets() {
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
}

var tween = new TimelineMax({
  paused: true
});

window.onload = function() {
  var lineAnimation = document.querySelector("#line-animation");
  var lineDurationNumber = document.querySelector("#line-duration-number");
  var lineDurationStatusText = document.querySelector(
    "#line-duration-status-text"
  );

  tween.to(lineAnimation, duration, {
    force3D: true,
    css: {
        backgroundColor: '#FF0000'
    },
    onComplete: function() {
      lineDurationStatusText.innerHTML = "Game has been started, no more bets!";
      lineDurationNumber.style.display = "none";
    },
    onStart: function() {
      lineDurationStatusText.innerHTML = "The game will start in: ";
      lineDurationNumber.style.display = "";
      lineDurationNumber.innerHTML = duration;
      betObject = {};
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
};
