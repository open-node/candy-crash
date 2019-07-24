const { Actor } = require("open-game");

class Timer extends Actor {
  constructor(game, size, x, y, callback) {
    super(game, size);
    this.isStoped = true;
    this.percent = 1;
    this.red = 0;
    this.green = 255;
    this.x = x;
    this.y = y;
    this.callback = callback;
  }

  start(frames) {
    this.frames = frames;
    this.total = frames; // 记录初始的帧数，最为100%的参考
    this.run();
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
      this.stop(); // 这里先要停止计时器，否则callback可能会被多次执行
      this.callback();
      return;
    }
    if (this.frames < this.total) {
      this.percent = this.frames / this.total;
    } else {
      this.percent = 1;
    }
    if (this.percent <= 0.5) {
      this.green = Math.max(this.percent * 2 * 255, 0);
      this.red = 255;
    } else {
      this.green = 255;
      this.red = Math.min((1 - this.percent) * 2 * 255, 255);
    }
    this.frames -= 1;
  }

  render() {
    const { ctx } = this.game;
    ctx.save();
    ctx.strokeRect(this.x + 3, this.y, this.w, this.h);
    ctx.fillStyle = `rgb(${this.red | 0}, ${this.green | 0}, 10)`;
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
