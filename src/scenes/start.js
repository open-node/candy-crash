const { Scene } = require("open-game");

class Start extends Scene {
  enter() {
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
      "resetCard"
    ];
  }
}

module.exports = Start;
