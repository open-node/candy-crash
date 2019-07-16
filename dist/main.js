(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Game = require("./src/game");

const canvas = document.getElementById("mycanvas");
const { clientWidth: width, clientHeight: height } = document.documentElement;
const resources = [
  {
    name: "atlas",
    type: "image",
    url: "./images/atlas.png",
    map: "./images/atlas.map"
  }
];

const game = new Game(canvas, Image, width, height, [320, 414], [640, 812]);
game.env = "production";
game.init(resources);

},{"./src/game":6}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
const { Actor } = require("open-game");

class Bg extends Actor {
  render() {
    this.game.drawImageByNameFullScreen("bg0");
    this.game.drawImageAlignCenterByName("topBg0", 5);
  }
}

module.exports = Bg;

},{"open-game":9}],5:[function(require,module,exports){
const { Actor } = require("open-game");

const BLOCKNUM = 5; // block 种类数量
const ROWS = 10; // block 行数量
const COLS = 10; // block 列数量
const TOP = 200; // 顶部最少偏移量
const BOTTOM = 50; // 底部最少偏移量, 多余的高度优先留个顶部
const BLOCKSIZE = 34; // block 的size，宽等于高
const GAP = 2; // block 之间的缝隙宽度
const PRIM = 9973; // 辅助随机功能

class Map extends Actor {
  reset() {
    this.x = (this.game.w - BLOCKSIZE * COLS - (COLS - 1) * GAP) >> 1;
    this.y = this.game.h - BLOCKSIZE * ROWS - (ROWS - 1) * GAP - BOTTOM;
    if (this.y < TOP) throw Error("画布太小无法展示");

    // 记录当前地图中block的情况
    this.code = [];
    for (let i = 0; i < ROWS; i += 1) {
      this.code[i] = [];
      for (let j = 0; j < COLS; j += 1) {
        this.code[i][j] = 1 + (((Math.random() * PRIM) | 0) % BLOCKNUM);
      }
    }
    console.log(this.code);
  }

  render() {
    for (let i = 0; i < ROWS; i += 1) {
      for (let j = 0; j < COLS; j += 1) {
        const x = this.x + i * (BLOCKSIZE + GAP);
        const y = this.y + j * (BLOCKSIZE + GAP);
        this.game.drawImageByName(`block${this.code[i][j]}`, x, y);
      }
    }
  }
}

module.exports = Map;

},{"open-game":9}],6:[function(require,module,exports){
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

},{"./actors/bg":4,"./actors/map":5,"./scenes/start":7,"open-game":9}],7:[function(require,module,exports){
const { Scene } = require("open-game");

class Start extends Scene {
  update() {}

  enter() {
    this.actors = ["bg", "map"];
  }
}

module.exports = Start;

},{"open-game":9}],8:[function(require,module,exports){
/**
 * Actor 类
 * @class
 * @param {Game} game 游戏实例
 * @return {Actor} Instance
 */
class Actor {
  /** Create a actor instance */
  constructor(game, size) {
    this.game = game;
    /* 角色 x 坐标值 */
    this.x = 0;

    /* 角色 y 坐标值 */
    this.y = 0;

    /* 角色 宽度 */
    this.w = 0;

    /* 角色 高度 */
    this.h = 0;

    // 根据资源map，直接设置角色的宽高
    if (size) {
      this.w = size.w;
      this.h = size.h;
    }

    this.reset();
  }

  /**
   * 重置参数值
   *
   * @return {void}
   */
  reset() {}

  /**
   * 更新参数值
   *
   * @return {void}
   */
  update() {}

  /**
   * 渲染自己
   *
   * @return {void}
   */
  render() {
    throw Error("请子类自己实现render方法");
  }

  /**
   * 碰撞判断
   * @param {Actor} target
   *
   * @return {boolean}
   */
  aabb(x, y, w, h) {
    // this.x < x + w 目标的右侧在当前左侧之右
    // x < this.x + this.w 目标的左侧在当前右侧之左
    // y < this.y + this.h 目标顶部在当前底部之上
    // this.y < y + h 目标底部在当前顶部之下
    return (
      this.x < x + w &&
      x < this.x + this.w &&
      y < this.y + this.h &&
      this.y < y + h
    );
  }

  /**
   * 给定一组 x, y判断是否在角色身上
   *
   * @return {boolean}
   */
  isItOn(cX, cY) {
    return (
      cX > this.x && cX < this.x + this.w && cY > this.y && cY < this.y + this.h
    );
  }

  /**
   * 判断是否已经出去在画布之外
   *
   * @return {boolean}
   */
  get isOut() {
    return (
      this.x < -this.w ||
      this.game.w < this.x ||
      this.game.h < this.y ||
      this.y < 0
    );
  }
}

module.exports = Actor;

},{}],9:[function(require,module,exports){
(function (process){
const Actor = require("./actor");
const Scene = require("./scene");

// 获取执行环境，wx, browser，node
const env = (() => {
  if (typeof window === "object") return "browser";
  if (typeof wx === "object") return "wx";
  if (typeof process === "object") return "node";
  throw Error("未知环境");
})();

/* eslint-disable no-undef */
const fetchFns = {
  wx(url) {
    return Promise.resolve({
      text() {
        return new Promise((success, fail) => {
          wx.request({ url, success, fail });
        });
      }
    });
  },
  browser(url) {
    return window.fetch(url);
  },
  node(url) {
    /* eslint-disable global-require */
    const fs = require("fs");
    /* eslint-enable global-require */
    return Promise.resolve({
      text() {
        return Promise.resolve(fs.readFileSync(url).toString());
      }
    });
  }
};

const requestAnimationFrameFns = {
  wx(callback) {
    return wx.requestAnimationFrame(callback);
  },
  browser(callback) {
    return window.requestAnimationFrame(callback);
  },
  node(callback) {
    return setTimeout(callback, 17);
  }
};
/* eslint-enable no-undef */

const fetch = fetchFns[env];
const requestAnimationFrame = requestAnimationFrameFns[env];

/**
 * Game 类
 * @class
 *
 * @param {Object} canvas DOM对象，或者node.js 下 require('canvas').createCanvas()
 * @param {Function} Image 图片构造函数，浏览器下为 window.Image, node.js 下为 require('canvas').Image
 * @param {Number} width 期望的画布宽度，浏览器下全拼为 document.documentElement.clientWidth
 * @param {Number} height 期望的画布高度，浏览器下全拼为 document.documentElement.clientHeight
 * @param {[Number]} [widthRange] 画布宽度取值范围，不设置则宽度严格等于 width
 * @param {[Number]} [heightRange] 画布高度取值范围，不设置则宽度严格等于 heigth
 */
class Game {
  /** Create a game instance */
  constructor(canvas, Image, width, height, widthRange, heightRange) {
    this.debuggerInfoColor = "#000000";
    this.env = "development"; // 控制游戏是什么模式
    this.fno = 0; // 程序主帧
    this.isPause = false; // 游戏是否暂停
    this.Image = Image; // 图片构造函数，用来加载资源
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.drawImgs = {}; // 合成图片绘制参数管理
    this.imgMaps = {}; // 合成图片分片管理器
    this.scene = null; // 当前场景名称
    this.imgMaps = {};
    this.R = {}; // 资源管理器
    this.scenes = {}; // 场景管理器
    this.actors = {}; // 角色管理器
    this.callbacks = new Map(); // 帧事件管理器
    if (widthRange) {
      this.w = Math.max(widthRange[0], Math.min(widthRange[1], width));
    } else {
      this.w = width;
    }
    if (heightRange) {
      this.h = Math.max(heightRange[0], Math.min(heightRange[1], height));
    } else {
      this.h = height;
    }
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.reset();
  }

  /**
   * 重置游戏参数, 例如积分
   *
   * @return {void}
   */
  reset() {}

  /**
   * 初始化并开始游戏
   * @param {Array.Object} resources 游戏所需静态资源对象 key => value 格式， key 为资源名称，value为object，格式如下
   * {
   *   type: 'image', // audio, video, image
   *   name: 'name', // 资源名称，预加载后会存入 this.R 方便随时获取
   *   url: 'https://urladress/', // 资源地址
   *   map: 'https://urladress/' // 图片资源对应的定位信息文件, 仅 type = image 有效
   * }
   *
   * @return {void}
   */
  async init(resources) {
    // 约束画布的宽高为屏幕的宽高
    await this.loadResources(resources);
    this.start();
  }

  // 创建角色, 并非游戏全部角色
  // 这里创建的角色一般为多场景共用的单一角色
  // 场景特有的角色一般在场景内创建
  createActors() {}

  // 创建场景
  createScenes() {}

  // 点击、轻触事件
  clickHandler(event) {
    const { changedTouches, clientX, clientY } = event;
    const x = (changedTouches && changedTouches[0].clientX) || clientX;
    const y = (changedTouches && changedTouches[0].clientY) || clientY;
    this.scene.click(x, y);
  }

  // 开始事件监听
  listenEvent() {
    if (typeof document === "undefined" && typeof wx === "undefined") return;
    const eventName = "ontouchstart" in document ? "ontouchstart" : "onclick";
    this.canvas[eventName] = this.clickHandler.bind(this);
  }

  // 开始游戏，游戏资源全部加载完毕后
  start() {
    // 创建公共角色
    this.createActors();

    // 创建场景
    this.createScenes();

    // 进入start场景
    this.enter("start");

    // 事件监听
    this.listenEvent();
    this.draw = this.draw.bind(this);

    // 游戏主循环启动
    requestAnimationFrame(this.draw);
  }

  draw() {
    requestAnimationFrame(this.draw);
    if (this.isPause) return;
    this.fno += 1;
    // 擦除
    this.ctx.clearRect(0, 0, this.w, this.h);
    // 场景更新
    this.scene.update();
    // 场景渲染
    this.scene.render();
    // 输出调试信息
    if (this.env === "development") this.debugg();
    // 事件函数执行
    const handlers = this.callbacks.get(this.fno);
    if (handlers) {
      for (const handler of handlers) handler();
      this.callbacks.delete(this.fno);
    }
  }

  debugg() {
    this.ctx.font = "20px serif";
    this.ctx.fillStyle = this.debuggerInfoColor;
    this.ctx.fillText(`Fno: ${this.fno}`, 5, 20);
    this.ctx.fillText(`Scene: ${this.scene.name}`, 5, 40);
  }

  // 进入某个场景
  enter(name) {
    if (!name) throw Error("场景名不能为空");
    const scene = this.scenes[name];
    if (!scene) throw Error(`不存在此场景 ${name}`);
    this.scene = scene;
    scene.enter();
  }

  // 解析图片map
  // name x y w h 总共五个值
  parseImageMap(img, map) {
    map
      .trim()
      .split("\n")
      .forEach(line => {
        const [name, x, y, w, h] = line.split(" ").map((n, i) => {
          if (i) return parseInt(n, 10);
          return n;
        });
        this.imgMaps[name] = { x, y, w, h };
        this.drawImgs[name] = [img, x, y, w, h, 0, 0, w, h];
      });
  }

  /**
   * 显示资源加载 loading 效果
   * @param {Array.URL} resources 游戏所需静态资源url列表
   *
   * @return {void}
   */
  progress(percent) {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.ctx.textAlign = "center";
    this.ctx.font = "14px Arial";
    this.ctx.fillText(
      `Loading resources ${percent} / 100...`,
      this.w >> 1,
      150
    );
    this.ctx.restore();
  }

  /**
   * 加载游戏所需静态资源
   * @param {Array.Object} resources 游戏所需静态资源对象 key => value 格式， key 为资源名称，value为object，格式如下
   * {
   *   type: 'image', // audio, video, image
   *   name: 'name', // 资源名称，预加载后会存入 this.R 方便随时获取
   *   url: 'https://urladress/', // 资源地址
   *   map: 'https://urladress/' // 图片资源对应的定位信息文件, 仅 type = image 有效
   * }
   *
   * @return {void}
   */
  async loadResources(resources) {
    const { length } = resources;
    let count = 0; // 记录已完成的数量
    this.progress(0); // 显示 loading 效果
    return new Promise((resolve, reject) => {
      for (const { name, type, url, map } of resources) {
        // TODO 暂时只支持图片类型的预加载
        if (type !== "image") continue;
        const img = new this.Image();
        img.onload = () => {
          this.R[name] = img;
          if (map) {
            fetch(map)
              .then(res => res.text())
              .then(text => {
                this.parseImageMap(img, text);
                count += 1;
                this.progress(((count * 100) / length) | 0);
                if (count === length) resolve();
              })
              .catch(reject);
          } else {
            count += 1;
            const { width: w, height: h } = img;
            this.progress(((count * 100) / length) | 0);
            this.imgMaps[name] = { x: 0, y: 0, w, h };
            this.drawImgs[name] = [img, 0, 0, w, h, 0, 0, w, h];
            if (count === length) resolve();
          }
        };
        img.onerror = reject;
        img.src = url;
      }
    });
  }

  /**
   * 水平居中绘制图片获取图片切片
   * @param {string} name 图片名称
   * @param {number} y 在画布上的y坐标
   *
   * @return {void}
   */
  drawImageAlignCenterByName(name, y) {
    const args = this.drawImgs[name];
    if (!args) throw Error("图片不存在");
    args[5] = (this.w - args[3]) >> 1;
    args[6] = y;
    this.ctx.drawImage(...args);
  }

  /**
   * 绘制图片获取图片切片
   * @param {string} name 图片名称
   * @param {number} x 在画布上的x坐标
   * @param {number} y 在画布上的y坐标
   *
   * @return {void}
   */
  drawImageByNameFullScreen(name) {
    const args = this.drawImgs[name];
    if (!args) throw Error("图片不存在");
    args[5] = 0;
    args[6] = 0;
    args[7] = this.w;
    args[8] = this.h;
    this.ctx.drawImage(...args);
  }

  /**
   * 绘制图片获取图片切片
   * @param {string} name 图片名称
   * @param {number} x 在画布上的x坐标
   * @param {number} y 在画布上的y坐标
   *
   * @return {void}
   */
  drawImageByName(name, x, y) {
    const args = this.drawImgs[name];
    if (!args) throw Error("图片不存在");
    args[5] = x;
    args[6] = y;
    this.ctx.drawImage(...args);
  }

  /**
   * 注册帧回调函数
   * @param {number} frames 多少帧之后
   * @param {function} handler 执行的事件函数
   *
   * @return {void}
   */
  registCallback(frames, handler) {
    const fno = this.fno + frames;
    const handlers = this.callbacks.get(fno) || [];
    if (!handler.length) this.callbacks.set(fno, handlers);
    handlers.push(handler);
  }
}

Game.Actor = Actor;
Game.Scene = Scene;

module.exports = Game;

}).call(this,require('_process'))
},{"./actor":8,"./scene":10,"_process":3,"fs":2}],10:[function(require,module,exports){
/**
 * Scene 类
 * @class
 * @param {Game} game 游戏实例
 * @return {Scene} Instance
 */
class Scene {
  /** Create a scene instance */
  constructor(game, name) {
    // 当前场景需要的角色名称
    this.actors = [];

    this.name = name;
    this.game = game;
  }

  /**
   * 更新各成员
   *
   * @return {void}
   */
  update() {
    for (const key of this.actors) {
      const actor = this.game.actors[key];
      if (!actor) continue;
      if (Array.isArray(actor)) {
        for (const x of actor) x.update(actor);
      } else {
        actor.update();
      }
    }
  }

  /**
   * 渲染各成员
   *
   * @return {void}
   */
  render() {
    for (const key of this.actors) {
      const actor = this.game.actors[key];
      if (!actor) continue;
      if (Array.isArray(actor)) {
        for (const x of actor) x.render();
      } else {
        actor.render();
      }
    }
  }

  /**
   * 进入场景
   *
   * @return {void}
   */
  enter() {
    throw Error("进入场景无法实现公用方法, 请子类实现");
  }

  /**
   * 点击事件
   *
   * @return {void}
   */
  click(x, y) {
    for (const key of this.actors) {
      const actor = this.game.actors[key];
      if (actor.click) actor.click(x, y);
    }
  }
}

module.exports = Scene;

},{}]},{},[1]);
