const fs = require("fs");
const { createCanvas, Image } = require("canvas");

const Game = require("./src/game");

const canvas = createCanvas();
const resources = [
  {
    name: "atlas",
    type: "image",
    url: "./images/atlas.png",
    map: "./images/atlas.map"
  }
];

const game = new Game(canvas, Image, 360, 640, [320, 414], [500, 736]);
game.init(resources);

const capture = process.argv[2] | 0;
const target = process.argv[3];
game.registCallback(capture, () => {
  const buffer = canvas.toBuffer();
  if (target) {
    fs.writeFileSync(target, buffer);
  } else {
    console.log(target);
  }
  setTimeout(process.exit, 1000);
});
