import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d');

const randomId = () => Date.now();

const myPlayerId = randomId();

let players = {};
let foods = {};

const pressedButtons = {};
document.addEventListener("keydown", e => {
  pressedButtons[e.key] = true;
});
document.addEventListener("keyup", e => {
  pressedButtons[e.key] = false;
})

socket.on("player-moved", data => {
  players[data.id].x = data.newCoordinates.x;
  players[data.id].y = data.newCoordinates.y;
});
socket.on("players-updated", playersData => {
  players = {};
  Object.values(playersData).forEach(playerData => {
    players[playerData.id] = new Player(playerData);
  });
});
socket.on("foods-updated", foodsData => {
  foods = {};
  Object.values(foodsData).forEach(foodData => {
    foods[foodData.id] = new Collectible(foodData);
  })
});
socket.on("score-increase", data => {
  players[data.id].score += data.value;
});

socket.emit("join", myPlayerId);

const gameLoop = () => {
  ctx.fillStyle = "#050";
  ctx.fillRect(0, 0, canvas.width, canvas.height);  

  Object.values(players).forEach(player => {
    if(player.id == myPlayerId) {
      const oldX = player.x;
      const oldY = player.y;
      player.processInput(pressedButtons);
      if(oldX !== player.x || oldY !== player.y) {
        socket.emit("player-moved", player);
      }


      ctx.fillStyle = "#eee";
      ctx.strokeStyle = "#eee";
      ctx.font = "13px Arial";
      const rankText = player.calculateRank(players);
      ctx.fillText(rankText, 10, 40); 

      Object.values(foods).forEach(food => {
        if(player.collision(food)) {
          delete foods[food.id];
          socket.emit("food-consumed", food);
        }
      })
    }

    ctx.fillStyle = player.id == myPlayerId ? "#e66" : "#eee";
    ctx.strokeStyle = "#000";
    const x = player.x - player.width/2;
    const y = player.y - player.height/2;
    ctx.fillRect(x, y, player.width, player.height);
  });

  Object.values(foods).forEach(food => {
    ctx.fillStyle = "#22a";
    ctx.strokeStyle = "#22a";
    ctx.beginPath();
    ctx.ellipse(food.x, food.y, food.radius, food.radius, 0, 0, 2*Math.PI);
    ctx.fill();
  });

  window.requestAnimationFrame(gameLoop);
}
gameLoop();