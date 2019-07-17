const OpenGame = require("open-game");
const Start = require("./scenes/start");
const Map = require("./actors/map");
const Bg = require("./actors/bg");

class Game extends OpenGame {
  reset() {
    this.debuggerInfoColor = "#ffffff";
    this.eventListeners = [
      ["ontouchstart", "onmousedown", "mousedown"],
      ["ontouchend", "onmouseup", "mouseup"]
    ];
    this.scores = {
      record: [],
      curr: 0,
      best: 0
    };
    this.opts = {
      blocknum: 5, // block 种类数量
      rows: 8, // block 行数量
      cols: 8, // block 列数量
      top: 200, // 顶部最少偏移量
      bottom: 50, // 底部最少偏移量, 多余的高度优先留个顶部
      blocksize: 34, // block 的size，宽等于高
      gap: 10, // block 之间的缝隙宽度
      prim: 9973 // 辅助随机功能
    };
  }

  // 创建角色, 并非游戏全部角色
  // 这里创建的角色一般为多场景共用的单一角色
  // 场景特有的角色一般在场景内创建
  createActors() {
    // 游戏角色加载
    this.actors.bg = new Bg(this, this.imgMaps.bg0);
    this.actors.map = new Map(this);
  }

  // 创建场景
  createScenes() {
    // TODO 游戏场景加载
    this.scenes.start = new Start(this, "start");
  }
}

module.exports = Game;
