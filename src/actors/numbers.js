const { Actor } = require("open-game");

class Numbers extends Actor {
  constructor(game, scale, value, ox, oy, gap, align = "left", rAlign = "top") {
    super(game);
    this.gap = gap;
    this.scale = scale;
    this.align = align;
    this.rAlign = rAlign;
    this.ox = ox; // 横轴偏移量
    this.oy = oy; // 中轴偏移量
    this.h = this.game.imgMaps.number0.h * this.scale;
    this.value = 0;
    this.add(value);
  }

  setValue(value) {
    this.value = value;
  }

  add(value) {
    this.value += value;
    this.str = `${this.value}`;
    const len = this.str.length;

    this.w = 0;
    for (let i = 0; i < len; i += 1) {
      this.w += this.game.imgMaps[`number${this.str[i]}`].w * this.scale;
    }
    this.w += this.gap * (len - 1);

    // 处理 x 轴对齐方式
    if (this.align === "center") {
      this.x = ((this.game.w - this.w) >> 1) + this.ox;
    } else if (this.align === "left") {
      this.x = this.ox;
    } else if (this.align === "right") {
      this.x = this.game.w - this.ox - this.w;
    }

    // 处理 y 轴对齐方式
    if (this.rAlign === "middle") {
      this.y = (this.game.h - this.h) >> 1;
    } else if (this.rAlign === "top") {
      this.y = this.oy;
    } else if (this.rAlign === "bottom") {
      this.y = this.game.h - this.oy - this.h;
    }
  }

  render() {
    let x = this.x;
    for (let i = 0; i < this.str.length; i += 1) {
      const ch = this.str[i];
      const name = `number${ch}`;
      const { w, h } = this.game.imgMaps[name];
      this.game.drawImageByName(
        name,
        x,
        this.y,
        w * this.scale,
        h * this.scale
      );
      x += w * this.scale + this.gap;
    }
  }
}

module.exports = Numbers;
