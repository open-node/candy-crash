const OpenGame = require("open-game");
const Start = require("./scenes/start");
const Level = require("./scenes/level");
const Map = require("./actors/map");
const Levels = require("./actors/levels");
const Bg = require("./actors/bg");
const TopBg = require("./actors/top-bg");
const Avatar = require("./actors/avatar");
const Back = require("./actors/back");

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

  nextLevel() {
    const curr = this.getCurrLevel();
    return Math.min(Levels.config.length - 1, curr + 1);
  }

  getStorageSync(name) {
    if (this.platform.env !== "wx") return localStorage[name];
    return wx.getStorageSync(name);
  }

  setStorageSync(name, value) {
    if (this.platform.env !== "wx") {
      localStorage[name] = value;
    } else {
      wx.setStorageSync(name, value);
    }
  }

  getCurrLevel() {
    const value = Math.max(0, this.getStorageSync("currLevel") | 0);
    return Math.min(Levels.config.length - 1, value);
  }

  setCurrLevel(value) {
    const level = Math.min(Levels.config.length - 1, Math.max(0, value | 0));
    this.setStorageSync("currLevel", level);
  }

  getRecords() {
    return this.getStorageSync("records") || [];
  }

  setCurrRecord(score) {
    const records = this.getRecords();
    const level = this.getCurrLevel();
    if (!records[level] || records[level] < score) records[level] = score;
    this.setStorageSync("records", records);
  }

  // 创建角色, 并非游戏全部角色
  // 这里创建的角色一般为多场景共用的单一角色
  // 场景特有的角色一般在场景内创建
  createActors() {
    // 游戏角色加载
    this.actors.bg = new Bg(this);
    this.actors.topBg = new TopBg(this);
    this.actors.map = new Map(this);
    this.actors.levels = new Levels(this);
    this.actors.back = new Back(this, this.imgMaps.iconBack);
  }

  // 创建场景
  createScenes() {
    // 游戏场景加载
    this.scenes.start = new Start(this, "start");
    // 关卡场景
    this.scenes.level = new Level(this, "level");
  }

  // wxUserInit
  wxUserInit(userInfo) {
    if (this.platform.env !== "wx") return;
    this.actors.avatar = new Avatar(this, userInfo.avatarUrl);
  }
}

module.exports = Game;
