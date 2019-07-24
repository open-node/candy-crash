const { Actor } = require("open-game");

class LevelItem extends Actor {
  constructor(game, level, x, y, w, h) {
    super(game);
    this.value = level;
    this.w = w;
    this.h = h;
    this.actived = false; // 是否被选中
    this.isFinished = false;
    this.record = null; // 通过关卡的最高纪录
    this.x = x;
    this.y = y;
  }

  mousedown(x, y) {
    if (this.actived && this.isItOn(x, y)) {
      this.actived = true;
      return true;
    }
    return false;
  }

  render() {
    const { ctx } = this.game;
    // 绘制背景
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(this.x, this.y, this.w, this.h);

    // 绘制当前选中效果
    if (this.actived) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ddd";
      ctx.strokeRect(this.x, this.y, this.w, this.h);
    }

    // 绘制是否通关的图标
    this.game.drawImageByName(
      this.isFinished ? "unlock" : "lock",
      this.x + this.w - 30,
      this.y + 10,
      20,
      22
    );
    ctx.font = "18px 微软雅黑";
    ctx.fillStyle = "#aaa";
    ctx.textAlign = "left";
    this.game.ctx.fillText(this.value.name, this.x + 10, this.y + 27);
    ctx.fillStyle = "#666";
    ctx.font = "14px 微软雅黑";
    ctx.textAlign = "left";
    this.game.ctx.fillText(
      `目标: ${this.value.score}`,
      this.x + 10,
      this.y + 53
    );
    this.game.ctx.fillText(
      `时限: ${this.value.time} 秒`,
      this.x + 10,
      this.y + 80
    );
  }
}

module.exports = LevelItem;
