const { Actor } = require("open-game");

class ImageEffect extends Actor {
  constructor(game, name, align, rAlign, clickHandler) {
    super(game, game.imgMaps[name]);
    if (align) {
      this.align = align;
      this.xAlign(align);
    }
    if (rAlign) {
      this.ralign = rAlign;
      this.yAlign(rAlign);
    }
    this.name = name;
    this.clickHandler = clickHandler;
  }

  xAlign(value) {
    if (value === "left") {
      this.x = 0;
    } else if (value === "right") {
      this.x = this.game.w - this.w;
    } else if (value === "center") {
      this.x = (this.game.w - this.w) / 2;
    } else {
      throw Error("不合法水平对齐方式， `left`, `right`, `center`");
    }
  }

  yAlign(value) {
    if (value === "top") {
      this.y = 0;
    } else if (value === "bottom") {
      this.y = this.game.h - this.h;
    } else if (value === "center") {
      this.y = (this.game.h - this.h) / 2;
    } else if (value === "gold") {
      this.y = (this.game.h - this.h) * 0.618;
    } else {
      throw Error("不合法纵向对齐方式， `top`, `bottom`, `center`, `gold`");
    }
  }

  show() {
    this.frames = 0;
    this.visable = true;
    this.scale = 1;
    this.alpha = 1;
    this.dScale = 0;
  }

  hide(frames, scale = 0.01) {
    this.dScale = scale;
    this.hiding = true;
    this.frames = frames;
  }

  update() {
    if (this.frames) {
      this.scale += this.dScale;
      this.alpha -= this.alpha / this.frames;
      this.frames -= 1;
      if (!this.frames) this.visable = false;
    }
  }

  mousedown(x, y) {
    if (!this.visable) return;
    if (this.clickHandler && this.isItOn(x, y)) {
      this.clickHandler(x, y);
    }
  }

  render() {
    if (!this.visable) return;

    if (this.hiding) {
      this.game.ctx.save();
      this.game.ctx.globalAlpha = this.alpha;
    }

    if (this.scale !== 1) {
      if (this.align === "center") {
        this.x = (this.game.w - this.w * this.scale) / 2;
      }
      if (this.rAlign === "center") {
        this.y = (this.game.h - this.h * this.scale) / 2;
      } else if (this.rAlign === "gold") {
        this.y = (this.game.h - this.h * this.scale) * 0.618;
      }
    }

    this.game.drawImageByName(
      this.name,
      this.x,
      this.y,
      this.w * this.scale,
      this.h * this.scale
    );
    if (this.hiding) this.game.ctx.restore();
  }
}

module.exports = ImageEffect;
