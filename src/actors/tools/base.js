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
    const { ctx } = this.game;
    ctx.save();
    ctx.transform(1, 0, 0, 1, this.x, this.y);
    if (this.actived) {
      // 绘制选中效果
      ctx.fillStyle = `rgba(255, 255, 10, ${this.alpha})`;
      ctx.fillRect(-4, -4, this.w + 8, this.h + 8);
    }
    this.game.drawImageByName(this.name, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px 微软雅黑";
    ctx.textAlign = "center";
    ctx.fillText(this.title, this.w / 2, this.h + 16);
    ctx.restore();

    // 绘制数量提示, 右上角
    ctx.beginPath();
    ctx.arc(this.x + this.w - 3, this.y + 3, 10, 0, Math.PI * 2, true);
    ctx.fillStyle = "rgba(255, 30, 30, 0.8)";
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px 微软雅黑";
    ctx.textAlign = "center";
    ctx.fillText(this.count, this.x + this.w - 3, this.y + 8);

    if (this.actived) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      this.game.drawImageByName(
        this.name,
        this.mx - this.w / 2,
        this.my - this.h / 2
      );
      ctx.restore();
    }
  }
}

module.exports = Tool;
