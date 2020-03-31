let winnerNames = [
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight"
];
function animateWinner(msgBet) {
  var winnerNumber;
  msgBet.winner.forEach((win, key) => {
    if (win === 8) {
      winnerNumber = key;
      return;
    }
  });
  document.getElementById("winnerName").innerHTML =
    winnerNames[winnerNumber];
  if (msgBet.isUserWin) {
    document.getElementById("balance").innerHTML =
      parseFloat(document.getElementById("balance").innerHTML) + msgBet.amount;
      document.getElementById("winnerMessage").innerHTML = "Congrats, you win ";
    var Cont = { val: 0 },
      NewVal = msgBet.amount;
      if (msgBet.gameDuration.winningAnimation <= 0) {
        document.getElementById("amountWon").innerHTML = msgBet.amount;
      } else {
          TweenLite.to(Cont, msgBet.gameDuration.winningAnimation, {
          val: NewVal,
          roundProps: "val",
          onUpdate: function() {
            document.getElementById("amountWon").innerHTML = Cont.val;
          }
        });
      }
  } else {
    document.getElementById("winnerMessage").innerHTML = "No win";
    document.getElementById("amountWon").innerHTML = "";
  }
  document.getElementById("winner").style.display = "block";
}
