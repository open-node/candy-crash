(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const resources = [
  { name: "replay", type: "image", url: "images/replay.png" },
  { name: "levelBg", type: "image", url: "images/levelBg.png", scale: 0.5 },
  { name: "lock", type: "image", url: "images/lock.png", scale: 0.3 },
  { name: "unlock", type: "image", url: "images/unlock.png", scale: 0.3 },
  {
    name: "numbers",
    type: "image",
    url: "images/numbers.png",
    map: "images/numbers.txt"
  },
  { name: "avatar", type: "image", url: "images/avatar.png", scale: 0.5 },
  { name: "beautiful", type: "image", url: "images/beautiful.png", scale: 0.5 },
  { name: "bg0", type: "image", url: "images/bg0.png", scale: 0.5 },
  { name: "block1", type: "image", url: "images/block1.png", scale: 0.5 },
  { name: "block2", type: "image", url: "images/block2.png", scale: 0.5 },
  { name: "block3", type: "image", url: "images/block3.png", scale: 0.5 },
  { name: "block4", type: "image", url: "images/block4.png", scale: 0.5 },
  { name: "block5", type: "image", url: "images/block5.png", scale: 0.5 },
  { name: "bomb", type: "image", url: "images/bomb.png", scale: 0.5 },
  {
    name: "bombActive",
    type: "image",
    url: "images/bombActive.png",
    scale: 0.5
  },
  {
    name: "congrantLarge",
    type: "image",
    url: "images/congrantLarge.png",
    scale: 0.5
  },
  {
    name: "congrantSmall",
    type: "image",
    url: "images/congrantSmall.png",
    scale: 0.5
  },
  { name: "goal1000", type: "image", url: "images/goal1000.png", scale: 0.5 },
  { name: "good", type: "image", url: "images/good.png", scale: 0.5 },
  { name: "mallet", type: "image", url: "images/mallet.png", scale: 0.5 },
  {
    name: "malletActive",
    type: "image",
    url: "images/malletActive.png",
    scale: 0.5
  },
  { name: "iconBack", type: "image", url: "images/iconBack.png", scale: 0.5 },
  { name: "magic", type: "image", url: "images/magic.png", scale: 0.5 },
  { name: "perfect", type: "image", url: "images/perfect.png", scale: 0.5 },
  { name: "ranking", type: "image", url: "images/ranking.png", scale: 0.5 },
  { name: "reset", type: "image", url: "images/reset.png", scale: 0.5 },
  {
    name: "resetActive",
    type: "image",
    url: "images/resetActive.png",
    scale: 0.5
  },
  { name: "soundOff", type: "image", url: "images/soundOff.png", scale: 0.5 },
  { name: "soundOn", type: "image", url: "images/soundOn.png", scale: 0.5 },
  { name: "topBg0", type: "image", url: "images/topBg0.png", scale: 0.5 },
  { name: "veryGood", type: "image", url: "images/veryGood.png", scale: 0.5 }
];

module.exports = resources;

},{}],2:[function(require,module,exports){
const Game = require("./src/game");
const resources = require("./images/resources");

const canvas = document.getElementById("mycanvas");
const { clientWidth: width, clientHeight: height } = document.documentElement;

const game = new Game(canvas, Image, width, height, [320, 414], [640, 812]);
game.env = "production";
game.init(resources);
window.game = game;

},{"./images/resources":1,"./src/game":24}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
const { Actor } = require("open-game");

class Avatar extends Actor {
  render() {
    this.game.drawImageByName("userAvatar", 30, 60, 60, 60);
  }
}

module.exports = Avatar;

},{"open-game":28}],6:[function(require,module,exports){
const { Actor } = require("open-game");

class Back extends Actor {
  reset() {
    this.x = 20;
    this.y = 20;
  }

  mousedown(x, y) {
    if (this.isItOn(x, y)) this.game.enter("start");
  }

  render() {
    this.game.drawImageByName("iconBack", this.x, this.y, this.w, this.h);
  }
}

module.exports = Back;

},{"open-game":28}],7:[function(require,module,exports){
const { Actor } = require("open-game");

class Bg extends Actor {
  render() {
    this.game.drawImageByNameFullScreen("bg0");
  }
}

module.exports = Bg;

},{"open-game":28}],8:[function(require,module,exports){
const { Actor } = require("open-game");

class Block extends Actor {
  constructor(game, code, x, y) {
    super(game, { w: game.opts.blocksize, h: game.opts.blocksize });
    this.code = +code;

    // 是否被点击选中
    this.actived = false;
    this.alpha = 1; // 选中后的效果
    this.da = 0.03; // 透明度变化量

    this.x = x;
    this.y = y;

    // 处理爆炸效果的相关属性
    this.bombingFrames = 0; // 爆炸效果剩余帧数
    this.bombAlpha = 1; // 淡出效果
    this.bombed = false;

    // 处理运动相关的属性
    this.movingFrames = 0; // 运动剩余帧数
    this.tx = 0; // 运动目标x坐标
    this.ty = 0; // 运动目标y坐标
  }

  update() {
    if (this.bombed) return;

    // 爆炸消失效果
    if (0 < this.bombingFrames) {
      this.bombAlpha -= this.bombAlpha / this.bombingFrames;
      this.bombingFrames -= 1;
      if (this.bombingFrames === 0) this.bombed = true;
    }

    // 处理运动及位移
    if (0 < this.movingFrames) {
      this.x += (this.tx - this.x) / this.movingFrames;
      this.y += (this.ty - this.y) / this.movingFrames;
      this.movingFrames -= 1;
    }

    // 点击选中效果
    if (this.actived) {
      if (this.alpha <= 0 || 1 <= this.alpha) this.da = 0 - this.da;
      this.alpha += this.da;
    }
  }

  bomb(frames) {
    // 防止除零错误，这里强制动画至少维持两帧
    this.bombingFrames = Math.max(2, frames);
    this.bombAlpha = 1;
  }

  moveTo(frames, tx, ty) {
    this.tx = tx;
    this.ty = ty;
    this.movingFrames = frames;
  }

  render() {
    if (this.bombed) return;
    if (this.actived) {
      // 绘制选中效果
      this.game.ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      this.game.ctx.fillRect(this.x - 4, this.y - 4, this.w + 8, this.h + 8);
    }

    if (this.bombingFrames) {
      this.game.ctx.save();
      this.game.ctx.globalAlpha = this.bombAlpha;
    }
    this.game.drawImageByName(
      `block${this.code}`,
      this.x,
      this.y,
      this.w,
      this.h
    );
    if (this.bombingFrames) this.game.ctx.restore();
  }
}

module.exports = Block;

},{"open-game":28}],9:[function(require,module,exports){
const { Actor } = require("open-game");

class ImageEffect extends Actor {
  constructor(game, name, align, rAlign, clickHandler, ox = 0, oy = 0) {
    super(game, game.imgMaps[name]);
    this.ox = ox;
    this.oy = oy;
    if (align) {
      this.align = align;
      this.xAlign();
    }
    if (rAlign) {
      this.rAlign = rAlign;
      this.yAlign();
    }
    this.name = name;
    this.clickHandler = clickHandler;
  }

  xAlign(value = this.align) {
    if (value === "left") {
      this.x = this.ox;
    } else if (value === "right") {
      this.x = this.game.w - this.w - this.ox;
    } else if (value === "center") {
      this.x = (this.game.w - this.w) / 2;
    } else {
      throw Error("不合法水平对齐方式， `left`, `right`, `center`");
    }
  }

  yAlign(value = this.rAlign) {
    if (value === "top") {
      this.y = this.oy;
    } else if (value === "bottom") {
      this.y = this.game.h - this.h - this.oy;
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
    this.hiding = false;
    this.scale = 1;
    this.alpha = 1;
    this.dScale = 0;
    this.xAlign();
    this.yAlign();
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
    if (!this.visable || this.hiding) return;
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

},{"open-game":28}],10:[function(require,module,exports){
const { Actor } = require("open-game");

class LevelItem extends Actor {
  constructor(game, level, x, y, w, h) {
    super(game);
    this.value = level;
    this.w = w;
    this.h = h;
    this.actived = false; // 是否被选中
    this.isFinished = false;
    this.record = null; // 通过关卡的最高纪录
    this.x = x;
    this.y = y;
  }

  mousedown(x, y) {
    if (this.actived && this.isItOn(x, y)) {
      this.actived = true;
      return true;
    }
    return false;
  }

  render() {
    const { ctx } = this.game;
    // 绘制背景
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(this.x, this.y, this.w, this.h);

    // 绘制当前选中效果
    if (this.actived) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ddd";
      ctx.strokeRect(this.x, this.y, this.w, this.h);
    }

    // 绘制是否通关的图标
    this.game.drawImageByName(
      this.isFinished ? "unlock" : "lock",
      this.x + this.w - 30,
      this.y + 10,
      20,
      22
    );
    ctx.font = "18px 微软雅黑";
    ctx.fillStyle = "#aaa";
    ctx.textAlign = "left";
    this.game.ctx.fillText(this.value.name, this.x + 10, this.y + 27);
    ctx.fillStyle = "#666";
    ctx.font = "14px 微软雅黑";
    ctx.textAlign = "left";
    this.game.ctx.fillText(
      `目标: ${this.value.score}`,
      this.x + 10,
      this.y + 53
    );
    this.game.ctx.fillText(
      `时限: ${this.value.time} 秒`,
      this.x + 10,
      this.y + 80
    );
  }
}

module.exports = LevelItem;

},{"open-game":28}],11:[function(require,module,exports){
const { Actor } = require("open-game");
const config = require("../data/level");

class Level extends Actor {
  reset() {
    const { topBg } = this.game.actors;
    this.value = null;
    this.x = topBg.x + 30;
    this.y = topBg.y + topBg.h - 20 - this.h;
  }

  setValue(index) {
    this.value = config[index];
  }

  isAchieved(score) {
    return this.value.score <= score;
  }

  mousedown(x, y) {
    if (this.isItOn(x, y)) this.game.enter("level");
  }

  render() {
    const { ctx } = this.game;
    this.game.drawImageByName("levelBg", this.x, this.y, this.w, this.h);
    ctx.save();
    ctx.font = "12px 微软雅黑";
    ctx.fillStyle = "#dddd20";
    ctx.textAlign = "center";
    ctx.fillText(this.value.name, this.x + this.w / 2, this.y + 4 + this.h / 2);
    ctx.font = "18px 微软雅黑";
    ctx.fillText(
      `目标: ${this.value.score}`,
      this.game.w >> 1,
      this.game.actors.topBg.h * 0.193
    );
    ctx.restore();
  }
}

module.exports = Level;

},{"../data/level":23,"open-game":28}],12:[function(require,module,exports){
const { Actor } = require("open-game");
const config = require("../data/level");
const LevelItem = require("./level-item");

class Levels extends Actor {
  reset() {
    const { topBg } = this.game.actors;
    this.curr = config[0];
    this.padding = 6;
    this.x = this.padding;
    this.y = topBg.y + topBg.h + this.padding;

    const records = this.game.getRecords();
    const cols = 3;
    const w = 100;
    const h = 100;
    const lineHeight = (this.game.h - this.y) / Math.ceil(config.length / cols);
    const gap = (this.game.w - this.padding * 2 - w * cols) / (cols - 1);
    this.items = config.map((level, i) => {
      const ix = this.padding + (i % cols) * (gap + w);
      const iy = this.y + lineHeight * ((i / cols) | 0);
      const item = new LevelItem(this.game, level, ix, iy, w, h);
      if (records[i]) {
        item.isFinished = true;
        item.record = records[i];
      }
      return item;
    });
    this.currActived = this.game.getCurrLevel();
    this.items[this.currActived].actived = true;
  }

  mousedown(x, y) {
    for (let i = 0; i < config.length; i += 1) {
      const item = this.items[i];
      if (item.mousedown(x, y)) {
        this.items[this.currActived].actived = false;
        this.currActived = i;
        this.items[this.currActived].actived = true;
        break;
      }
    }
  }

  render() {
    for (const item of this.items) item.render();
  }
}

Levels.config = config;

module.exports = Levels;

},{"../data/level":23,"./level-item":10,"open-game":28}],13:[function(require,module,exports){
const { Actor } = require("open-game");
const Block = require("./block");
const Timer = require("./timer");
const ImageEffect = require("./image-effect");
const Tools = require("./tools");
const Numbers = require("./numbers");
const Level = require("./level");

class Map extends Actor {
  // 开始游戏
  start(level) {
    if (level == null) {
      level = this.levelComplated
        ? this.game.nextLevel()
        : this.game.getCurrLevel();
    }
    this.levelComplated = false;
    this.game.setCurrLevel(level);
    this.game.actors.level.currActived = level;
    this.game.actors.level.setValue(level);
    this.game.actors.timer.start(this.game.actors.level.value.time * 60);
    this.game.actors.score.setValue(0);
    // 记录当前地图中block的情况
    this.blocksReset();
  }

  reset() {
    const { game } = this;
    const {
      blocksize,
      blocknum,
      cols,
      rows,
      prim,
      gap,
      padding: [top, , bottom, left]
    } = game.opts;

    this.levelComplated = false; // 关卡是否完成

    const { topBg } = game.actors;

    this.rows = rows;
    this.cols = cols;
    this.blocksize = blocksize;
    this.blocknum = blocknum;
    this.prim = prim;
    this.gap = gap;

    // 记录一次性消除的blocks数量，连续消除也算
    this.removedBlocks = 0;

    // 记录当前被点击选中的块
    this.currActived = null;

    // 计算地图区域的起始坐标以及宽高
    this.x = left;
    this.y = game.h - blocksize * rows - (rows - 1) * gap - bottom;
    this.w = game.w - this.x * 2;
    this.h = game.h - this.y - bottom;
    if (this.y < top) throw Error("画布太小无法展示");

    // 关卡选择
    game.actors.level = new Level(this.game, this.game.imgMaps.levelBg);
    game.actors.level.setValue(this.game.getCurrLevel() | 0);

    // 积分系统
    const scoreY = (topBg.h >> 1) - 35;
    game.actors.score = new Numbers(game, 0.5, 0, 0, scoreY, 5, "center");

    // 记录鼠标移动的位置
    this.mx = 0;
    this.my = 0;

    // 初始化定时器
    game.actors.timer = new Timer(
      this.game,
      { w: this.w - this.x * 2, h: 20 },
      this.x,
      this.y - 35,
      () => {
        this.fsm = "end";
        this.cancelActivedBlock();
        this.cancelActivedTool();
        // 判断是否过关
        if (game.actors.level.isAchieved(game.actors.score.value)) {
          game.setCurrRecord(game.actors.score.value);
          this.levelComplated = true;
          game.registCallback(60, () => game.actors.replay.show());
        } else {
          game.actors.replay.show();
        }
      }
    );

    game.actors.congrantSmall = new ImageEffect(
      game,
      "congrantSmall",
      "right",
      "top",
      null,
      30,
      50
    );
    game.actors.congrantLarge = new ImageEffect(
      game,
      "congrantLarge",
      "center",
      "gold"
    );

    // 赞美系列
    game.actors.good = new ImageEffect(game, "good", "center", "gold");
    game.actors.veryGood = new ImageEffect(game, "veryGood", "center", "gold");
    game.actors.beautiful = new ImageEffect(
      game,
      "beautiful",
      "center",
      "gold"
    );
    game.actors.perfect = new ImageEffect(game, "perfect", "center", "gold");
    // 重玩按钮
    game.actors.replay = new ImageEffect(
      game,
      "replay",
      "center",
      "gold",
      () => {
        game.actors.replay.hide(36);
        game.registCallback(36, this.start.bind(this));
      }
    );

    // 道具卡片
    let toolX = 110;
    const toolW = game.imgMaps.bomb.w;
    const toolGap = (game.w - toolX - 16 - toolW * 4) / 3;
    // 道具卡下边缘距离 topBg 的下边缘 40 像素
    const toolY = topBg.y + topBg.h - toolW - 40;
    for (const [name, Tool] of Tools) {
      game.actors[`${name}Card`] = new Tool(game, 1, toolX, toolY);
      toolX += toolW + toolGap;
    }

    // 开始游戏
    this.start(game.getCurrLevel());
  }

  blocksReset() {
    this.blocks = [];
    for (let i = 0; i < this.rows; i += 1) this.blocks[i] = Array(this.cols);

    // 记录当前状态机状态
    // 利用有限状态机来管理各种状态
    // 1. stable 静稳状态, 等待用户操作
    // 2. removing 判断并消除状态
    // 3. falling 下落状态, 消除后有些空隙，下落对齐
    // 4. suppling 补充状态, 消除之后，对齐之后，需要补充新的 block 进来
    // 5. end 游戏结束状态
    // 6. usingTool 使用道具状态
    // 7. animation 动画状态, 各种补间动画状态
    this.fsm = "suppling"; // 初始状态补充blocks
  }

  calcPraise(score) {
    if (score < 50) return null;
    if (1000 <= score) return "perfect";
    if (500 <= score) return "veryGood";
    if (200 <= score) return "beautiful";
    return "good";
  }

  calcScore(nums) {
    if (!nums) return 0;
    const times = nums >> 1;

    return nums * times;
  }

  // 根据行列号计算block所在的坐标起始点(左上角)
  where(r, c) {
    return [
      this.x + c * (this.blocksize + this.gap),
      this.y + r * (this.blocksize + this.gap)
    ];
  }

  // 根据x, y 坐标值判断是那个block
  which(x, y) {
    return [
      ((y - this.y) / (this.blocksize + this.gap)) | 0,
      ((x - this.x) / (this.blocksize + this.gap)) | 0
    ];
  }

  // 取消激活的块
  cancelActivedBlock() {
    if (!this.currActived) return;
    const [c, r] = this.currActived;
    this.blocks[c][r].actived = false;
    this.currActived = null;
  }

  // 取消激活的工具
  cancelActivedTool() {
    if (!this.currTool) return;
    this.currTool.cancelActived();
    this.currTool = null;
  }

  mousedown(x, y) {
    // 只有静稳状态和道具使用状态才可以操作
    if (this.fsm !== "stable" && this.fsm !== "usingTool") return;
    this.cancelActivedBlock();

    this.cancelActivedTool();
    for (const [name] of Tools) {
      const tool = this.game.actors[`${name}Card`];
      if (tool.requestActived(x, y)) {
        // 点击的这个和上一个不同
        if (this.currTool !== tool) {
          this.currTool = tool;
          this.fsm = "usingTool";
          // 执行选中函数，如果返回true，则继续监听移动事件
          // 说明道具不是选中就直接使用了。需要继续在map上移动
          // 选择待作用的 block
          if (this.currTool.selected(this)) {
            // 按下的时候同时开始监听移动，道具卡跟随鼠标
            this.game.listenEvent("onmousemove", "mousemove");
          } else {
            // 选中直接开始使用
            this.currTool.use(this);
            this.cancelActivedTool();
          }
        } else {
          tool.cancelActivedTool();
          this.fsm = "stable";
        }
        return;
      }
    }

    if (this.fsm !== "stable") return;
    // 按下的时候同时开始监听移动，这就是拖拽效果
    this.game.listenEvent("onmousemove", "mousemove");

    if (!this.isItOn(x, y)) return;

    // 根据 x, y 来计算应该是哪个 block 被点击，这样比挨个尝试速度快很多
    this.currActived = this.which(x, y);
    this.blocks[this.currActived[0]][this.currActived[1]].actived = true;
  }

  mouseup(x, y) {
    if (this.fsm === "stable") {
      this.cancelActivedBlock();
      // 松开的时候移动移动事件监听
      this.game.removeListenEvent("onmousemove");
    }

    if (this.fsm === "usingTool") {
      if (!this.isItOn(x, y)) {
        this.cancelActivedTool();
      } else {
        // 使用道具
        this.currActived = this.which(x, y);
        this.currTool.use(this);
        this.cancelActivedTool();
      }
    }
  }

  mousemove(x, y) {
    if (this.fsm === "stable") {
      if (this.currActived && this.isItOn(x, y)) {
        const [r, c] = this.currActived;
        const [i, j] = this.which(x, y);
        if (
          // 要交换的二者不一样，一样交换没有意义
          this.blocks[r][c].code !== this.blocks[i][j].code &&
          // 上下判断，列号相同，行号相差一
          ((c === j && Math.abs(r - i) === 1) ||
            // 左右判断判断, 行号相同，列号差一
            (r === i && Math.abs(c - j) === 1))
        ) {
          this.swap(r, c, i, j);
          // 移除移动事件监听
          this.cancelActivedBlock();
          // 松开的时候移动移动事件监听
          this.game.removeListenEvent("onmousemove");
        }
      }
    }

    if (this.fsm === "usingTool") {
      this.currTool.setMouseXY(x, y, this);
    }
  }

  // 计算将要被消除的块
  calcWillBeRemoved() {
    const list = [];
    // 逐行扫描查找
    for (let i = 0; i < this.rows; i += 1) {
      for (let j = 0, k = 1; k <= this.cols; k += 1) {
        if (
          k === this.cols ||
          this.blocks[i][j].code !== this.blocks[i][k].code
        ) {
          if (2 < k - j) {
            for (let x = j; x < k; x += 1) list.push([i, x]);
          }
          j = k;
        }
      }
    }
    // 逐列扫描查找
    for (let j = 0; j < this.cols; j += 1) {
      for (let i = 0, k = 1; k <= this.rows; k += 1) {
        if (
          k === this.rows ||
          this.blocks[i][j].code !== this.blocks[k][j].code
        ) {
          if (2 < k - i) {
            for (let x = i; x < k; x += 1) list.push([x, j]);
          }
          i = k;
        }
      }
    }
    if (!list.length) return null;
    // 借助于 Set 来去重
    return Array.from(new Set(list.map(x => x.join("_")))).map(x =>
      x.split("_")
    );
  }

  // remove 消除一个块
  remove(frames, r, c) {
    this.blocks[r][c].bomb(frames);
    this.game.registCallback(frames, () => {
      this.blocks[r][c] = null;
    });
  }

  // 交换两个 block
  swap(r, c, i, j, isValid = true) {
    // 图形交换
    this.blocks[r][c].moveTo(10, ...this.where(i, j));
    this.blocks[i][j].moveTo(10, ...this.where(r, c));
    // 数据交换
    this.game.registCallback(10, () => {
      const t = this.blocks[r][c];
      this.blocks[r][c] = this.blocks[i][j];
      this.blocks[i][j] = t;

      // 判断是否需要验证，还原的时候也是用这个函数，但是不需要验证了。
      if (isValid) {
        if (!this.calcWillBeRemoved()) {
          // 如果不能消除，说明刚才的交换是错误的，需要恢复
          this.swap(i, j, r, c, false);
        } else {
          this.fsm = "removing";
        }
      }
    });
  }

  // 随机出一个码
  random() {
    return 1 + (((Math.random() * this.prim) | 0) % this.blocknum);
  }

  // 补充新的进来
  supply(frames) {
    for (let i = 0; i < this.rows; i += 1) {
      for (let j = 0; j < this.cols; j += 1) {
        if (!this.blocks[i][j]) {
          const code = this.random();
          this.blocks[i][j] = new Block(this.game, code, ...this.where(-10, j));
          this.blocks[i][j].moveTo(frames, ...this.where(i, j));
        }
      }
    }
  }

  // 下落对齐
  fall(frames) {
    // 逐列从底到顶判断
    for (let j = 0; j < this.cols; j += 1) {
      let count = 0;
      for (let i = this.rows - 1; 0 <= i; i -= 1) {
        if (!this.blocks[i][j]) {
          count += 1;
        } else if (count) {
          this.blocks[i][j].moveTo(frames, ...this.where(i + count, j));
          this.blocks[i + count][j] = this.blocks[i][j];
          this.blocks[i][j] = null;
        }
      }
    }
  }

  update() {
    if (this.fsm === "removing") {
      // 暂停计时器
      this.game.actors.timer.stop();
      const willRemoved = this.calcWillBeRemoved();
      // 如果没有需要消除的，则进入静稳状态
      if (!willRemoved) {
        // 如果有消除掉块，则加分
        const score = this.calcScore(this.removedBlocks);
        this.game.actors.score.add(score);
        if (this.game.actors.level.isAchieved(this.game.actors.score.value)) {
          this.game.actors.congrantSmall.show();
        }
        // 分数已经加完，重置计数器
        this.removedBlocks = 0;

        // 判断是否需要赞美一下
        const praise = this.calcPraise(score);
        if (praise) {
          this.game.actors[praise].show();
          this.game.actors[praise].hide(60);
          // 进入动画状态
          this.fsm = "animation";
          // 动画结束后进入消除状态
          this.game.registCallback(20, () => {
            this.fsm = "stable";
            // 继续计时器
            this.game.actors.timer.run();
          });
        } else {
          // 继续计时器
          this.game.actors.timer.run();
          this.fsm = "stable";
        }
      } else {
        this.removedBlocks += willRemoved.length;
        // 反之需要消除，进入动画状态
        this.fsm = "animation";
        // 移除这些模块
        willRemoved.forEach(x => this.remove(20, ...x));
        // 动画结束后进入下落状态
        this.game.registCallback(20, () => {
          this.fsm = "falling";
        });
      }
    } else if (this.fsm === "falling") {
      // 暂停计时器
      this.game.actors.timer.stop();
      // 下落
      this.fall(20);
      // 进入动画状态
      this.fsm = "animation";
      // 动画结束后进入补充状态
      this.game.registCallback(20, () => {
        this.fsm = "suppling";
      });
    } else if (this.fsm === "suppling") {
      // 暂停计时器
      this.game.actors.timer.stop();
      this.supply(20);
      // 进入动画状态
      this.fsm = "animation";
      // 动画结束后进入消除状态
      this.game.registCallback(20, () => {
        this.fsm = "removing";
      });
    }
  }

  render() {
    for (let i = 0; i < this.game.opts.rows; i += 1) {
      for (let j = 0; j < this.game.opts.cols; j += 1) {
        const block = this.blocks[i][j];
        if (!block) continue;
        block.update();
        block.render();
      }
    }
    if (this.fsm === "end") {
      // replay 按钮的黑色半透明背景，提高对比度、识别度
      this.game.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      const padding = this.game.opts.padding[3];
      this.game.ctx.fillRect(
        this.x - padding,
        this.y - padding,
        this.w + padding * 2,
        this.h + padding * 2
      );
    }
  }
}

module.exports = Map;

},{"./block":8,"./image-effect":9,"./level":11,"./numbers":14,"./timer":15,"./tools":18,"open-game":28}],14:[function(require,module,exports){
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
    this.add(value - this.value);
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

},{"open-game":28}],15:[function(require,module,exports){
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

},{"open-game":28}],16:[function(require,module,exports){
const { Actor } = require("open-game");

class Tool extends Actor {
  reset() {
    this.actived = false; // 是否处于激活状态
    this.alpha = 1; // 选中后的效果
    this.da = 0.03; // 透明度变化量
    this.mx = 0;
    this.my = 0;
  }

  requestActived(x, y) {
    // 点击激活，如果当前师激活状态，或者数量为零均返回
    if (this.actived || !this.count || !this.isItOn(x, y)) return false;
    this.actived = true;
    return true;
  }

  setMouseXY(x, y) {
    this.mx = x;
    this.my = y;
  }

  cancelActived() {
    if (!this.actived) return;
    this.actived = false;
  }

  // 选中执行的函数
  selected() {
    return true;
  }

  // 使用执行的函数
  use() {
    this.count -= 1;
  }

  update() {
    // 点击选中效果
    if (this.actived) {
      if (this.alpha <= 0 || 1 <= this.alpha) this.da = 0 - this.da;
      this.alpha += this.da;
    }
  }

  render() {
    const { ctx } = this.game;
    ctx.save();
    ctx.transform(1, 0, 0, 1, this.x, this.y);
    if (this.actived) {
      // 绘制选中效果
      ctx.fillStyle = `rgba(255, 255, 10, ${this.alpha})`;
      ctx.fillRect(-4, -4, this.w + 8, this.h + 8);
    }
    this.game.drawImageByName(this.name, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px 微软雅黑";
    ctx.textAlign = "center";
    ctx.fillText(this.title, this.w / 2, this.h + 16);
    ctx.restore();

    // 绘制数量提示, 右上角
    ctx.beginPath();
    ctx.arc(this.x + this.w - 3, this.y + 3, 10, 0, Math.PI * 2, true);
    ctx.fillStyle = "rgba(255, 30, 30, 0.8)";
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px 微软雅黑";
    ctx.textAlign = "center";
    ctx.fillText(this.count, this.x + this.w - 3, this.y + 8);

    if (this.actived) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      this.game.drawImageByName(
        this.name,
        this.mx - this.w / 2,
        this.my - this.h / 2
      );
      ctx.restore();
    }
  }
}

module.exports = Tool;

},{"open-game":28}],17:[function(require,module,exports){
const Base = require("./base");

class Bomb extends Base {
  constructor(game, count, x, y) {
    super(game, game.imgMaps.bomb);
    this.count = count;
    this.name = "bomb";
    this.title = "炸弹";
    this.x = x;
    this.y = y;
  }

  // 炸弹爆炸最多会炸掉九个, 周围一圈，以及自身
  // 炸掉的块，本身不得分，补充后可以继续玩
  use(map) {
    super.use(map);
    const [r, c] = map.currActived;
    const removes = [
      [r - 1, c - 1], // 左上
      [r - 1, c], // 上
      [r - 1, c + 1], // 右上
      [r, c - 1], // 左
      [r, c], // 中(自身)
      [r, c + 1], // 右
      [r + 1, c - 1], // 左下
      [r + 1, c], // 下
      [r + 1, c + 1] // 右下
    ];

    for (const [i, j] of removes) {
      if (map.blocks[i] && map.blocks[i][j]) map.blocks[i][j] = null;
    }
    map.fsm = "falling";
  }
}

module.exports = Bomb;

},{"./base":16}],18:[function(require,module,exports){
/* eslint-disable global-require */
module.exports = [
  ["bomb", require("./bomb")],
  ["magic", require("./magic")],
  ["reset", require("./reset")],
  ["mallet", require("./mallet")]
];
/* eslint-enable global-require */

},{"./bomb":17,"./magic":19,"./mallet":20,"./reset":21}],19:[function(require,module,exports){
const Base = require("./base");

class Magic extends Base {
  constructor(game, count, x, y) {
    super(game, game.imgMaps.magic);
    this.name = "magic";
    this.title = "魔法棒";
    this.count = count;
    this.x = x;
    this.y = y;
    this.currRow = null;
    this.currCol = null;
    this.currCode = null;
    this.sure = false;
  }

  setMouseXY(x, y, map) {
    if (!map.isItOn(x, y)) {
      if (this.block) this.restore();
      return;
    }
    this.mx = x;
    this.my = y;
    const [r, c] = map.which(x, y);
    if (!this.block) {
      this.save(r, c, map);
    } else if (this.block !== map.blocks[r][c]) {
      this.restore();
      this.save(r, c, map);
    }
  }

  save(r, c, map) {
    this.block = map.blocks[r][c];
    this.currCode = this.block.code;
    this.map = map;
  }

  restore() {
    this.block.code = this.currCode;
    this.block = null;
  }

  use(map) {
    this.sure = true;
    this.block = null;
    this.count -= 1;
    map.fsm = "removing";
  }

  update() {
    if (!this.block) return;
    if (this.game.fno % 60 === 1)
      this.block.code = 1 + ((this.block.code + 1) % this.map.blocknum);
  }
}

module.exports = Magic;

},{"./base":16}],20:[function(require,module,exports){
const Base = require("./base");

class Mallet extends Base {
  constructor(game, count, x, y) {
    super(game, game.imgMaps.mallet);
    this.name = "mallet";
    this.title = "小木槌";
    this.count = count;
    this.x = x;
    this.y = y;
  }

  // 小木槌只能敲掉一块
  // 敲掉的块，本身不得分，补充后可以继续玩
  use(map) {
    super.use(map);
    const [r, c] = map.currActived;
    map.blocks[r][c] = null;
    map.fsm = "falling";
  }
}

module.exports = Mallet;

},{"./base":16}],21:[function(require,module,exports){
const Base = require("./base");

class Reset extends Base {
  constructor(game, count, x, y) {
    super(game, game.imgMaps.reset);
    this.name = "reset";
    this.title = "重置";
    this.count = count;
    this.x = x;
    this.y = y;
  }

  selected() {
    return false;
  }

  use(map) {
    super.use(map);
    map.blocksReset();
  }
}

module.exports = Reset;

},{"./base":16}],22:[function(require,module,exports){
const { Actor } = require("open-game");

class TopBg extends Actor {
  reset() {
    const {
      padding: [, , , left]
    } = this.game.opts;
    this.x = left;
    this.y = left;
    this.w = this.game.w - left * 2;
    this.h = (this.w * this.game.imgMaps.topBg0.h) / this.game.imgMaps.topBg0.w;
  }

  render() {
    this.game.drawImageByName("topBg0", this.x, this.y, this.w, this.h);
  }
}

module.exports = TopBg;

},{"open-game":28}],23:[function(require,module,exports){
const level = [
  { name: "生铁", time: 120, score: 800 },
  { name: "钢铁", time: 100, score: 1000 },
  { name: "青铜", time: 90, score: 1200 },
  { name: "白银", time: 85, score: 1400 },
  { name: "黄金", time: 80, score: 1600 },
  { name: "白金", time: 75, score: 1800 },
  { name: "宝石", time: 70, score: 2000 },
  { name: "钻石", time: 65, score: 2200 },
  { name: "蓝钻", time: 60, score: 2400 },
  { name: "黄钻", time: 55, score: 2400 },
  { name: "粉钻", time: 50, score: 2600 }
];

module.exports = level;

},{}],24:[function(require,module,exports){
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

},{"./actors/avatar":5,"./actors/back":6,"./actors/bg":7,"./actors/levels":12,"./actors/map":13,"./actors/top-bg":22,"./scenes/level":25,"./scenes/start":26,"open-game":28}],25:[function(require,module,exports){
const { Scene } = require("open-game");

class Level extends Scene {
  constructor(game, name) {
    super(game, name);
    this.actors = ["bg", "topBg", "level", "levels", "back"];
  }

  enter() {}
}

module.exports = Level;

},{"open-game":28}],26:[function(require,module,exports){
const { Scene } = require("open-game");

class Start extends Scene {
  constructor(game, name) {
    super(game, name);
    this.actors = [
      "bg",
      "topBg",
      "map",
      "score",
      "timer",
      "good",
      "veryGood",
      "perfect",
      "beautiful",
      "replay",
      "bombCard",
      "magicCard",
      "malletCard",
      "resetCard",
      "congrantSmall",
      "congrantLarge",
      "level"
    ];
  }

  enter() {
    const { currActived } = this.game.actors.levels;
    if (currActived === this.game.getCurrLevel()) return;
    // 如果选择了不一样的关卡，则重新开始游戏
    this.game.actors.map.start(currActived);
  }
}

module.exports = Start;

},{"open-game":28}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
(function (process){
const Actor = require("./actor");
const Scene = require("./scene");

const isURL = /^https?:\/\//i;

// 微信event映射关系
const eventsMap = {
  mobile: {
    onmousedown: "ontouchstart",
    onmouseup: "ontouchend",
    onmousemove: "ontouchmove"
  },
  wx: {
    onmousedown: "onTouchStart",
    onmouseup: "onTouchEnd",
    onmousemove: "onTouchMove"
  }
};

// 获取执行环境，wx, browser，node
const env = (() => {
  if (typeof wx === "object") return "wx";
  if (typeof window === "object") return "browser";
  if (typeof process === "object") return "node";
  throw Error("未知环境");
})();

// 获取平台类型 pc, mobile, unknown
const isMobile = (() => {
  if (env === "node") return "unknown";
  if (typeof wx !== "undefined") return true;
  return typeof document !== "undefined" && "ontouchstart" in document;
})();

/* eslint-disable no-undef */
const fetchFns = {
  wx(url) {
    return Promise.resolve({
      text() {
        return new Promise((success, fail) => {
          if (isURL.test(url)) {
            wx.request({ url, success, fail });
          } else {
            try {
              const fs = wx.getFileSystemManager();
              const content = fs.readFileSync(url);
              if (content instanceof ArrayBuffer) {
                const u8 = new Uint8Array(content);
                const text = String.fromCharCode(...u8);
                success(decodeURIComponent(text));
              } else {
                success(content);
              }
            } catch (e) {
              fail(e);
            }
          }
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
    return requestAnimationFrame(callback);
  },
  browser(callback) {
    return requestAnimationFrame(callback);
  },
  node(callback) {
    return setTimeout(callback, 17);
  }
};
/* eslint-enable no-undef */

const fetch = fetchFns[env];
const requestAnimationFrameFn = requestAnimationFrameFns[env];

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
    this.platform = {
      env,
      isMobile
    };
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
    this.wxEvents = {}; // 记录微信event事件函数，因为off的时候需要，否则取消不掉
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
    this.eventListeners = [["onclick", "click"]];
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

  // 事件执行以及传递
  eventHandler(fnName, event) {
    const { changedTouches, clientX, clientY } = event;
    const x = (changedTouches && changedTouches[0].clientX) || clientX;
    const y = (changedTouches && changedTouches[0].clientY) || clientY;
    if (this.scene.eventHandler) this.scene.eventHandler(fnName, x, y);
  }

  // 添加事件监听
  listenEvent(evt, fnName) {
    if (env === "node") return;
    const listener = this.eventHandler.bind(this, fnName);
    if (env === "wx") {
      const wxEvt = eventsMap.wx[evt];
      wx[wxEvt](listener);
      this.canvas[wxEvt] = listener;
    } else {
      if (isMobile) evt = eventsMap.mobile[evt];
      this.canvas[evt] = listener;
    }
  }

  // 移除事件监听
  removeListenEvent(evt) {
    if (env === "wx") {
      const wxEvt = eventsMap.wx[evt];
      wx[`off${wxEvt.slice(2)}`](this.canvas[wxEvt]);
      this.canvas[wxEvt] = null;
    } else {
      if (isMobile) evt = eventsMap.mobile[evt];
      this.canvas[evt] = null;
    }
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
    if (Array.isArray(this.eventListeners) && this.eventListeners.length) {
      for (const args of this.eventListeners) {
        this.listenEvent(...args);
      }
    }
    this.draw = this.draw.bind(this);

    // 游戏主循环启动
    requestAnimationFrameFn(this.draw);
  }

  draw() {
    requestAnimationFrameFn(this.draw);
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
   * 输出错误信息, 在开发模式下
   * @param {string} msg 错误信息
   *
   * @return {void}
   */
  showMessage(msg, stack) {
    this.ctx.save();
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.ctx.fillStyle = "orange";
    this.ctx.font = "12px 宋体";
    const x = 10;
    let y = 16;
    this.ctx.fillText(msg, x, y);
    if (stack) {
      for (const line of stack.split("\n")) {
        y += 16;
        this.ctx.fillText(line, x, y);
      }
    }
    this.ctx.restore();
  }

  /**
   * 显示资源加载 loading 效果
   * @param {Array.URL} resources 游戏所需静态资源url列表
   *
   * @return {void}
   */
  progress(percent) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.strokeStyle = "rgba(255, 55, 20, 1)";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 150, this.w - 60, 20);
    ctx.fillStyle = "rgba(30, 255, 10, 1)";
    ctx.fillRect(34, 154, Math.max(10, ((this.w - 68) * percent) / 100), 12);
    ctx.textAlign = "center";
    ctx.font = "15px Arial";
    ctx.fillText(`The resources loading... ${percent} %`, this.w / 2, 192);
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
      for (const { name, type, url, map, scale } of resources) {
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
            let { width: w, height: h } = img;
            if (scale) {
              w *= scale;
              h *= scale;
            }
            this.progress(((count * 100) / length) | 0);
            this.imgMaps[name] = { x: 0, y: 0, w, h };
            this.drawImgs[name] = [
              img,
              0,
              0,
              img.width,
              img.height,
              0,
              0,
              w,
              h
            ];
            if (count === length) resolve();
          }
        };
        img.onerror = e => {
          console.error(e);
          reject(e);
        };
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
  drawImageAlignCenterByName(name, y, w, h) {
    const args = this.drawImgs[name];
    if (!args) throw Error("图片不存在");
    args[5] = (this.w - args[7]) >> 1;
    args[6] = y;
    if (w) args[7] = w;
    if (h) args[8] = h;
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
  drawImageByName(name, x, y, w, h) {
    const args = this.drawImgs[name];
    if (!args) throw Error("图片不存在");
    args[5] = x;
    args[6] = y;
    if (w) args[7] = w;
    if (h) args[8] = h;
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
    if (!handlers.length) this.callbacks.set(fno, handlers);
    handlers.push(handler);
  }
}

Game.Actor = Actor;
Game.Scene = Scene;

module.exports = Game;

}).call(this,require('_process'))
},{"./actor":27,"./scene":29,"_process":4,"fs":3}],29:[function(require,module,exports){
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
   * 鼠标事件执行分发
   * eventHandler
   *
   * @param {string} name 事件名称
   * @param {Number} x 鼠标x坐标值
   * @param {Number} y 鼠标y坐标值
   *
   * @return {void}
   */
  eventHandler(name, x, y) {
    for (const key of this.actors) {
      const actor = this.game.actors[key];
      if (!actor) continue;
      if (actor[name]) actor[name](x, y);
    }
  }
}

module.exports = Scene;

},{}]},{},[2]);
