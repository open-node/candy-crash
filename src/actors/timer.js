const { Actor } = require("open-game");

class Timer extends Actor {
  constructor(game, size, x, y, frames, callback) {
    super(game, size);
    this.frames = frames; // 实时记录剩余帧数
    this.total = frames; // 记录初始的帧数，最为100%的参考
    this.percent = 1;
    this.x = x;
    this.y = y;
    this.callback = callback;
  }

  // stop
  stop() {
    this.isStoped = true;
  }

  // 继续运行计时器
  run() {
    this.isStoped = false;
  }

  // 奖励时间或者惩罚时间，看 frames 参数的正负情况
  add(frames) {
    this.frames += frames;
  }

  update() {
    if (this.isStoped) return;
    if (this.frames === 0) {
      this.callback();
      return;
    }
    if (this.frames < this.total) {
      this.percent = this.frames / this.total;
    } else {
      this.percent = 1;
    }
    this.frames -= 1;
  }

  render() {
    const { ctx } = this.game;
    ctx.save();
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.strokeStyle = "rgba(255, 55, 20, 1)";
    ctx.lineWidth = 4;
    ctx.strokeRect(this.x + 3, this.y, this.w, this.h);
    ctx.fillStyle = "rgba(30, 255, 10, 1)";
    ctx.fillRect(
      this.x + 4 + 3,
      this.y + 4,
      (this.w - 8) * this.percent,
      this.h - 8
    );
    ctx.restore();
  }
}

module.exports = Timer;
