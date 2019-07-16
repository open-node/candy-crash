const { Scene } = require("open-game");

class Start extends Scene {
  update() {}

  enter() {
    this.actors = ["bg", "map"];
  }
}

module.exports = Start;
