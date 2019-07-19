const { Actor } = require("open-game");

class Praise extends Actor {
  reset() {
    this.frames = 0;
  }

  show(frames, name) {
    this.frames = frames;
    this.scale = 1;
    this.w = this.game.imgMaps[name].w;
    this.h = this.game.imgMaps[name].h;
    this.alpha = 1;
    this.name = name;
    this.visable = true;
  }

  hide() {
    this.visable = false;
  }

  update() {
    if (this.frames) {
      this.scale += 0.01;
      this.alpha -= this.alpha / this.frames;
      this.frames -= 1;
    }
  }

  render() {
    if (!this.visable) return;

    this.game.ctx.save();
    this.game.ctx.globalAlpha = this.alpha;
    this.game.drawImageAlignCenterByName(
      this.name,
      150,
      this.w * this.scale,
      this.h * this.scale
    );
    this.game.ctx.restore();
  }
}

module.exports = Praise;
