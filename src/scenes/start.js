const { Scene } = require("open-game");

class Start extends Scene {
  update() {}

  enter() {
    this.actors = ["map"];
  }
}

module.exports = Start;
