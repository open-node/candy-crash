const { Actor } = require("open-game");

class Bg extends Actor {
  render() {
    this.game.drawImageByNameFullScreen("bg0");
    this.game.drawImageAlignCenterByName("topBg0", 5);
  }
}

module.exports = Bg;
