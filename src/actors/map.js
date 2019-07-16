const { Actor } = require("open-game");
const Block = require("./block");

class Map extends Actor {
  reset() {
    const {
      blocksize,
      blocknum,
      cols,
      rows,
      prim,
      gap,
      top,
      bottom
    } = this.game.opts;
    this.x = (this.game.w - blocksize * cols - (cols - 1) * gap) >> 1;
    this.y = this.game.h - blocksize * rows - (rows - 1) * gap - bottom;
    if (this.y < top) throw Error("画布太小无法展示");

    // 记录当前地图中block的情况
    this.code = [];
    this.blocks = [];
    for (let i = 0; i < rows; i += 1) {
      this.code[i] = [];
      this.blocks[i] = [];
      for (let j = 0; j < cols; j += 1) {
        // 编号从1开始
        this.code[i][j] = 1 + (((Math.random() * prim) | 0) % blocknum);
        this.blocks[i][j] = new Block(
          this.game,
          this.code[i][j],
          i,
          j,
          this.x,
          this.y
        );
      }
    }
  }

  click(x, y) {
    for (let i = 0; i < this.game.opts.rows; i += 1) {
      for (let j = 0; j < this.game.opts.cols; j += 1) {
        this.blocks[i][j].click(x, y);
      }
    }
  }

  render() {
    for (let i = 0; i < this.game.opts.rows; i += 1) {
      for (let j = 0; j < this.game.opts.cols; j += 1) {
        this.blocks[i][j].update();
        this.blocks[i][j].render();
      }
    }
  }
}

module.exports = Map;
