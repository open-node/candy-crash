const { Actor } = require("open-game");

const BLOCKNUM = 5; // block 种类数量
const ROWS = 10; // block 行数量
const COLS = 10; // block 列数量
const TOP = 200; // 顶部最少偏移量
const BOTTOM = 50; // 底部最少偏移量, 多余的高度优先留个顶部
const BLOCKSIZE = 34; // block 的size，宽等于高
const GAP = 2; // block 之间的缝隙宽度
const PRIM = 9973; // 辅助随机功能

class Map extends Actor {
  reset() {
    this.x = (this.game.w - BLOCKSIZE * COLS - (COLS - 1) * GAP) >> 1;
    this.y = this.game.h - BLOCKSIZE * ROWS - (ROWS - 1) * GAP - BOTTOM;
    if (this.y < TOP) throw Error("画布太小无法展示");

    // 记录当前地图中block的情况
    this.code = [];
    for (let i = 0; i < ROWS; i += 1) {
      this.code[i] = [];
      for (let j = 0; j < COLS; j += 1) {
        this.code[i][j] = 1 + (((Math.random() * PRIM) | 0) % BLOCKNUM);
      }
    }
    console.log(this.code);
  }

  render() {
    for (let i = 0; i < ROWS; i += 1) {
      for (let j = 0; j < COLS; j += 1) {
        const x = this.x + i * (BLOCKSIZE + GAP);
        const y = this.y + j * (BLOCKSIZE + GAP);
        this.game.drawImageByName(`block${this.code[i][j]}`, x, y);
      }
    }
  }
}

module.exports = Map;
