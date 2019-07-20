const { Actor } = require("open-game");

const titles = {
  bomb: "炸弹",
  mallet: "小木槌",
  magic: "魔法棒",
  reset: "重置"
};

class ToolCard extends Actor {
  constructor(game, name, count, x, y) {
    super(game, game.imgMaps[name]);
    this.title = titles[name]; // 标题
    this.name = name; // 道具卡名称，以此来找到对应图片
    this.count = count; // 道具卡次数, 以此来判断是否可以使用
    this.actived = false; // 是否处于激活状态
    this.alpha = 1; // 选中后的效果
    this.da = 0.03; // 透明度变化量
    this.x = x;
    this.y = y;
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
      this.game.drawImageByName(
        this.name,
        this.mx - this.w / 2,
        this.my - this.h / 2
      );
    }
  }
}

module.exports = ToolCard;
