export default class Stage {
  constructor(contents = []) {
    this.canvas = document.getElementById("stage");
    this.ctx = this.canvas.getContext("2d");
    this.contents = contents;
    this.renderingThread = () => {};

    this.init();
  }

  init() {
    this.width = $(".wrapper").width();
    this.height = $(".wrapper").height();
    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);

    this.render();
  }

  * wait(loopFrame) {
    while (loopFrame--) {
      yield;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.contents.forEach((cnt) => {
      cnt.render();
    });
    this.renderingThread();
    requestAnimationFrame(::this.render);
  }
}

