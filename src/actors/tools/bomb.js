const Base = require("./base");

class Bomb extends Base {
  constructor(game, count, x, y) {
    super(game, game.imgMaps.bomb);
    this.count = count;
    this.name = "bomb";
    this.title = "炸弹";
    this.x = x;
    this.y = y;
  }

  // 炸弹爆炸最多会炸掉九个, 周围一圈，以及自身
  // 炸掉的块，本身不得分，补充后可以继续玩
  use(map) {
    super.use(map);
    const [r, c] = map.currActived;
    const removes = [
      [r - 1, c - 1], // 左上
      [r - 1, c], // 上
      [r - 1, c + 1], // 右上
      [r, c - 1], // 左
      [r, c], // 中(自身)
      [r, c + 1], // 右
      [r + 1, c - 1], // 左下
      [r + 1, c], // 下
      [r + 1, c + 1] // 右下
    ];

    for (const [i, j] of removes) {
      if (map.blocks[i] && map.blocks[i][j]) map.blocks[i][j] = null;
    }
    map.fsm = "falling";
  }
}

module.exports = Bomb;
