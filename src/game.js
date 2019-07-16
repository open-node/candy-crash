const OpenGame = require("open-game");
const Start = require("./scenes/start");
const Map = require("./actors/map");
const Bg = require("./actors/bg");

class Game extends OpenGame {
  reset() {
    this.debuggerInfoColor = "#ffffff";
    this.scores = {
      record: [],
      curr: 0,
      best: 0
    };
  }

  // 创建角色, 并非游戏全部角色
  // 这里创建的角色一般为多场景共用的单一角色
  // 场景特有的角色一般在场景内创建
  createActors() {
    // TODO 游戏角色加载
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
