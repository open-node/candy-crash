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
