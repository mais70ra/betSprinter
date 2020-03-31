var canvasWidth = 800;
var canvasHeight = 400;
var app = new PIXI.Application(canvasWidth, canvasHeight, { antialias: true });
document.getElementById("game-container").appendChild(app.view);
var stage = new PIXI.Container();
stage.interactive = true;
let stadiumWidht = 400;
let stadiumHeight = 100;
let trackWidth = 10;
let colors = [
  0xf47e48,
  0x3858a7,
  0xee3160,
  0x34c0c7,
  0x90c73e,
  0xc04599,
  0xf7f04e,
  0x8b2e1b
];
let beginFillColors = [0x74c043];
var players = [];
function drawTrack(
  stadiumWidht,
  stadiumHeight,
  trackWidth,
  color,
  beginFillColor,
  index
) {
  let roundBox = new PIXI.Graphics();
  let x = canvasWidth / 2 - stadiumWidht / 2;
  let y = canvasHeight / 2 - stadiumHeight / 2 - index * 10;
  if (beginFillColor) {
    roundBox.beginFill(beginFillColor);
  }
  roundBox.lineStyle(trackWidth, color, 1);
  let radius = stadiumHeight / 1.78;
  roundBox.drawRoundedRect(0, 0, stadiumWidht, stadiumHeight, radius);
  roundBox.x = (canvasWidth - stadiumWidht) / 2;
  roundBox.y = (canvasHeight - stadiumHeight) / 2;
  roundBox.endFill();

  let player = new PIXI.Graphics();
  player.beginFill(0xffffff);
  player.x = radius;
  player.y = 0;
  player.stadiumWidht = stadiumWidht;
  player.stadiumHeight = stadiumHeight;
  player.totalDuration = (stadiumWidht + stadiumHeight) * 2;
  let ticks = 1000;
  player.speedCoefficient = player.totalDuration / ticks;
  player.radius = radius;
  player.drawCircle(0, 0, 5);
  player.endFill();
  players.push(player);
  roundBox.addChild(player);
  stage.addChild(roundBox);
}

let numberOfPlayers = colors.length;
for (var i = 0; i < numberOfPlayers; i++) {
  drawTrack(
    stadiumWidht + i * 2 * trackWidth,
    stadiumHeight + i * 2 * trackWidth,
    trackWidth,
    colors[i],
    beginFillColors[i],
    i
  );
}
app.stage.addChild(stage);

function startGame(msgBet) {
  var fps = 30;
  // 60 (iteration in seconds) * 30 (seconds) = 500 (iterations)
  // 500(iterations) * x (speed) = 100( percantage of each member)
  // x= 100/500 = 0.2 minimum speed for the last member
  if (msgBet.gameDuration.game <= 0) {
    animateWinner(msgBet);
    return ;
  }
  var minimumSpeed = 100/((fps) * msgBet.gameDuration.game);
  
  players.forEach((player, index) => {
    player.percent = 0;
    player.speed = minimumSpeed + (msgBet.winner[index] - 1) * 0.003;
    player.lastPlayer = msgBet.winner[index] === 1;
    animate.call(player);
  });
  
  function animate() {
    // set the animation position (0-100)
    let player = this;
    player.percent += player.speed;
    if (player.percent > 100) {
      player.percent = 0;
      if (player.lastPlayer) {
        animateWinner(msgBet);
      }
    } else {
      draw(player.percent, this);
      setTimeout(function() {
        animate.call(player);
      }, 1000 / fps);
    }
  }

  function draw(sliderValue, player) {
    // draw the tracking rectangle
    var xy;
    if (sliderValue < 25) {
      var percent = sliderValue / 24;
      xy = getLineXYatPercent(
        {
          x: player.radius,
          y: 0
        },
        {
          x: player.stadiumWidht - player.radius,
          y: 0
        },
        percent
      );
    } else if (sliderValue < 50) {
      var percent = (sliderValue - 25) / 24;
      xy = getQuadraticBezierXYatPercent(
        {
          x: player.stadiumWidht - player.radius,
          y: 0
        },
        {
          x: player.stadiumWidht + player.radius,
          y: player.radius
        },
        {
          x: player.stadiumWidht - player.radius,
          y: player.stadiumHeight - trackWidth
        },
        percent
      );
    } else if (sliderValue < 75) {
      var percent = (sliderValue - 50) / 24;
      xy = getLineXYatPercent(
        {
          x: player.stadiumWidht - player.radius,
          y: player.stadiumHeight
        },
        {
          x: player.radius,
          y: player.stadiumHeight
        },
        percent
      );
    } else {
      var percent = (sliderValue - 75) / 25;
      xy = getQuadraticBezierXYatPercent(
        {
          x: player.radius,
          y: player.stadiumHeight
        },
        {
          x: 0 - player.radius - 10,
          y: player.stadiumHeight / 2
        },
        {
          x: player.radius,
          y: 0
        },
        percent
      );
    }
    player.x = xy.x;
    player.y = xy.y;
    player.drawCircle(0, 0, 5);
    app.render(stage);
  }

  function getLineXYatPercent(startPt, endPt, percent) {
    var dx = endPt.x - startPt.x;
    var dy = endPt.y - startPt.y;
    var X = startPt.x + dx * percent;
    var Y = startPt.y + dy * percent;
    return {
      x: X,
      y: Y
    };
  }

  // quadratic bezier: percent is 0-1
  function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
    var x =
      Math.pow(1 - percent, 2) * startPt.x +
      2 * (1 - percent) * percent * controlPt.x +
      Math.pow(percent, 2) * endPt.x;
    var y =
      Math.pow(1 - percent, 2) * startPt.y +
      2 * (1 - percent) * percent * controlPt.y +
      Math.pow(percent, 2) * endPt.y;
    return {
      x: x,
      y: y
    };
  }
}
