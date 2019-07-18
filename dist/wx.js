(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Game = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
const Actor = require("./actor");
const Scene = require("./scene");

/**
 * Game 类
 * @class
 * @param {Object} convas DOM对象，或者node.js 下 require('canvas').createCanvas()
 * @param {Class} Image 图片构造函数，浏览器下为 window.Image, node.js 下为 require('canvas').Image
 * @param {Number} width 期望的画布宽度，浏览器下全拼为 document.documentElement.clientWidth
 * @param {Number} height 期望的画布高度，浏览器下全拼为 document.documentElement.clientHeight
 * @param {Array.Number} [widthRange] 画布宽度取值范围，不设置则宽度严格等于 width
 * @param {Array.Number} [heightRange] 画布高度取值范围，不设置则宽度严格等于 heigth
 */
class Game {
  /** Create a game instance */
  constructor(canvas, Image, width, height, widthRange, heightRange) {
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
    // 事件函数执行
    const handlers = this.callbacks.get(this.fno);
    if (handlers) {
      for (const handler of handlers) handler();
      this.callbacks.delete(this.fno);
    }

    // 输出调试信息
    if (this.env === "development") this.debugg();
  }

  debugg() {
    this.ctx.font = "20px serif";
    this.ctx.fillStyle = "black";
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

},{"./actor":1,"./scene":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
const { Actor } = require("open-game");

class Bg extends Actor {
  render() {
    this.game.drawImageByNameFullScreen("bg0");
    this.game.drawImageAlignCenterByName("topBg0", 5);
  }
}

module.exports = Bg;

},{"open-game":2}],5:[function(require,module,exports){
const { Actor } = require("open-game");

class Block extends Actor {
  constructor(game, code, x, y) {
    super(game, game.imgMaps[`block${code}`]);
    this.code = code;

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

    this.game.drawImageByName(`block${this.code}`, this.x, this.y);

    // TODO 调试信息
    this.game.ctx.fillStyle = "rgba(0,0,0,1)";
    this.game.ctx.fillText(
      this.code,
      this.x + this.w / 2 - 3,
      this.y + 4 + this.h / 2
    );

    if (this.bombingFrames) this.game.ctx.restore();
  }
}

module.exports = Block;

},{"open-game":2}],6:[function(require,module,exports){
const { Actor } = require("open-game");
const Block = require("./block");

class Map extends Actor {
  reset() {
    const {
      blocksize,
      blocknum,
      cols,
      rows,
      prim,
      gap,
      top,
      bottom
    } = this.game.opts;

    this.rows = rows;
    this.cols = cols;
    this.blocksize = blocksize;
    this.blocknum = blocknum;
    this.prim = prim;
    this.gap = gap;

    // 记录将要被删除的block
    this.willRemoved = null;

    // 记录当前被点击选中的块
    this.currActived = null;

    // 计算地图区域的起始坐标以及宽高
    this.x = (this.game.w - blocksize * cols - (cols - 1) * gap) >> 1;
    this.y = this.game.h - blocksize * rows - (rows - 1) * gap - bottom;
    this.w = this.game.w - this.x * 2;
    this.h = this.game.h - this.y - bottom;
    if (this.y < top) throw Error("画布太小无法展示");

    // 记录鼠标移动的位置
    this.mx = 0;
    this.my = 0;

    // 记录当前地图中block的情况
    this.blocks = [];
    for (let i = 0; i < rows; i += 1) {
      this.blocks[i] = [];
      for (let j = 0; j < cols; j += 1) {
        // 编号从1开始
        const code = this.random();
        this.blocks[i][j] = new Block(this.game, code, ...this.where(i, j));
      }
    }

    // 记录当前状态机状态
    // 利用有限状态机来管理各种状态
    // 1. stable 静稳状态, 等待用户操作
    // 2. removing 判断并消除状态
    // 3. falling 下落状态, 消除后有些空隙，下落对齐
    // 4. suppling 补充状态, 消除之后，对齐之后，需要补充新的 block 进来
    // 4. animation 动画状态, 各种补间动画状态
    this.fsm = "removing"; // 初始就是判断消除状态
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

  // 取消激活
  cancelActived() {
    const [c, r] = this.currActived;
    this.blocks[c][r].actived = false;
    this.currActived = null;
  }

  mousedown(x, y) {
    // 只有静稳状态才可以操作
    if (this.fsm !== "stable") return;
    if (this.currActived) this.cancelActived();

    if (!this.isItOn(x, y)) return;
    // 按下的时候同时开始监听移动，这就是拖拽效果
    this.game.listenEvent("ontouchmove", "onmousemove", "mousemove");

    // 根据 x, y 来计算应该是哪个 block 被点击，这样比挨个尝试速度快很多
    this.currActived = this.which(x, y);
    this.blocks[this.currActived[0]][this.currActived[1]].actived = true;
  }

  mouseup() {
    if (this.currActived) {
      this.cancelActived();
      // 松开的时候移动移动事件监听
      this.game.removeListenEvent("onmousemove");
    }
  }

  mousemove(x, y) {
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
        this.cancelActived();
        // 松开的时候移动移动事件监听
        this.game.removeListenEvent("onmousemove");
      }
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
        this.willRemoved = this.calcWillBeRemoved();
        if (!this.willRemoved) {
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
      this.willRemoved = this.calcWillBeRemoved();
      // 如果没有需要消除的，则进入静稳状态
      if (!this.willRemoved) {
        this.fsm = "stable";
      } else {
        // 反之需要消除，进入动画状态
        this.fsm = "animation";
        // 移除这些模块
        this.willRemoved.forEach(x => this.remove(20, ...x));
        // 动画结束后进入下落状态
        this.game.registCallback(20, () => {
          this.fsm = "falling";
        });
      }
    } else if (this.fsm === "falling") {
      // 下落
      this.fall(20);
      // 进入动画状态
      this.fsm = "animation";
      // 动画结束后进入补充状态
      this.game.registCallback(20, () => {
        this.fsm = "suppling";
      });
    } else if (this.fsm === "suppling") {
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
    this.game.ctx.fillStyle = "rgba(0, 0, 0, 0.37)";
    this.game.ctx.fillRect(this.x - 5, this.y - 5, this.w + 10, this.h + 10);
    for (let i = 0; i < this.game.opts.rows; i += 1) {
      for (let j = 0; j < this.game.opts.cols; j += 1) {
        const block = this.blocks[i][j];
        if (!block) continue;
        block.update();
        block.render();
      }
    }
  }
}

module.exports = Map;

},{"./block":5,"open-game":2}],7:[function(require,module,exports){
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
    // 游戏场景加载
    this.scenes.start = new Start(this, "start");
  }
}

module.exports = Game;

},{"./actors/bg":4,"./actors/map":6,"./scenes/start":8,"open-game":2}],8:[function(require,module,exports){
const { Scene } = require("open-game");

class Start extends Scene {
  enter() {
    this.actors = ["bg", "map"];
  }
}

module.exports = Start;

},{"open-game":2}]},{},[7])(7)
});
