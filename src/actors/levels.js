const { Actor } = require("open-game");
const config = require("../data/level");
const LevelItem = require("./level-item");

class Levels extends Actor {
  reset() {
    const { topBg } = this.game.actors;
    this.curr = config[0];
    this.padding = 6;
    this.x = this.padding;
    this.y = topBg.y + topBg.h + this.padding;

    const records = this.game.getRecords();
    const cols = 3;
    const w = 100;
    const h = 100;
    const lineHeight = (this.game.h - this.y) / Math.ceil(config.length / cols);
    const gap = (this.game.w - this.padding * 2 - w * cols) / (cols - 1);
    this.items = config.map((level, i) => {
      const ix = this.padding + (i % cols) * (gap + w);
      const iy = this.y + lineHeight * ((i / cols) | 0);
      const item = new LevelItem(this.game, level, ix, iy, w, h);
      if (records[i]) {
        item.isFinished = true;
        item.record = records[i];
      }
      return item;
    });
    this.currActived = this.game.getCurrLevel();
    this.items[this.currActived].actived = true;
  }

  mousedown(x, y) {
    for (let i = 0; i < config.length; i += 1) {
      const item = this.items[i];
      if (item.mousedown(x, y)) {
        this.items[this.currActived].actived = false;
        this.currActived = i;
        this.items[this.currActived].actived = true;
        break;
      }
    }
  }

  render() {
    for (const item of this.items) item.render();
  }
}

Levels.config = config;

module.exports = Levels;
