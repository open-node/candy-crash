const { Actor } = require("open-game");

class Back extends Actor {
  reset() {
    this.x = 20;
    this.y = 20;
  }

  mousedown(x, y) {
    if (this.isItOn(x, y)) this.game.enter("start");
  }

  render() {
    this.game.drawImageByName("iconBack", this.x, this.y, this.w, this.h);
  }
}

module.exports = Back;
