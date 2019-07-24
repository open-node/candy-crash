const { Actor } = require("open-game");
const config = require("../data/level");

class Level extends Actor {
  reset() {
    const { topBg } = this.game.actors;
    this.value = null;
    this.x = topBg.x + 30;
    this.y = topBg.y + topBg.h - 20 - this.h;
  }

  setValue(index) {
    this.value = config[index];
  }

  isAchieved(score) {
    return this.value.score <= score;
  }

  mousedown(x, y) {
    if (this.isItOn(x, y)) this.game.enter("level");
  }

  render() {
    const { ctx } = this.game;
    this.game.drawImageByName("levelBg", this.x, this.y, this.w, this.h);
    ctx.save();
    ctx.font = "12px 微软雅黑";
    ctx.fillStyle = "#dddd20";
    ctx.textAlign = "center";
    ctx.fillText(this.value.name, this.x + this.w / 2, this.y + 4 + this.h / 2);
    ctx.font = "18px 微软雅黑";
    ctx.fillText(
      `目标: ${this.value.score}`,
      this.game.w >> 1,
      this.game.actors.topBg.h * 0.193
    );
    ctx.restore();
  }
}

module.exports = Level;
