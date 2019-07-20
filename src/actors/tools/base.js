const { Actor } = require("open-game");

class Tool extends Actor {
  reset() {
    this.actived = false; // 是否处于激活状态
    this.alpha = 1; // 选中后的效果
    this.da = 0.03; // 透明度变化量
    this.mx = 0;
    this.my = 0;
  }

  requestActived(x, y) {
    // 点击激活，如果当前师激活状态，或者数量为零均返回
    if (this.actived || !this.count || !this.isItOn(x, y)) return false;
    this.actived = true;
    return true;
  }

  setMouseXY(x, y) {
    this.mx = x;
    this.my = y;
  }

  cancelActived() {
    if (!this.actived) return;
    this.actived = false;
  }

  // 选中执行的函数
  selected() {
    return true;
  }

  // 使用执行的函数
  use() {
    this.count -= 1;
  }

  update() {
    // 点击选中效果
    if (this.actived) {
      if (this.alpha <= 0 || 1 <= this.alpha) this.da = 0 - this.da;
      this.alpha += this.da;
    }
  }

  render() {
    this.game.ctx.save();
    this.game.ctx.transform(1, 0, 0, 1, this.x, this.y);
    if (this.actived) {
      // 绘制选中效果
      this.game.ctx.fillStyle = `rgba(255, 255, 10, ${this.alpha})`;
      this.game.ctx.fillRect(-4, -4, this.w + 8, this.h + 8);
    }
    this.game.drawImageByName(this.name, 0, 0);
    this.game.ctx.fillStyle = "#ffffff";
    this.game.ctx.font = "12px 微软雅黑";
    this.game.ctx.textAlign = "center";
    this.game.ctx.fillText(this.title, this.w / 2, this.h + 16);
    this.game.ctx.restore();

    if (this.actived) {
      this.game.ctx.save();
      this.game.ctx.globalAlpha = 0.5;
      this.game.drawImageByName(
        this.name,
        this.mx - this.w / 2,
        this.my - this.h / 2
      );
      this.game.ctx.restore();
    }
  }
}

module.exports = Tool;
