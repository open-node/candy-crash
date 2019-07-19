const { Actor } = require("open-game");

class Bg extends Actor {
  reset() {
    const {
      padding: [, , , left]
    } = this.game.opts;
    this.x = left;
    this.y = left;
    this.w = this.game.w - left * 2;
    this.h = (this.w * this.game.imgMaps.topBg0.h) / this.game.imgMaps.topBg0.w;
  }

  render() {
    this.game.drawImageByNameFullScreen("bg0");
    this.game.drawImageByName("topBg0", this.x, this.y, this.w, this.h);
  }
}

module.exports = Bg;
