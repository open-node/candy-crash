const Game = require("./src/game");
const resources = require("./images/resources");

const canvas = document.getElementById("mycanvas");
const { clientWidth: width, clientHeight: height } = document.documentElement;

const game = new Game(canvas, Image, width, height, [320, 414], [640, 812]);
game.env = "production";
game.init(resources);
window.game = game;
