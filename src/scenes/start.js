const { Scene } = require("open-game");

class Start extends Scene {
  enter() {
    this.actors = ["bg", "map", "avatar"];
  }
}

module.exports = Start;
