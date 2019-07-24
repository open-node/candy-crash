const { Scene } = require("open-game");

class Level extends Scene {
  constructor(game, name) {
    super(game, name);
    this.actors = ["bg", "topBg", "level", "levels", "back"];
  }

  enter() {}
}

module.exports = Level;
