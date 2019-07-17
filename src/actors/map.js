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

    this.blocksize = blocksize;
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
    this.code = [];
    this.blocks = [];
    for (let i = 0; i < rows; i += 1) {
      this.code[i] = [];
      this.blocks[i] = [];
      for (let j = 0; j < cols; j += 1) {
        // 编号从1开始
        this.code[i][j] = 1 + (((Math.random() * prim) | 0) % blocknum);
        this.blocks[i][j] = new Block(
          this.game,
          this.code[i][j],
          ...this.where(i, j)
        );
      }
    }
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

  removeActived() {
    const [c, r] = this.currActived;
    this.blocks[c][r].actived = false;
    this.currActived = null;
  }

  mousedown(x, y) {
    if (this.currActived) this.removeActived();

    if (!this.isItOn(x, y)) return;
    // 按下的时候同时开始监听移动，这就是拖拽效果
    this.game.listenEvent("onmousemove", "touchmove", "mousemove");

    // 根据 x, y 来计算应该是哪个 block 被点击，这样比挨个尝试速度快很多
    this.currActived = this.which(x, y);
    this.blocks[this.currActived[0]][this.currActived[1]].actived = true;
  }

  mouseup() {
    if (this.currActived) {
      this.removeActived();
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
        this.code[r][c] !== this.code[i][j] &&
        // 上下判断，列号相同，行号相差一
        ((c === j && Math.abs(r - i) === 1) ||
          // 左右判断判断, 行号相同，列号差一
          (r === i && Math.abs(c - j) === 1))
      ) {
        this.swap(r, c, i, j);
        // 移除移动事件监听
        this.removeActived();
        // 松开的时候移动移动事件监听
        this.game.removeListenEvent("onmousemove");
      }
    }
  }

  // 计算将要被消除的块
  calcWillBeRemoved() {
    return null;
  }

  // remove 消除一个块
  remove(r, c) {
    this.blocks[r][c].bomb(10);
    this.game.registCallback(10, () => {
      this.blocks[r][c] = null;
      this.code[r][c] = 0;
    });
  }

  // 交换两个 block
  swap(r, c, i, j, isValid = true) {
    // 图形交换
    this.blocks[r][c].moveTo(10, ...this.where(i, j));
    this.blocks[i][j].moveTo(10, ...this.where(r, c));
    // 数据交换
    this.game.registCallback(10, () => {
      let t = this.blocks[r][c];
      this.blocks[r][c] = this.blocks[i][j];
      this.blocks[i][j] = t;

      t = this.code[r][c];
      this.code[r][c] = this.code[i][j];
      this.code[i][j] = t;

      // 判断是否需要验证，还原的时候也是用这个函数，但是不需要验证了。
      if (isValid) {
        this.willRemoved = this.calcWillBeRemoved();
        if (!this.willRemoved) {
          // 如果不能消除，说明刚才的交换是错误的，需要恢复
          this.swap(i, j, r, c, false);
        }
      }
    });
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
  }
}

module.exports = Map;
