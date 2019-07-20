const Base = require("./base");

class Reset extends Base {
  constructor(game, count, x, y) {
    super(game, game.imgMaps.reset);
    this.name = "reset";
    this.title = "重置";
    this.count = count;
    this.x = x;
    this.y = y;
  }

  selected() {
    return false;
  }

  use(map) {
    super.use(map);
    map.blocksReset();
  }
}

module.exports = Reset;
