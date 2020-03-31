var betObject = {};
var eventHandler = {
  pending: (msg) => {
    betObject.betId = msg.id;
    document.getElementById("winner").style.display = "none";
    tweenInitiation(msg);
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
