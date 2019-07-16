const Game = require("./src/game");

const canvas = document.getElementById("mycanvas");
const { clientWidth: width, clientHeight: height } = document.documentElement;
const resources = [
  {
    name: "atlas",
    type: "image",
    url: "./images/atlas.png",
    map: "./images/atlas.map"
  }
];

const game = new Game(canvas, Image, width, height, [320, 414], [500, 736]);
game.init(resources);
