const { Actor } = require("open-game");

class Avatar extends Actor {
  render() {
    this.game.drawImageByName("userAvatar", 30, 60, 60, 60);
  }
}

module.exports = Avatar;
