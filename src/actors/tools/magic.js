const Base = require("./base");

class Magic extends Base {
  constructor(game, count, x, y) {
    super(game, game.imgMaps.magic);
    this.name = "magic";
    this.title = "魔法棒";
    this.count = count;
    this.x = x;
    this.y = y;
  }
}

module.exports = Magic;
