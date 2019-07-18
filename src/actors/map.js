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
    this.game.listenEvent("onmousemove", "mousemove");

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
