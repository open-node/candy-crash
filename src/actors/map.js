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
    if (level == null && this.levelComplated) level = this.game.nextLevel();
    this.levelComplated = false;
    this.game.setCurrLevel(level);
    this.game.actors.level.setValue(level);
    this.game.actors.timer.start(this.game.actors.level.value.time * 60);
    this.game.actors.score.setValue(0);
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

    // 记录当前地图中block的情况
    this.blocksReset();

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
          game.actors.congrantSmall.show();
          game.actors.congrantSmall.hide(60);
          game.registCallback(60, () => game.actors.replay.show());
        } else {
          game.actors.replay.show();
        }
      }
    );

    game.actors.congrantSmall = new ImageEffect(
      game,
      "congrantSmall",
      "center",
      "gold"
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
