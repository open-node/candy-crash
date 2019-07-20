const Base = require("./base");

class Mallet extends Base {
  constructor(game, count, x, y) {
    super(game, game.imgMaps.mallet);
    this.name = "mallet";
    this.title = "小木槌";
    this.count = count;
    this.x = x;
    this.y = y;
  }

  // 小木槌只能敲掉一块
  // 敲掉的块，本身不得分，补充后可以继续玩
  use(map) {
    super.use(map);
    const [r, c] = map.currActived;
    map.blocks[r][c] = null;
    map.fsm = "falling";
  }
}

module.exports = Mallet;
