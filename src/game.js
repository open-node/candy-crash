const OpenGame = require("open-game");
const Start = require("./scenes/start");
const Map = require("./actors/map");
const Bg = require("./actors/bg");
const TopBg = require("./actors/top-bg");
const Avatar = require("./actors/avatar");

class Game extends OpenGame {
  reset() {
    this.debuggerInfoColor = "#ffffff";
    this.eventListeners = [
      ["onmousedown", "mousedown"],
      ["onmouseup", "mouseup"]
    ];

    // 定义游戏区域关键数据
    const cols = 7;
    const gap = 3;
    const top = 230;
    const left = 3;
    const blocksize = (this.w - left * 2 - (cols - 1) * gap) / cols; // block 的size，宽等于高
    const rows = ((this.h - top) / (blocksize + gap)) | 0;

    this.opts = {
      blocknum: 5, // block 种类数量
      padding: [top, left, left, left], // 内边距, 上、右、下、左，上位最小值，其他为绝对值
      blocksize,
      rows,
      cols,
      gap,
      prim: 9973 // 辅助随机功能
    };
  }

  // 创建角色, 并非游戏全部角色
  // 这里创建的角色一般为多场景共用的单一角色
  // 场景特有的角色一般在场景内创建
  createActors() {
    // 游戏角色加载
    this.actors.bg = new Bg(this);
    this.actors.topBg = new TopBg(this);
    this.actors.map = new Map(this);
  }

  // 创建场景
  createScenes() {
    // 游戏场景加载
    this.scenes.start = new Start(this, "start");
  }

  // wxUserInit
  wxUserInit(userInfo) {
    if (this.platform.env !== "wx") return;
    this.actors.avatar = new Avatar(this, userInfo.avatarUrl);
  }
}

module.exports = Game;
