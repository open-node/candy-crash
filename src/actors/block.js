const { Actor } = require("open-game");

class Block extends Actor {
  constructor(game, code, x, y) {
    super(game, game.imgMaps[`block${code}`]);
    this.code = code;

    // 是否被点击选中
    this.actived = false;
    this.alpha = 1; // 选中后的效果
    this.da = 0.03; // 透明度变化量

    this.x = x;
    this.y = y;

    // 处理爆炸效果的相关属性
    this.bombingFrames = 0; // 爆炸效果剩余帧数
    this.bombAlpha = 1; // 淡出效果
    this.bombed = false;

    // 处理运动相关的属性
    this.movingFrames = 0; // 运动剩余帧数
    this.tx = 0; // 运动目标x坐标
    this.ty = 0; // 运动目标y坐标
  }

  update() {
    if (this.bombed) return;

    // 爆炸消失效果
    if (0 < this.bombingFrames) {
      this.bombAlpha -= this.bombAlpha / this.bombingFrames;
      this.bombingFrames -= 1;
      if (this.bombingFrames === 0) this.bombed = true;
    }

    // 处理运动及位移
    if (0 < this.movingFrames) {
      this.x += (this.tx - this.x) / this.movingFrames;
      this.y += (this.ty - this.y) / this.movingFrames;
      this.movingFrames -= 1;
    }

    // 点击选中效果
    if (this.actived) {
      if (this.alpha <= 0 || 1 <= this.alpha) this.da = 0 - this.da;
      this.alpha += this.da;
    }
  }

  bomb(frames) {
    // 防止除零错误，这里强制动画至少维持两帧
    this.bombingFrames = Math.max(2, frames);
    this.bombAlpha = 1;
  }

  moveTo(frames, tx, ty) {
    this.tx = tx;
    this.ty = ty;
    this.movingFrames = frames;
  }

  render() {
    if (this.bombed) return;
    if (this.actived) {
      // 绘制选中效果
      this.game.ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      this.game.ctx.fillRect(this.x - 4, this.y - 4, this.w + 8, this.h + 8);
    }

    if (this.bombingFrames) {
      this.game.ctx.save();
      this.game.ctx.globalAlpha = this.bombAlpha;
    }

    this.game.drawImageByName(`block${this.code}`, this.x, this.y);

    // TODO 调试信息
    this.game.ctx.fillStyle = "rgba(0,0,0,1)";
    this.game.ctx.font = "12px 宋体";
    this.game.ctx.fillText(
      this.code,
      this.x + this.w / 2 - 3,
      this.y + 5 + this.h / 2
    );

    if (this.bombingFrames) this.game.ctx.restore();
  }
}

module.exports = Block;
