const { Actor } = require("open-game");

class Block extends Actor {
  constructor(game, code, r, c, ox, oy) {
    super(game, game.imgMaps[`block${code}`]);
    this.code = code;
    this.r = r;
    this.c = c;
    this.ox = ox;
    this.oy = oy;
    this.gap = this.game.opts.gap;
    this.prim = this.game.opts.prim;

    // 是否被点击选中
    this.actived = false;
    this.alpha = 1; // 选中后的效果
    this.da = 0.03; // 透明度变化量

    [this.x, this.y] = this.calc(r, c);
    this.frames = 0; // 运动剩余帧数
    this.tr = 0; // 运动目标行号
    this.tc = 0; // 运动目标列号
    this.tx = 0; // 运动目标x坐标
    this.ty = 0; // 运动目标y坐标
  }

  calc(r, c) {
    return [
      this.ox + r * (this.w + this.gap),
      this.oy + c * (this.w + this.gap)
    ];
  }

  update() {
    // 处理运动及位移
    if (0 < this.frames) {
      this.x += (this.tx - this.x) / this.frames;
      this.y += (this.ty - this.y) / this.frames;
      this.frames -= 1;
    }

    // 点击选中效果
    if (this.actived) {
      if (this.alpha <= 0 || 1 <= this.alpha) this.da = 0 - this.da;
      this.alpha += this.da;
    }
  }

  mousedown(x, y) {
    this.actived = this.isItOn(x, y);
    return this.actived;
  }

  moveTo(frames, r, c) {
    if (this.game.opts.rows <= r) throw Error("越界了");
    if (this.game.opts.cols <= c) throw Error("越界了");
    [this.tx, this.ty] = this.calc(r, c);
    this.frames = frames;
    this.tr = r;
    this.tc = c;
  }

  render() {
    if (this.actived) {
      // 绘制选中效果
      this.game.ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      this.game.ctx.fillRect(this.x - 4, this.y - 4, this.w + 8, this.h + 8);
    }
    this.game.drawImageByName(`block${this.code}`, this.x, this.y);
  }
}

module.exports = Block;
