const { Scene } = require("open-game");

class Start extends Scene {
  enter() {
    this.actors = ["bg", "topBg", "map", "score", "timer", "praise"];
  }
}

module.exports = Start;
