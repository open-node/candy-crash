const Base = require("./base");

class Magic extends Base {
  constructor(game, count, x, y) {
    super(game, game.imgMaps.magic);
    this.name = "magic";
    this.title = "魔法棒";
    this.count = count;
    this.x = x;
    this.y = y;
    this.currRow = null;
    this.currCol = null;
    this.currCode = null;
    this.sure = false;
  }

  setMouseXY(x, y, map) {
    if (!map.isItOn(x, y)) {
      if (this.block) this.restore();
      return;
    }
    this.mx = x;
    this.my = y;
    const [r, c] = map.which(x, y);
    if (!this.block) {
      this.save(r, c, map);
    } else if (this.block !== map.blocks[r][c]) {
      this.restore();
      this.save(r, c, map);
    }
  }

  save(r, c, map) {
    this.block = map.blocks[r][c];
    this.currCode = this.block.code;
    this.map = map;
  }

  restore() {
    this.block.code = this.currCode;
    this.block = null;
  }

  use(map) {
    this.sure = true;
    this.block = null;
    this.count -= 1;
    map.fsm = "removing";
  }

  update() {
    if (!this.block) return;
    if (this.game.fno % 60 === 1)
      this.block.code = 1 + ((this.block.code + 1) % this.map.blocknum);
  }
}

module.exports = Magic;
